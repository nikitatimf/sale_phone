const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    API_URL: 'https://sale-phone-1-iqy2.onrender.com/'
  }
};

// Определяем текущее окружение
const environment = process.env.NODE_ENV || 'development';

// Экспортируем нужный URL
export const API_URL = config[environment].API_URL;

// Экспортируем полные URL для разных эндпоинтов
export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  USER: `${API_URL}/api/user`,
  PROFILE: `${API_URL}/api/profile`,
  FAVORITES: `${API_URL}/api/favorites`,
  CART: `${API_URL}/api/cart`,
  ORDERS: `${API_URL}/api/orders`,
  PHONES: `${API_URL}/phones`
};