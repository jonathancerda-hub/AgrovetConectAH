import express from 'express';
import {
  getSolicitudesParaAprobacion,
  aprobarRechazarSolicitud,
  getSubordinados
} from '../controllers/aprobacion.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/aprobacion/solicitudes
 * Obtener solicitudes según el rol:
 * - RRHH: ve todas
 * - Supervisor: solo de sus subordinados
 */
router.get('/solicitudes', getSolicitudesParaAprobacion);

/**
 * PUT /api/aprobacion/solicitudes/:id
 * Aprobar o rechazar una solicitud
 * Solo supervisores directos pueden aprobar/rechazar
 */
router.put('/solicitudes/:id', aprobarRechazarSolicitud);

/**
 * GET /api/aprobacion/subordinados
 * Obtener lista de subordinados directos
 */
router.get('/subordinados', getSubordinados);

export default router;
