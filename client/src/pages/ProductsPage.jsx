import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import { 
  Container, Row, Col, Card, Button, 
  Badge, Alert, ButtonGroup, Spinner, Toast
} from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { useThreeD } from '../hooks/useThreeD'; // 3D Hook
import api from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWornItem } = useThreeD(); // 3D fonksiyonu
  const navigate = useNavigate(); // Yönlendirme hook'u

  const categories = [
    { key: 'all', label: '🏠 Tümü' },
    { key: 'top', label: '👕 Üst Giyim' },
    { key: 'bottom', label: '👖 Alt Giyim' },
    { key: 'shoes', label: '👟 Ayakkabı' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products');
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (err) {
      setError('Ürünler yüklenirken hata oluştu');
      console.error('Ürün yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = async (product) => {
    const result = await addToCart(product);
    if (result.success) {
      setToastMessage(`✅ ${product.name} sepete eklendi!`);
      setShowToast(true);
    } else {
      setToastMessage(`❌ ${result.message}`);
      setShowToast(true);
    }
  };

  // Güncellenmiş "Sanal Dene" fonksiyonu
  const handleTryOn = (product) => {
    toggleWornItem(product);
    navigate('/'); 
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Ürünler yükleniyor...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Toast Bildirimi */}
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)}
        style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 1050 }}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">🛒 Sepet</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      {/* Başlık */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">👕 Kıyafet Kataloğu</h1>
          <p className="text-muted">En yeni trendleri keşfedin ve sanal olarak deneyin</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Kategori Filtreleri */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Kategoriler</h5>
              <ButtonGroup>
                {categories.map(category => (
                  <Button
                    key={category.key}
                    variant={activeCategory === category.key ? "primary" : "outline-primary"}
                    onClick={() => setActiveCategory(category.key)}
                  >
                    {category.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ürün Grid */}
      <Row className="g-4">
        {filteredProducts.map(product => (
          <Col key={product.id} xs={12} sm={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm product-card">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={product.imageUrl}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                {!product.inStock && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    Stokta Yok
                  </Badge>
                )}
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{product.name}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">
                  {product.description}
                </Card.Text>
                
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="h5 text-primary mb-0">{product.price} ₺</span>
                    {/* ✅ HATA BURADAYDI, DÜZELTİLDİ */}
                    <Badge bg="secondary" text="light">
                      {product.category === 'top' && '👕'}
                      {product.category === 'bottom' && '👖'} 
                      {product.category === 'shoes' && '👟'}
                    </Badge> 
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleTryOn(product)} 
                    >
                      🎮 Sanal Dene
                    </Button>
                    
                    <Button 
                      variant={product.inStock ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? '🛒 Sepete Ekle' : 'Stokta Yok'}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Ürün Yoksa */}
      {filteredProducts.length === 0 && !loading && (
        <Row>
          <Col className="text-center py-5">
            <div className="display-1 text-muted mb-3">🛍️</div>
            <h4>Bu kategoride ürün bulunmuyor</h4>
            <p className="text-muted">Diğer kategorileri kontrol edin veya daha sonra tekrar ziyaret edin.</p>
            <Button 
              variant="outline-primary"
              onClick={() => setActiveCategory('all')}
            >
              Tüm Ürünleri Gör
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}