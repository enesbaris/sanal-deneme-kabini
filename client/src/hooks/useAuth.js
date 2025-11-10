// client/src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Az önce oluşturduğumuz Context

/**
 * Bu, 'AuthContext'i kullanmak için özel bir hook'tur.
 *
 * Neden böyle bir şeye ihtiyacımız var?
 * Normalde, AuthContext'i kullanmak için bir bileşende şu iki satırı yazmamız gerekir:
 *
 * import { useContext } from 'react';
 * import { AuthContext } from '../context/AuthContext';
 * const auth = useContext(AuthContext);
 *
 * Bu hook sayesinde, artık sadece şu tek satırı yazmamız yeterli olacak:
 *
 * import { useAuth } from '../hooks/useAuth';
 * const auth = useAuth();
 *
 * Bu, kodumuzu daha temiz ve yönetilebilir hale getirir.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Bir hata kontrolü ekliyoruz:
  // Eğer context 'undefined' ise, bu, 'useAuth' hook'unun
  // 'AuthProvider' (AuthContext.jsx'teki) tarafından sarmalanmamış
  // bir yerde çağrıldığı anlamına gelir. Bu bir hatadır.
  if (context === undefined) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır');
  }

  // Eğer context varsa, içindeki her şeyi (user, login, logout...) döndür
  return context;
};