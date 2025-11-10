import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Form, Button, 
  Spinner, Alert, Badge 
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext'; // AuthContext'i import et

export default function ProfilePage() {
  const navigate = useNavigate();
  // AuthContext'ten ihtiyacımız olan her şeyi alıyoruz
  const { user, isAuthenticated, loading, updateProfilePreferences } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ 
    style: 'casual', 
    size: 'M', 
    favoriteColors: [] 
  });
  const [updateStatus, setUpdateStatus] = useState(null);

  // KORUMA: Giriş yapılmadıysa /login'e yönlendir
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // user verisi (preferences dahil) yüklendiğinde formu doldur
  useEffect(() => {
    if (user && user.preferences) {
      setFormData({
        style: user.preferences.style || 'casual',
        size: user.preferences.size || 'M',
        favoriteColors: user.preferences.favoriteColors || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const newColors = checked 
        ? [...formData.favoriteColors, value]
        : formData.favoriteColors.filter(color => color !== value);
      
      setFormData(prev => ({ ...prev, favoriteColors: newColors }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus(null);
    
    const result = await updateProfilePreferences(formData);
    
    if (result.success) {
      setUpdateStatus({ success: true, message: 'Tercihleriniz başarıyla güncellendi!' });
    } else {
      setUpdateStatus({ success: false, message: result.message });
    }
  };

  // Yüklenirken veya yönlendirilirken
  if (loading || !isAuthenticated) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Yükleniyor...</p>
      </Container>
    );
  }

  // Renk seçenekleri (Test amaçlı)
  const colorOptions = [
    { name: 'Mavi', value: 'blue' }, 
    { name: 'Siyah', value: 'black' }, 
    { name: 'Beyaz', value: 'white' }, 
    { name: 'Kırmızı', value: 'red' },
    { name: 'Gri', value: 'gray' }
  ];

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">👤 Hesap Bilgilerim</h1>
          <p className="text-muted">Kişisel bilgilerinizi ve stil tercihlerinizi yönetin.</p>
        </Col>
      </Row>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Genel Bilgiler</h5>
            </Card.Header>
            <Card.Body>
              {/* user objesi artık AuthContext'ten güvenle geliyor */}
              <p><strong>Kullanıcı Adı:</strong> {user?.username || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Hesap ID:</strong> <Badge bg="secondary">{user?.id || 'N/A'}</Badge></p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Stil Tercihleri</h5>
            </Card.Header>
            <Card.Body>
              {updateStatus && (
                <Alert variant={updateStatus.success ? "success" : "danger"}>
                  {updateStatus.message}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                
                {/* Beden */}
                <Form.Group className="mb-3">
                  <Form.Label>Beden Tercihi</Form.Label>
                  <Form.Select 
                    name="size" 
                    value={formData.size} 
                    onChange={handleChange}
                    required
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Bu bilgi, 3D modelde kıyafetleri doğru boyutta denemeniz için kritik.
                  </Form.Text>
                </Form.Group>

                {/* Stil */}
                <Form.Group className="mb-3">
                  <Form.Label>Genel Stil Tercihi</Form.Label>
                  <Form.Select 
                    name="style" 
                    value={formData.style} 
                    onChange={handleChange}
                    required
                  >
                    <option value="casual">Gündelik (Casual)</option>
                    <option value="sport">Spor</option>
                    <option value="business">İş/Resmi</option>
                  </Form.Select>
                </Form.Group>

                {/* Favori Renkler */}
                <Form.Group className="mb-4">
                  <Form.Label>Favori Renkleriniz (En fazla 3)</Form.Label>
                  <Row>
                    {colorOptions.map(color => (
                      <Col xs={6} sm={4} key={color.value}>
                        <Form.Check
                          type="checkbox"
                          id={`color-${color.value}`}
                          label={color.name}
                          name="favoriteColors"
                          value={color.value}
                          checked={formData.favoriteColors.includes(color.value)}
                          onChange={handleChange}
                          disabled={
                            !formData.favoriteColors.includes(color.value) && 
                            formData.favoriteColors.length >= 3
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                  <Form.Text className="text-muted">
                    Sistemimiz, bu renklere uygun kıyafetleri önceliklendirecektir.
                  </Form.Text>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}