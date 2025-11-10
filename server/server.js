const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2/promise');
const cartRoutes = require('./routes/cartRoutes')
// Önce JWT_SECRET kontrolü - eğer yoksa otomatik oluştur
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'gecici_gelisitirme_anahtari_' + Date.now();
  console.log('⚠️  JWT_SECRET otomatik oluşturuldu');
}

// dotenv'i yükle
dotenv.config();

console.log('JWT_SECRET kontrol:', process.env.JWT_SECRET ? 'Tanımlı' : 'TANIMSIZ!');

const app = express();

// CORS ayarlarını düzgün yapılandır
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MySQL bağlantı havuzu oluşturma
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

// MySQL bağlantısını test etme
pool.getConnection()
  .then(connection => {
    console.log('MySQL Veritabanı Başarıyla Bağlandı.');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL Bağlantı Hatası:', err);
  });

// Rotalar
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const productRoutes = require('./routes/productRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend çalışıyor!', 
    timestamp: new Date().toISOString(),
    jwtSecret: process.env.JWT_SECRET ? 'Tanımlı' : 'Tanımsız'
  });
});

app.get('/', (req, res) => {
  res.send('API Calisiyor...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda calisiyor.`);
  console.log('JWT_SECRET durumu:', process.env.JWT_SECRET ? '✓ Tanımlı' : '✗ TANIMSIZ!');
  console.log('JWT_SECRET değeri:', process.env.JWT_SECRET);
});