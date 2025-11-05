import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener usuario de la base de datos
    const result = await query(
      `SELECT u.*, e.id as empleado_id, e.nombres, e.apellidos 
       FROM usuarios u 
       LEFT JOIN empleados e ON u.id = e.usuario_id 
       WHERE u.id = $1 AND u.activo = true`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario inválido' });
    }

    // Agregar usuario al request
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos suficientes' });
    }
    
    next();
  };
};
