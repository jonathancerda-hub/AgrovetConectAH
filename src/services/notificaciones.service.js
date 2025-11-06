import api from './api';

/**
 * Servicio de Notificaciones
 */
export const notificacionesService = {
  /**
   * Obtener todas las notificaciones del usuario
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/notificaciones');
    return response.data;
  },

  /**
   * Obtener solo notificaciones no leídas
   * @returns {Promise<Array>}
   */
  getUnread: async () => {
    const response = await api.get('/notificaciones/no-leidas');
    return response.data;
  },

  /**
   * Marcar una notificación como leída
   * @param {number} id - ID de la notificación
   * @returns {Promise<object>}
   */
  markAsRead: async (id) => {
    const response = await api.put(`/notificaciones/${id}/leer`);
    return response.data;
  },

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise<object>}
   */
  markAllAsRead: async () => {
    const response = await api.put('/notificaciones/leer-todas');
    return response.data;
  },

  /**
   * Eliminar una notificación
   * @param {number} id - ID de la notificación
   * @returns {Promise<object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/notificaciones/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva notificación
   * @param {object} notificacionData - Datos de la notificación
   * @returns {Promise<object>}
   */
  create: async (notificacionData) => {
    const response = await api.post('/notificaciones', notificacionData);
    return response.data;
  }
};

export default notificacionesService;
