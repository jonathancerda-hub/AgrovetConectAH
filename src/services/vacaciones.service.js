import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_URL}/api/vacaciones`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Validar solicitud de vacaciones
export const validarSolicitud = async (solicitudData) => {
  const response = await api.post('/validar', solicitudData);
  return response.data;
};

// Crear solicitud de vacaciones
export const crearSolicitud = async (solicitudData) => {
  const response = await api.post('/solicitudes', solicitudData);
  return response.data;
};

// Obtener resumen de vacaciones del empleado
export const obtenerResumen = async (empleadoId) => {
  const url = empleadoId ? `/resumen/${empleadoId}` : '/resumen';
  const response = await api.get(url);
  return response.data;
};

// Obtener períodos vacacionales del empleado
export const obtenerPeriodos = async (empleadoId) => {
  const url = empleadoId ? `/periodos/${empleadoId}` : '/periodos';
  const response = await api.get(url);
  return response.data;
};

// Obtener solicitudes del empleado
export const obtenerSolicitudes = async (empleadoId, estado) => {
  const url = empleadoId ? `/solicitudes/${empleadoId}` : '/solicitudes';
  const params = estado ? { estado } : {};
  const response = await api.get(url, { params });
  return response.data;
};

// Obtener solicitudes pendientes de aprobación
export const obtenerSolicitudesPendientes = async () => {
  const response = await api.get('/solicitudes-pendientes');
  return response.data;
};

// Aprobar solicitud
export const aprobarSolicitud = async (solicitudId, comentarios) => {
  const response = await api.put(`/solicitudes/${solicitudId}/aprobar`, { comentarios });
  return response.data;
};

// Rechazar solicitud
export const rechazarSolicitud = async (solicitudId, motivo) => {
  const response = await api.put(`/solicitudes/${solicitudId}/rechazar`, { motivo });
  return response.data;
};

// Obtener notificaciones
export const obtenerNotificaciones = async (leida) => {
  const params = leida !== undefined ? { leida } : {};
  const response = await api.get('/notificaciones', { params });
  return response.data;
};

// Marcar notificación como leída
export const marcarNotificacionLeida = async (notificacionId) => {
  const response = await api.put(`/notificaciones/${notificacionId}/leer`);
  return response.data;
};

// Obtener tipos de trabajador
export const obtenerTiposTrabajador = async () => {
  const response = await api.get('/tipos-trabajador');
  return response.data;
};

// Obtener feriados del año
export const obtenerFeriados = async (anio) => {
  const params = anio ? { anio } : {};
  const response = await api.get('/feriados', { params });
  return response.data;
};

const vacacionesService = {
  validarSolicitud,
  crearSolicitud,
  obtenerResumen,
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
