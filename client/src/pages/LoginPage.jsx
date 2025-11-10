// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// React-Bootstrap bileşenlerini import ediyoruz
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validasyon
    if (!email || !password) {
      setError('Tüm alanları doldurun.');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      console.error('Giriş başarısız:', err);
      // Backend'den gelen hata mesajını göster
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="pt-5">
      <Row className="justify-content-md-center">
        <Col md={6} lg={5} xl={4}>
          
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 p-md-5">
              
              <h2 className="text-center fw-bold mb-4">Giriş Yap</h2>
              
              {/* Hata mesajı (Bootstrap 'Alert' bileşeniyle) */}
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {/* Bootstrap Form bileşeni */}
              <Form onSubmit={handleSubmit}>
                
                {/* Email Alanı */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@adresiniz.com"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {/* Şifre Alanı */}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifreniz"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {/* Giriş Butonu */}
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  </Button>
                </div>
              </Form>

              {/* Kayıt sayfasına yönlendirme linki */}
              <div className="text-center mt-4">
                Hesabınız yok mu?{' '}
                <Link to="/register">
                  Kayıt Olun
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}