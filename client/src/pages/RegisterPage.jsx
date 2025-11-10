// client/src/pages/RegisterPage.jsx
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

export default function RegisterPage() {
  // Form state'leri (bu sefer 'username' de var)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validasyon
    if (!username || !email || !password) {
      setError('Tüm alanları doldurun.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      navigate('/'); 
    } catch (err) {
      console.error('Kayıt başarısız:', err);
      // Backend'den gelen hata mesajını göster
      setError(err.message || 'Kayıt başarısız. Bu email veya kullanıcı adı alınmış olabilir.');
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
              
              <h2 className="text-center fw-bold mb-4">Kayıt Ol</h2>
              
              {/* Hata mesajı (Bootstrap 'Alert' bileşeniyle) */}
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {/* Bootstrap Form bileşeni */}
              <Form onSubmit={handleSubmit}>
                
                {/* Kullanıcı Adı Alanı */}
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınız"
                    required
                    disabled={loading}
                  />
                </Form.Group>

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
                    placeholder="Şifreniz (en az 6 karakter)"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {/* Kayıt Ol Butonu */}
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                  </Button>
                </div>
              </Form>

              {/* Giriş sayfasına yönlendirme linki */}
              <div className="text-center mt-4">
                Zaten hesabınız var mı?{' '}
                <Link to="/login">
                  Giriş Yapın
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}