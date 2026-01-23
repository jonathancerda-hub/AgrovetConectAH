import api from './api';

export const feriadosService = {
  /**
   * Obtener todos los feriados
   */
  getAll: async (anio = null) => {
    const params = anio ? { anio } : {};
    const response = await api.get('/feriados', { params });
    return response.data;
  },

  /**
   * Obtener feriado por ID
   */
  getById: async (id) => {
    const response = await api.get(`/feriados/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo feriado
   */
  create: async (feriadoData) => {
    const response = await api.post('/feriados', feriadoData);
    return response.data;
  },

  /**
   * Actualizar feriado
   */
  update: async (id, feriadoData) => {
    const response = await api.put(`/feriados/${id}`, feriadoData);
    return response.data;
  },

  /**
   * Eliminar feriado
   */
  delete: async (id) => {
    const response = await api.delete(`/feriados/${id}`);
    return response.data;
  },

  /**
   * Obtener años disponibles
   */
  getAnios: async () => {
    const response = await api.get('/feriados/anios');
    return response.data;
  }
};

export default feriadosService;
