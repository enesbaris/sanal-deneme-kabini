const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// MySQL bağlantı havuzu
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'veritabanii',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Register isteği alındı:', { username, email });

  // Validasyon
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Tüm alanları doldurun.' 
    });
  }

  try {
    // Kullanıcı var mı kontrol et
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Bu email veya kullanıcı adı zaten kullanılıyor.' 
      });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcıyı veritabanına ekle
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    console.log('Kullanıcı başarıyla kaydedildi, ID:', result.insertId);

    // JWT_SECRET kontrolü
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET tanımlı değil!');
      return res.status(500).json({
        success: false,
        message: 'Sunucu yapılandırma hatası'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: result.insertId },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // BAŞARILI YANIT
    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası: ' + error.message 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login isteği alındı:', { email });

  // Validasyon
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Tüm alanları doldurun.' 
    });
  }

  try {
    // Kullanıcıyı email ile bul
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Geçersiz email veya şifre.' 
      });
    }

    const user = users[0];

    // Şifreyi kontrol et (hash'lenmiş şifre ile karşılaştır)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Geçersiz email veya şifre.' 
      });
    }

    // JWT_SECRET kontrolü
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET tanımlı değil!');
      return res.status(500).json({
        success: false,
        message: 'Sunucu yapılandırma hatası'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: '1h' }
    );

    console.log('Giriş başarılı, user ID:', user.id);

    // BAŞARILI YANIT
    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası: ' + error.message 
    });
  }
};

module.exports = {
  register,
  login
};