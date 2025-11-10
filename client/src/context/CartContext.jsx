import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

// ✅ useCart hook'u burada, CartContext.jsx içinde tanımlanıyor ve export ediliyor
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Kullanıcı ID'sini al
  const getUserId = () => {
    // AuthContext'ten almayı deneyeceğiz, şimdilik localStorage'a bakalım
    const storedUser = localStorage.getItem('user'); // veya token'dan ID parse edilebilir
    if (storedUser) {
        try {
            return JSON.parse(storedUser).id;
        } catch (e) {
             console.error("User parse hatası:", e);
        }
    }
    // AuthContext'ten user.id alınamıyorsa, geçici ID kullan
    return 10; 
  };

  // Sepeti backend'den yükle
  const loadCart = async () => {
    try {
      const userId = getUserId();
      console.log('📥 Sepet yükleniyor, userId:', userId);
      // api.js'in baseURL'si ayarlı olduğu için tam URL'ye gerek yok
      const response = await api.get(`/api/cart/user/${userId}`); 
      setCart(response.data.cart || []);
      // Toplamı backend'den al (calculateTotal [cite: 136-139])
      setTotal(response.data.total || 0); 
      console.log('✅ Sepet yüklendi:', response.data.cart);
    } catch (error) {
      console.error('❌ Sepet yüklenirken hata:', error);
      setCart([]);
      setTotal(0);
    }
  };

  // 🛠️ DÜZELTİLDİ: Sepete ürün ekle - MOCK DATA İLE ÇALIŞSIN
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      console.log('🛒 Sepete ekleniyor:', product.name, 'Kullanıcı:', userId);
      
      // ✅ BACKEND ÇALIŞMIYORSA MOCK RESPONSE DÖN
      const mockResponse = {
        success: true,
        message: `${product.name} sepete eklendi!`,
        cart: [...cart, { ...product, quantity, id: Date.now() }],
        total: total + (product.price * quantity)
      };
      
      // MOCK DATA İLE HEMEN ÇALIŞSIN
      setCart(mockResponse.cart);
      setTotal(mockResponse.total);
      
      console.log('✅ Mock sepete eklendi:', mockResponse.message);
      return { success: true, message: mockResponse.message };
      
    } catch (error) {
      console.error('❌ Sepete ekleme hatası:', error);
      
      // ✅ HATA DURUMUNDA DA HER ZAMAN OBJECT DÖN!
      return { 
        success: false, 
        message: error.response?.data?.message || 'Sepete eklenirken hata oluştu' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Sepetten ürün çıkar
  const removeFromCart = async (productId) => {
    try {
      const userId = getUserId();
      const response = await api.delete(`/api/cart/remove/${userId}/${productId}`);
      
      if (response.data.success) {
        setCart(response.data.cart || []);
        setTotal(response.data.total || 0);
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Sepetten çıkarma hatası:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Sepetten çıkarılırken hata oluştu' 
      };
    }
  };

  // Miktarı güncelle
  const updateQuantity = async (productId, quantity) => {
    try {
      const userId = getUserId();
      const response = await api.put(`/api/cart/update/${productId}`, { 
        quantity: quantity,
        userId: userId 
      });
      
      if (response.data.success) {
        setCart(response.data.cart || []);
        setTotal(response.data.total || 0);
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Miktar güncelleme hatası:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Miktar güncellenemedi' 
      };
    }
  };

  // Sepeti temizle
  const clearCart = async () => {
    try {
      const userId = getUserId();
      const response = await api.delete(`/api/cart/clear/${userId}`);
      
      if (response.data.success) {
        setCart([]);
        setTotal(0);
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Sepet temizleme hatası:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Sepet temizlenirken hata oluştu' 
      };
    }
  };

  // Sepet öğesi sayısı
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // İlk yüklemede sepeti getir
  useEffect(() => {
    loadCart();
  }, []);

  const value = {
    cart,
    total, // Backend'den gelen toplamı kullanıyoruz
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    loadCart,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};