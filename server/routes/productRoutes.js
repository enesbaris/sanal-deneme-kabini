const express = require('express');
const router = express.Router();

// Test ürün verileri - FastAPI'ye geçince bu kalkacak
const testProducts = [
  {
    id: 1,
    name: "Mavi Basic Tişört",
    category: "top",
    price: 149.99,
    imageUrl: "https://via.placeholder.com/300x400/007bff/ffffff?text=Mavi+Tişört",
    description: "Rahat ve şık mavi tişört",
    inStock: true,
    meshName: "mesh_0" // 3D modeldeki mesh adı
  },
  {
    id: 2,
    name: "Siyah Slim Kot",
    category: "bottom", 
    price: 299.99,
    imageUrl: "https://via.placeholder.com/300x400/343a40/ffffff?text=Siyah+Kot",
    description: "Slim fit siyah kot pantolon",
    inStock: true,
    meshName: "CalculusTest01_0"
  },
  {
    id: 3,
    name: "Beyaz Spor Ayakkabı",
    category: "shoes",
    price: 399.99,
    imageUrl: "https://via.placeholder.com/300x400/ffffff/000000?text=Beyaz+Ayakkabı",
    description: "Rahat beyaz spor ayakkabı",
    inStock: false,
    meshName: "mesh_0"
  },
  {
    id: 4,
    name: "Gri Sweatshirt",
    category: "top",
    price: 229.99,
    imageUrl: "https://via.placeholder.com/300x400/6c757d/ffffff?text=Gri+Sweatshirt",
    description: "Sıcak ve konforlu gri sweatshirt",
    inStock: true,
    meshName: "CalculusTest01_0"
  },
  {
    id: 5,
    name: "Kahverengi Deri Ceket",
    category: "top",
    price: 599.99,
    imageUrl: "https://via.placeholder.com/300x400/8B4513/ffffff?text=Deri+Ceket",
    description: "Şık kahverengi deri ceket",
    inStock: true,
    meshName: "mesh_0"
  },
  {
    id: 6,
    name: "Bej Chino Pantolon",
    category: "bottom",
    price: 249.99,
    imageUrl: "https://via.placeholder.com/300x400/F5F5DC/000000?text=Chino+Pantolon",
    description: "Rahat bej chino pantolon",
    inStock: true,
    meshName: "CalculusTest01_0"
  }
];

// Tüm ürünleri getir
router.get('/', (req, res) => {
  res.json({
    success: true,
    products: testProducts
  });
});

// Kategoriye göre ürünleri getir
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const filteredProducts = testProducts.filter(product => 
    product.category === category
  );
  
  res.json({
    success: true,
    products: filteredProducts
  });
});

// ID'ye göre ürün getir
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = testProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Ürün bulunamadı'
    });
  }
  
  res.json({
    success: true,
    product: product
  });
});

module.exports = router;