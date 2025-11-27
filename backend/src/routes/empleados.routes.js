import express from 'express';
import {
  getEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  desactivarEmpleado,
  getPuestos,
  getAreas,
  getCumpleaneros,
  setRolRRHH
} from '../controllers/empleados.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de empleados
router.get('/', getEmpleados);
router.get('/puestos', getPuestos);
router.get('/areas', getAreas);
router.get('/cumpleaneros', getCumpleaneros);
router.get('/:id', getEmpleadoById);

// Rutas que requieren rol de RRHH o admin
router.post('/', requireRole(['admin', 'rrhh']), createEmpleado);
router.put('/:id', requireRole(['admin', 'rrhh']), updateEmpleado);
router.patch('/:id/desactivar', requireRole(['admin', 'rrhh']), desactivarEmpleado);
router.put('/:id/rrhh', requireRole(['admin', 'rrhh']), setRolRRHH);

export default router;
