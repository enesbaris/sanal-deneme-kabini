// client/src/context/ThreeDContext.jsx
import React, { createContext, useState, useContext } from 'react';

export const ThreeDContext = createContext();

// VARSAYILAN (DEFAULT) KIYAFETLER (Hatasız Versiyon)
const DEFAULT_TOP = {
  id: 1, // Mavi Basic Tişört
  category: 'top',
  meshName: 'mesh_0',
};
const DEFAULT_BOTTOM = {
  id: 2, // Siyah Slim Kot
  category: 'bottom',
  meshName: 'CalculusTest01_0',
};

export const ThreeDProvider = ({ children }) => {
  // useState'i varsayılan kıyafetlerle başlat
  const [wornItems, setWornItems] = useState({
    top: DEFAULT_TOP,
    bottom: DEFAULT_BOTTOM,
    shoes: null,
  });

  // Bir ürünü giydirmek veya çıkarmak için kullanılacak fonksiyon
  const toggleWornItem = (product) => {
    if (!product || !product.category) {
      console.error('Geçersiz ürün veya kategori:', product);
      return;
    }
    
    const category = product.category; // 'top', 'bottom', veya 'shoes'

    setWornItems(prevItems => {
      // 1. Durum: Zaten aynı ürün giyiliyorsa, onu çıkar
      if (prevItems[category] && prevItems[category].id === product.id) {
        return { ...prevItems, [category]: null };
      }
      // 2. Durum: Farklı bir ürün giyiliyorsa veya kategori boşsa, yeni ürünü giydir
      else {
        return { ...prevItems, [category]: product };
      }
    });
  };

  // Bu değerleri tüm uygulamaya aç
  const value = {
    wornItems,       // Hangi kıyafetlerin giyili olduğunu gösteren obje
    toggleWornItem,  // Kıyafet değiştiren fonksiyon
  };

  return (
    <ThreeDContext.Provider value={value}>
      {children}
    </ThreeDContext.Provider>
  );
};