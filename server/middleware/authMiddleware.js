// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Header'dan token'ı al (Bearer TOKEN_STRING)
    const token = req.headers.authorization.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Kimlik doğrulaması başarısız: Token bulunamadı' });
    }

    // Token'ı doğrula
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // request objesine (req) kullanıcının ID'sini ekle
    // Not: authController'da token'ı { userId: ... } [cite: 371, 384] olarak imzaladığımız için burada decodedToken.userId kullanıyoruz
    req.userId = decodedToken.userId; 
    
    // Bir sonraki adıma (controller'a) geç
    next();

  } catch (error) {
    console.error('Middleware hatası:', error.message);
    return res.status(401).json({ success: false, message: 'Kimlik doğrulaması başarısız: Geçersiz token' });
  }
};