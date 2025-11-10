const mysql = require('mysql2/promise');

// authController [cite: 360-387] ile aynı pool tanımı
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

// Profil bilgilerini getir (GERÇEK VERİ)
const getProfile = async (req, res) => {
  try {
    // 1. Adım: Middleware'den gelen userId'yi al (Bunu authMiddleware ekledi)
    const userId = req.userId; 

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Kullanıcı ID bulunamadı' });
    }

    // 2. Adım: Veritabanından kullanıcıyı çek
    const [rows] = await pool.execute(
      'SELECT id, username, email, preferences FROM users WHERE id = ?', 
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }

    const user = rows[0];

    // 3. Adım: Veritabanındaki 'preferences' (JSON string) verisini objeye çevir
    let preferences = {};
    if (user.preferences) {
      try {
        preferences = JSON.parse(user.preferences);
      } catch (e) {
        console.error('Preferences JSON parse hatası:', e);
      }
    }

    // 4. Adım: username, email ve preferences'ı BİRLİKTE gönder
    res.json({
      success: true,
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        preferences: preferences // Artık preferences da var
      }
    });

  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ success: false, message: 'Profil getirilemedi' });
  }
};

// Profil bilgilerini güncelle (GERÇEK VERİ)
const updateProfile = async (req, res) => {
  try {
    const { preferences } = req.body;
    const userId = req.userId; // Middleware'den gelen ID

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Kullanıcı ID bulunamadı' });
    }

    // Tercihleri veritabanına JSON string olarak kaydet
    const preferencesString = JSON.stringify(preferences);

    // 1. Adım: Güncelle
    await pool.execute(
      'UPDATE users SET preferences = ? WHERE id = ?', 
      [preferencesString, userId]
    );

    // 2. Adım: Güncellenmiş veriyi (username, email, preferences) geri döndür
    const [rows] = await pool.execute(
      'SELECT id, username, email FROM users WHERE id = ?', 
      [userId]
    );
    
    const user = rows[0];

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        preferences: preferences // Yeni güncellenen preferences objesi
      }
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ success: false, message: 'Profil güncellenemedi' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};