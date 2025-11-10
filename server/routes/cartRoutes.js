const express = require('express');
const router = express.Router();

// Geçici sepet verisi
let tempCart = [];

// Geçici ürün listesi
const tempProducts = [
  { id: 1, name: "Mavi Tişört", price: 199.99, inStock: true },
  { id: 2, name: "Siyah Kot", price: 299.99, inStock: true },
  { id: 3, name: "Beyaz Ayakkabı", price: 599.99, inStock: true },
  { id: 4, name: "Gri Sweatshirt", price: 349.99, inStock: true },
  { id: 5, name: "Deri Ceket", price: 899.99, inStock: true },
  { id: 6, name: "Chino Pantolon", price: 399.99, inStock: true }
];

// Sepete ürün ekle
router.post('/add', (req, res) => {
  try {
    console.log('🔵 Sepete ekleme isteği:', req.body);
    
    const { productId, quantity = 1, userId } = req.body;
    
    // Validasyon
    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'productId ve userId gereklidir'
      });
    }
    
    // Geçici ürün listesinden ürünü bul
    const product = tempProducts.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }
    
    // Sepette var mı kontrol et
    const existingItemIndex = tempCart.findIndex(item => 
      item.product.id === product.id && item.userId === userId
    );
    
    if (existingItemIndex > -1) {
      // Varsa miktarı artır
      tempCart[existingItemIndex].quantity += quantity;
      console.log('✅ Sepetteki ürün güncellendi');
    } else {
      // Yoksa yeni ekle
      const newItem = {
        product: product,
        quantity: quantity,
        userId: userId,
        addedAt: new Date().toISOString()
      };
      tempCart.push(newItem);
      console.log('✅ Yeni ürün sepete eklendi');
    }
    
    // Sadece bu kullanıcının sepetini döndür
    const userCart = tempCart.filter(item => item.userId === userId);
    
    res.json({
      success: true,
      message: 'Ürün sepete eklendi',
      cart: userCart,
      total: calculateTotal(userCart)
    });
    
  } catch (error) {
    console.error('❌ Sepet hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Kullanıcının sepetini getir
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userCart = tempCart.filter(item => item.userId === parseInt(userId));
  
  res.json({
    success: true,
    cart: userCart,
    total: calculateTotal(userCart)
  });
});

// Sepetten ürün çıkar
router.delete('/remove/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  
  tempCart = tempCart.filter(item => 
    !(item.product.id === parseInt(productId) && item.userId === parseInt(userId))
  );
  
  const userCart = tempCart.filter(item => item.userId === parseInt(userId));
  
  res.json({
    success: true,
    message: 'Ürün sepetten çıkarıldı',
    cart: userCart,
    total: calculateTotal(userCart)
  });
});

// Toplam fiyat hesaplama
function calculateTotal(cart) {
  return cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
}

module.exports = router;