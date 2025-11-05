import express from 'express';
import {
  getNotificaciones,
  getUnread,
  markAsRead,
  markAllAsRead,
  deleteNotificacion
} from '../controllers/notificaciones.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/notificaciones
router.get('/', getNotificaciones);

// GET /api/notificaciones/no-leidas
router.get('/no-leidas', getUnread);

// PUT /api/notificaciones/:id/leer
router.put('/:id/leer', markAsRead);

// PUT /api/notificaciones/leer-todas
router.put('/leer-todas', markAllAsRead);

// DELETE /api/notificaciones/:id
router.delete('/:id', deleteNotificacion);

export default router;
