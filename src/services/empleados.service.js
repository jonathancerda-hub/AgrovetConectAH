import api from './api';

/**
 * Servicio de Empleados
 */
export const empleadosService = {
  /**
   * Obtener todos los empleados
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },

  /**
   * Obtener empleado por ID
   * @param {number} id - ID del empleado
   * @returns {Promise<object>}
   */
  getById: async (id) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo empleado
   * @param {object} empleado - Datos del empleado
   * @returns {Promise<object>}
   */
  create: async (empleado) => {
    const response = await api.post('/empleados', empleado);
    return response.data;
  },

  /**
   * Actualizar empleado
   * @param {number} id - ID del empleado
   * @param {object} empleado - Datos actualizados
   * @returns {Promise<object>}
   */
  update: async (id, empleado) => {
    const response = await api.put(`/empleados/${id}`, empleado);
    return response.data;
  },

  /**
   * Desactivar empleado (baja)
   * @param {number} id - ID del empleado
   * @param {object} data - Fecha de salida y motivo
   * @returns {Promise<object>}
   */
  desactivar: async (id, data) => {
    const response = await api.patch(`/empleados/${id}/desactivar`, data);
    return response.data;
  },

  /**
   * Obtener lista de puestos
   * @returns {Promise<Array>}
   */
  getPuestos: async () => {
    const response = await api.get('/empleados/puestos');
    return response.data;
  },

  /**
   * Obtener lista de áreas
   * @returns {Promise<Array>}
   */
  getAreas: async () => {
    const response = await api.get('/empleados/areas');
    return response.data;
  }
};

export default empleadosService;
