import express from 'express';
import * as vacacionesController from '../controllers/vacaciones.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Validación y creación de solicitudes
router.post('/validar', vacacionesController.validarSolicitud);
router.post('/solicitudes', vacacionesController.crearSolicitud);

// Consulta de información del empleado
router.get('/resumen/:empleadoId?', vacacionesController.obtenerResumen);
router.get('/periodos/:empleadoId?', vacacionesController.obtenerPeriodos);
router.get('/solicitudes/:empleadoId?', vacacionesController.obtenerSolicitudes);

// Gestión de solicitudes (para jefes y RRHH)
router.get('/solicitudes-pendientes', vacacionesController.obtenerSolicitudesPendientes);
router.put('/solicitudes/:id/aprobar', vacacionesController.aprobarSolicitud);
router.put('/solicitudes/:id/rechazar', vacacionesController.rechazarSolicitud);

// Notificaciones
router.get('/notificaciones', vacacionesController.obtenerNotificaciones);
router.put('/notificaciones/:id/leer', vacacionesController.marcarNotificacionLeida);

// Catálogos
router.get('/tipos-trabajador', vacacionesController.obtenerTiposTrabajador);
router.get('/feriados', vacacionesController.obtenerFeriados);

// Rutas para RRHH
router.get('/control-rrhh', vacacionesController.obtenerControlRRHH);
router.get('/dashboard-rrhh', vacacionesController.obtenerDashboardRRHH);
router.get('/historial', vacacionesController.obtenerHistorialVacaciones);

export default router;
