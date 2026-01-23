import express from 'express';
import { 
  obtenerFeriados,
  obtenerFeriadoPorId,
  crearFeriado,
  actualizarFeriado,
  eliminarFeriado,
  obtenerAniosDisponibles
} from '../controllers/feriados.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de feriados
router.get('/', obtenerFeriados);
router.get('/anios', obtenerAniosDisponibles);
router.get('/:id', obtenerFeriadoPorId);
router.post('/', crearFeriado);
router.put('/:id', actualizarFeriado);
router.delete('/:id', eliminarFeriado);

export default router;
