// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import NavbarComponent from './components/layout/Navbar'; 

// Sayfalar
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage'; // ✅ YORUM SATIRINI KALDIRDIK/EKLEDİK

function App() {
  return (
    <>
      <NavbarComponent />

      <main className="app-content"> 
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* ✅ ROTAYI EKLEDİK */}
          
        </Routes>
      </main>
    </>
  );
}

export default App;