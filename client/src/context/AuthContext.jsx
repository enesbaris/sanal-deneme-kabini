import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ GÜNCELLENMİŞ useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    // Token varsa, header'a ekle
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // ✅ YENİ EKLENEN KISIM:
    // Token ile profil bilgilerini çekerek kullanıcıyı "girişte" tut
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/profile');
        if (response.data.success) {
          // Profil verisi ile user state'ini güncelle
          // (Daha önce oluşturduğumuz controller, profile.preferences'ı da içeriyor)
          setUser(response.data.profile); 
        } else {
          // Token geçersizse veya profil bulunamadıysa çıkış yap
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } catch (error) {
        console.error('Oturum doğrulama hatası:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = response.data;
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        // ✅ DEĞİŞİKLİK: Sadece user değil, profil verisini de çekmeliyiz
        // Login sonrası /api/profile'a istek atalım
        const profileResponse = await api.get('/api/profile');
        setUser(profileResponse.data.profile); // Tüm profil bilgisi (preferences dahil)
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Giriş başarısız:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Giriş başarısız';
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      const data = response.data;
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        // ✅ DEĞİŞİKLİK: Register sonrası da /api/profile'a istek atalım
        const profileResponse = await api.get('/api/profile');
        setUser(profileResponse.data.profile); // Tüm profil bilgisi (preferences dahil)
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Kayıt başarısız:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Kayıt başarısız';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // ✅ YENİ FONKSİYON: Profil tercihlerini güncelle
  const updateProfilePreferences = async (newPreferences) => {
    try {
      const response = await api.put('/api/profile', {
        preferences: newPreferences
      });
      
      if (response.data.success) {
        // user state'ini yeni profil verisiyle güncelle
        setUser(prevUser => ({
          ...prevUser,
          ...response.data.profile // Controller'dan dönen güncel profile objesi
        }));
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      return { success: false, message: 'Profil güncellenemedi.' };
    }
  };


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Yükleniyor...</h1>
      </div>
    );
  }

  // ✅ GÜNCELLENMİŞ VALUE: loading ve updateProfilePreferences'ı ekledik
  return (
    <AuthContext.Provider value={{ 
        user,
        loading, // Yönlendirme ve koruma için gerekli
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateProfilePreferences // Yeni fonksiyon
    }}>
      {children}
    </AuthContext.Provider>
  );
};