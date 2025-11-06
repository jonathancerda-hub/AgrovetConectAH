import api from './api';

/**
 * Servicio de Autenticación
 */
export const authService = {
  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual desde localStorage
   * @returns {object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obtener datos actualizados del usuario desde la API
   * @returns {Promise<object>}
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    // Actualizar localStorage con datos frescos
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  /**
   * Verificar si hay un usuario autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener token actual
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
