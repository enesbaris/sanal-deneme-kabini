import React, { createContext, useState, useContext } from 'react';

// ✅ CONTEXT'I EXPORT ET! - BU EKSİKTİ
export const ThreeDContext = createContext(); // ← EXPORT EKLENDİ

// Custom Hook
export const useThreeD = () => {
  const context = useContext(ThreeDContext);
  if (!context) {
    throw new Error('useThreeD must be used within a ThreeDProvider');
  }
  return context;
};

// Provider Component
export const ThreeDProvider = ({ children }) => {
  const [wornItems, setWornItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ürünü giy/çıkar
  const toggleWornItem = (product) => {
    console.log('🎮 3D Deneme:', product.name);
    setWornItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        console.log('➖ Ürün çıkarıldı:', product.name);
        return prev.filter(item => item.id !== product.id);
      } else {
        console.log('➕ Ürün giyildi:', product.name);
        return [...prev, { ...product, wornAt: new Date() }];
      }
    });
  };

  // Tüm giyilenleri temizle
  const clearWornItems = () => {
    setWornItems([]);
    console.log('🧹 Tüm giyilen ürünler temizlendi');
  };

  // Context value
  const value = {
    wornItems,
    toggleWornItem,
    clearWornItems,
    isLoading
  };

  return (
    <ThreeDContext.Provider value={value}>
      {children}
    </ThreeDContext.Provider>
  );
};