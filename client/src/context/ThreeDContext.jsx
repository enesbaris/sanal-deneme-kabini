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

  // ✅ DEBUG EKLENDİ: Ürünü giy/çıkar
  const toggleWornItem = (product) => {
    console.log('🎮🎯🎯🎯 THREE DCONTEXT: toggleWornItem ÇAĞRILDI!');
    console.log('📦 Ürün bilgisi:', product);
    console.log('🏷️ Ürün adı:', product.name);
    console.log('📋 Ürün kategorisi:', product.category);
    console.log('🆔 Ürün ID:', product.id);
    
    setWornItems(prev => {
      console.log('📊 Önceki wornItems:', prev);
      
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        console.log('➖❌ Ürün SEPETTEN ÇIKARILDI:', product.name);
        const newWornItems = prev.filter(item => item.id !== product.id);
        console.log('🔄 Yeni wornItems:', newWornItems);
        return newWornItems;
      } else {
        console.log('➕✅ Ürün SEPETE EKLENDİ:', product.name);
        const newItem = { 
          ...product, 
          wornAt: new Date(),
          // ✅ MESH NAME EKLENDİ
          meshName: product.category === 'top' ? 'mesh_0' : 
                   product.category === 'bottom' ? 'CalculusTest01_0' : 'none'
        };
        console.log('🆕 Yeni ürün objesi:', newItem);
        const newWornItems = [...prev, newItem];
        console.log('🔄 Yeni wornItems:', newWornItems);
        return newWornItems;
      }
    });
  };

  // ✅ DEBUG EKLENDİ: Tüm giyilenleri temizle
  const clearWornItems = () => {
    console.log('🧹🗑️ Tüm giyilen ürünler temizlendi!');
    setWornItems([]);
  };

  // ✅ DEBUG EKLENDİ: Context değerini logla
  const value = {
    wornItems,
    toggleWornItem,
    clearWornItems,
    isLoading
  };

  console.log('🔄 ThreeDContext render edildi, wornItems:', wornItems);

  return (
    <ThreeDContext.Provider value={value}>
      {children}
    </ThreeDContext.Provider>
  );
};