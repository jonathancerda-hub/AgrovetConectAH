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
      `SELECT u.*, e.id as empleado_id, e.nombres, e.apellidos, e.es_rrhh 
       FROM usuarios u 
       LEFT JOIN empleados e ON u.empleado_id = e.id 
       WHERE u.id = $1 AND u.activo = true`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario inválido' });
    }

    // Agregar usuario al request (incluye es_rrhh)
    req.user = {
      ...result.rows[0],
      esRRHH: result.rows[0].es_rrhh || false
    };
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
    
    // Verificar si el rol está en la lista permitida
    const hasRole = roles.includes(req.user.rol);
    
    // Si el rol 'rrhh' está en la lista, también permitir si el usuario tiene es_rrhh = true
    const hasRRHHFlag = roles.includes('rrhh') && (req.user.esRRHH === true || req.user.es_rrhh === true);
    
    console.log('🔐 Verificación de permisos:', {
      userId: req.user.id,
      rol: req.user.rol,
      esRRHH: req.user.esRRHH,
      es_rrhh: req.user.es_rrhh,
      hasRole,
      hasRRHHFlag,
      rolesPermitidos: roles
    });
    
    if (!hasRole && !hasRRHHFlag) {
      return res.status(403).json({ error: 'No tienes permisos suficientes' });
    }
    
    next();
  };
};
