import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ❌ YANLIŞ IMPORT (Hata veren yol)
// import { useCart } from '../../hooks/useCart'; 

// ✅ DOĞRU IMPORT (useCart, CartContext.jsx  içinden geliyor)
import { useCart } from '../../context/CartContext'; 

// React-Bootstrap bileşenleri
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge'; 

export default function NavbarComponent() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart(); // Burası artık doğru dosyadan (CartContext.jsx) gelecek 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar fixed="top" bg="white" expand="lg" className="shadow-sm" style={{ height: '80px' }}>
      <Container>
        
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0d6efd' }}>
          SanalDeneme
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            <Nav.Link as={Link} to="/">
              🏠 Ana Sayfa
            </Nav.Link>
            
            <Nav.Link as={Link} to="/products">
              🛍️ Ürünler
            </Nav.Link>

            <Nav.Link as={Link} to="/cart" className="position-relative">
              🛒 Sepet
              {getCartCount() > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.6rem' }}
                >
                  {getCartCount()}
                </Badge>
              )}
            </Nav.Link>
            
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  👤 Profil
                </Nav.Link>

                <NavDropdown title={`Merhaba, ${user?.username || user?.email}`} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>
                    Çıkış Yap
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Giriş Yap
                </Nav.Link>
                
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="ms-2"
                >
                  Kayıt Ol
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}