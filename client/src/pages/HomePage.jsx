// HomePage.jsx - GÜNCELLE:
import React, { useState, useEffect } from 'react';
import AvatarCanvas from '../components/3d/AvatarCanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../hooks/useAuth';
import { useThreeD } from '../hooks/useThreeD'; // ✅ THREE DCONTEXT EKLE

export default function HomePage() {
  const [activeMeshName, setActiveMeshName] = useState('CalculusTest01_0'); 
  const { isAuthenticated, user } = useAuth();
  const { wornItems, toggleWornItem, clearWornItems } = useThreeD(); // ✅ THREE D HOOK

  // ✅ THREE DCONTEXT'TEKİ DEĞİŞİKLİKLERİ DİNLE
  useEffect(() => {
    console.log('🎮 Giyilen ürünler güncellendi:', wornItems);
    
    if (wornItems.length > 0) {
      // Son giyilen ürünü aktif yap
      const lastWornItem = wornItems[wornItems.length - 1];
      console.log('👕 Son giyilen ürün:', lastWornItem.name);
      
      // Ürün kategorisine göre mesh seç
      if (lastWornItem.category === 'top') {
        setActiveMeshName('CalculusTest01_0'); // Üst giyim
      } else if (lastWornItem.category === 'bottom') {
        setActiveMeshName('mesh_0'); // Alt giyim
      }
    }
  }, [wornItems]);

  // ✅ TÜM KIYAFETLERİ ÇIKAR
  const handleUndressAll = () => {
    setActiveMeshName('none');
    clearWornItems();
    console.log('🚫 Tüm kıyafetler çıkarıldı');
  };

  return (
    <Container fluid="lg" className="pt-4">
      <Row className="g-4">
        
        {/* Sol Taraf: Kıyafet Seçenekleri Paneli */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Header as="h5" className="fw-bold bg-white border-0 pt-3">
              👕 Kıyafet Seçenekleri
            </Card.Header>
            <Card.Body>
              
              <div className="d-grid gap-3">
                <Button 
                  variant={activeMeshName === 'CalculusTest01_0' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveMeshName('CalculusTest01_0')} 
                  size="lg"
                >
                  🧥 Birinci Kıyafet
                </Button>
                
                <Button 
                  variant={activeMeshName === 'mesh_0' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveMeshName('mesh_0')}
                  size="lg"
                >
                  👕 İkinci Kıyafet
                </Button>
                
                <hr />

                <Button 
                  variant="outline-danger"
                  onClick={handleUndressAll}
                  size="lg"
                >
                  🚫 Kıyafetleri Çıkar
                </Button>
              </div>

              {/* Aktif kıyafet bilgisi */}
              <div className="mt-3 p-2 bg-light rounded">
                <small>
                  <strong>Şu an:</strong> {
                    activeMeshName === 'CalculusTest01_0' ? '🧥 Birinci Kıyafet' :
                    activeMeshName === 'mesh_0' ? '👕 İkinci Kıyafet' :
                    '🚫 Kıyafetsiz'
                  }
                </small>
              </div>

              {/* ✅ GİYİLEN ÜRÜNLER LİSTESİ */}
              {wornItems.length > 0 && (
                <div className="mt-3">
                  <h6>👗 Giyilen Ürünler:</h6>
                  <div className="small">
                    {wornItems.map(item => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center mb-1">
                        <span>{item.name}</span>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => toggleWornItem(item)}
                        >
                          Çıkar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Kullanıcı bilgisi */}
          {isAuthenticated && (
            <Card className="shadow-sm border-0 mt-4">
              <Card.Body>
                <h6>🎉 Hoş geldin, {user?.username}!</h6>
                <p className="text-muted mb-0">
                  Kıyafetleri dene ve beğenilerini kaydet.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sağ Taraf: 3D Model Sahnesi */}
        <Col md={8}>
          <Card className="shadow-lg border-0">
            <Card.Header as="h5" className="fw-bold bg-white">
              🎮 3D Sanal Deneme Kabini
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ height: '70vh', minHeight: '500px' }}>
                <AvatarCanvas activeMeshName={activeMeshName} />
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}