// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // backend URL'iniz
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor'ı (token eklemek için)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı (hata yönetimi)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - giriş sayfasına yönlendir
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;