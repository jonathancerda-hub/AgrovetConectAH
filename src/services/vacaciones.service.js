import api from './api';

// Validar solicitud de vacaciones
export const validarSolicitud = async (solicitudData) => {
  const response = await api.post('/vacaciones/validar', solicitudData);
  return response.data;
};

// Crear solicitud de vacaciones
export const crearSolicitud = async (solicitudData) => {
  const response = await api.post('/vacaciones/solicitudes', solicitudData);
  return response.data;
};

// Obtener resumen de vacaciones del empleado
export const obtenerResumen = async (empleadoId) => {
  const url = empleadoId ? `/vacaciones/resumen/${empleadoId}` : '/vacaciones/resumen';
  const response = await api.get(url);
  return response.data;
};

// Obtener períodos vacacionales del empleado
export const obtenerPeriodos = async (empleadoId) => {
  const url = empleadoId ? `/vacaciones/periodos/${empleadoId}` : '/vacaciones/periodos';
  const response = await api.get(url);
  return response.data;
};

// Obtener solicitudes del empleado
export const obtenerSolicitudes = async (empleadoId, estado) => {
  const url = empleadoId ? `/vacaciones/solicitudes/${empleadoId}` : '/vacaciones/solicitudes';
  const params = estado ? { estado } : {};
  const response = await api.get(url, { params });
  return response.data;
};

// Obtener solicitudes pendientes de aprobación
export const obtenerSolicitudesPendientes = async () => {
  const response = await api.get('/vacaciones/solicitudes-pendientes');
  return response.data;
};

// Aprobar solicitud
export const aprobarSolicitud = async (solicitudId, comentarios) => {
  const response = await api.put(`/vacaciones/solicitudes/${solicitudId}/aprobar`, { comentarios });
  return response.data;
};

// Rechazar solicitud
export const rechazarSolicitud = async (solicitudId, motivo) => {
  const response = await api.put(`/vacaciones/solicitudes/${solicitudId}/rechazar`, { motivo });
  return response.data;
};


// Obtener notificaciones
export const obtenerNotificaciones = async (leida) => {
  const params = leida !== undefined ? { leida } : {};
  const response = await api.get('/vacaciones/notificaciones', { params });
  return response.data;
};

// Marcar notificación como leída
export const marcarNotificacionLeida = async (notificacionId) => {
  const response = await api.put(`/vacaciones/notificaciones/${notificacionId}/leer`);
  return response.data;
};

// Obtener tipos de trabajador
export const obtenerTiposTrabajador = async () => {
  const response = await api.get('/vacaciones/tipos-trabajador');
  return response.data;
};

// Obtener feriados del año
export const obtenerFeriados = async (anio) => {
  const params = anio ? { anio } : {};
  const response = await api.get('/vacaciones/feriados', { params });
  return response.data;
};

const vacacionesService = {
  validarSolicitud,
  crearSolicitud,
  obtenerResumen,
  getResumenVacaciones: obtenerResumen, // Alias para compatibilidad
  obtenerPeriodos,
  obtenerSolicitudes,
  obtenerMisSolicitudes: () => obtenerSolicitudes(), // Sin empleadoId obtiene las del usuario actual
  obtenerSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
  obtenerNotificaciones,
  marcarNotificacionLeida,
  obtenerTiposTrabajador,
  obtenerFeriados,
};

export { vacacionesService };
export default vacacionesService;
