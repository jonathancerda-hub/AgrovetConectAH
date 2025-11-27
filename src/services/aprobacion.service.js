import api from './api';

const aprobacionService = {
  /**
   * Obtener solicitudes según el rol del usuario
   * RRHH ve todas, supervisores solo las de sus subordinados
   */
  getSolicitudes: async () => {
    const response = await api.get('/aprobacion/solicitudes');
    return response.data;
  },

  /**
   * Aprobar una solicitud de vacaciones
   * @param {number} solicitudId - ID de la solicitud
   * @param {string} comentarios - Comentarios opcionales
   */
  aprobarSolicitud: async (solicitudId, comentarios = '') => {
    const response = await api.put(`/aprobacion/solicitudes/${solicitudId}`, {
      accion: 'aprobar',
      comentarios
    });
    return response.data;
  },

  /**
   * Rechazar una solicitud de vacaciones
   * @param {number} solicitudId - ID de la solicitud
   * @param {string} comentarios - Comentarios obligatorios
   */
  rechazarSolicitud: async (solicitudId, comentarios) => {
    if (!comentarios || comentarios.trim() === '') {
      throw new Error('Los comentarios son obligatorios al rechazar una solicitud');
    }
    
    const response = await api.put(`/aprobacion/solicitudes/${solicitudId}`, {
      accion: 'rechazar',
      comentarios
    });
    return response.data;
  },

  /**
   * Obtener lista de subordinados directos
   */
  getSubordinados: async () => {
    const response = await api.get('/aprobacion/subordinados');
    return response.data;
  }
};

export default aprobacionService;
