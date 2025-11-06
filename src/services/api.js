import axios from 'axios';

// URL del backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
});

// Interceptor para agregar el token JWT en cada petición
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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      console.error('Error de API:', error.response.data);
      
      // Si el token expiró (401), limpiar localStorage
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    } else if (error.request) {
      // Error de red (no hubo respuesta)
      console.error('Error de red:', error.request);
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
