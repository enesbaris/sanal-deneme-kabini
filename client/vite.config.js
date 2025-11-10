import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    // Backend API'miz için proxy ayarı
    proxy: {
      // '/api' ile başlayan tüm istekleri yakala
      '/api': {
        target: 'http://localhost:5001', // Backend sunucunuzun adresi (sonra kuracağız)
        changeOrigin: true, // Sunucunun "origin"ini (kaynağını) değiştir
      }
    }
  }
})