const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ 1. Middleware'i import et

// GET /api/profile -> Profil bilgilerini getir
// ✅ 2. authMiddleware'i araya ekle
router.get('/', authMiddleware, profileController.getProfile);

// PUT /api/profile -> Profil bilgilerini güncelle
// ✅ 3. authMiddleware'i araya ekle
router.put('/', authMiddleware, profileController.updateProfile);

module.exports = router;