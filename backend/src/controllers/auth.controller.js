import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await query(
      `SELECT u.*, e.id as empleado_id, e.nombres, e.apellidos, e.es_rrhh
       FROM usuarios u
       INNER JOIN empleados e ON u.empleado_id = e.id
       WHERE u.email = $1 AND u.activo = true`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar último acceso
    await query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
      [user.id]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        empleadoId: user.empleado_id,
        email: user.email, 
        rol: user.rol,
        esRrhh: user.es_rrhh || false
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Retornar datos del usuario (sin el hash)
    delete user.password;
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
        empleadoId: user.empleado_id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        esRrhh: user.es_rrhh || false
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.rol, u.ultimo_acceso,
              e.id as empleado_id, e.codigo_empleado, e.nombres, e.apellidos, 
              e.telefono, e.fecha_ingreso, e.es_rrhh,
              p.nombre as puesto, a.nombre as area
       FROM usuarios u
       INNER JOIN empleados e ON u.empleado_id = e.id
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
