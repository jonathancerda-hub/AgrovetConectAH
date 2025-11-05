import express from 'express';
import {
  getPublicaciones,
  createPublicacion,
  addReaction,
  addComment,
  getComments
} from '../controllers/publicaciones.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/publicaciones
router.get('/', getPublicaciones);

// POST /api/publicaciones (solo admin y rrhh)
router.post('/', requireRole('admin', 'rrhh'), createPublicacion);

// POST /api/publicaciones/:id/reaccionar
router.post('/:id/reaccionar', addReaction);

// POST /api/publicaciones/:id/comentar
router.post('/:id/comentar', addComment);

// GET /api/publicaciones/:id/comentarios
router.get('/:id/comentarios', getComments);

export default router;
