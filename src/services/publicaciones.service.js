import api from './api';

/**
 * Servicio de Publicaciones
 */
export const publicacionesService = {
  /**
   * Obtener todas las publicaciones
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/publicaciones');
    return response.data;
  },

  /**
   * Crear nueva publicación
   * @param {object} publicacion - Datos de la publicación
   * @returns {Promise<object>}
   */
  create: async (publicacion) => {
    const response = await api.post('/publicaciones', publicacion);
    return response.data;
  },

  /**
   * Agregar reacción a una publicación
   * @param {number} id - ID de la publicación
   * @param {string} tipoReaccion - Tipo de reacción (like, love, celebrate)
   * @returns {Promise<object>}
   */
  addReaction: async (id, tipoReaccion = 'like') => {
    const response = await api.post(`/publicaciones/${id}/reaccionar`, { tipoReaccion });
    return response.data;
  },

  /**
   * Agregar comentario a una publicación
   * @param {number} id - ID de la publicación
   * @param {string} contenido - Contenido del comentario
   * @returns {Promise<object>}
   */
  addComment: async (id, contenido) => {
    const response = await api.post(`/publicaciones/${id}/comentar`, { contenido });
    return response.data;
  },

  /**
   * Obtener comentarios de una publicación
   * @param {number} id - ID de la publicación
   * @returns {Promise<Array>}
   */
  getComments: async (id) => {
    const response = await api.get(`/publicaciones/${id}/comentarios`);
    return response.data;
  }
};

export default publicacionesService;
