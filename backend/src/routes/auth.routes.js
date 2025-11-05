import express from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (requiere autenticación)
router.get('/me', authMiddleware, getMe);

export default router;
