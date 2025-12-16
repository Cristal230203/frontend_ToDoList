// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'https://todolist-backend-2k8o.onrender.com/api',
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Rutas de la API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TODOS: {
    BASE: '/todos',
    BY_ID: (id) => `/todos/${id}`,
  },
};
