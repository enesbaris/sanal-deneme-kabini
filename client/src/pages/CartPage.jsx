import React from 'react';
import { 
  Container, Row, Col, Card, Button, 
  Badge, Alert, Table, Form
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const { cart, total, loading, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-2">Sepet yükleniyor...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Başlık */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">🛒 Alışveriş Sepetim</h1>
          <p className="text-muted">Sepetinizdeki ürünleri görüntülüyorsunuz</p>
        </Col>
      </Row>

      {cart.length === 0 ? (
        // Boş sepet
        <Row>
          <Col className="text-center py-5">
            <div className="display-1 text-muted mb-3">🛒</div>
            <h4>Sepetiniz boş</h4>
            <p className="text-muted mb-4">Alışverişe başlamak için ürünlere göz atın</p>
            <Button as={Link} to="/products" variant="primary" size="lg">
              🛍️ Alışverişe Başla
            </Button>
          </Col>
        </Row>
      ) : (
        // Dolu sepet
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Sepetim ({cart.length} ürün)</h5>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleClearCart}
                >
                  🗑️ Sepeti Temizle
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Ürün</th>
                      <th>Fiyat</th>
                      <th>Miktar</th>
                      <th>Toplam</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.cartItemId || item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.imageUrl || `https://via.placeholder.com/60x60/6c757d/ffffff?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="rounded me-3"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/60x60/6c757d/ffffff?text=${encodeURIComponent(item.name)}`;
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{item.name}</h6>
                              <small className="text-muted">{item.description}</small>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          <strong>{item.price} ₺</strong>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="mx-2 text-center"
                              style={{ width: '60px' }}
                              min="1"
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="align-middle">
                          <strong className="text-primary">
                            {(item.price * item.quantity).toFixed(2)} ₺
                          </strong>
                        </td>
                        <td className="align-middle">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Özet */}
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">🛒 Sipariş Özeti</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Ara Toplam:</span>
                  <span>{total.toFixed(2)} ₺</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Kargo:</span>
                  <span className="text-success">Ücretsiz</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Toplam:</strong>
                  <strong className="text-primary h5">{total.toFixed(2)} ₺</strong>
                </div>

                {isAuthenticated ? (
                  <Button variant="success" size="lg" className="w-100">
                    🚀 Satın Al
                  </Button>
                ) : (
                  <Alert variant="warning" className="text-center">
                    <small>Satın almak için giriş yapmalısınız</small>
                    <div className="mt-2">
                      <Button as={Link} to="/login" variant="primary" size="sm" className="me-2">
                        Giriş Yap
                      </Button>
                      <Button as={Link} to="/register" variant="outline-primary" size="sm">
                        Kayıt Ol
                      </Button>
                    </div>
                  </Alert>
                )}

                <Button 
                  as={Link} 
                  to="/products" 
                  variant="outline-primary" 
                  className="w-100 mt-2"
                >
                  🛍️ Alışverişe Devam Et
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}