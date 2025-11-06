import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);

    // Buscar usuario
    const result = await query(
      `SELECT u.*, e.id as empleado_id, e.nombres, e.apellidos, e.foto_perfil
       FROM usuarios u
       LEFT JOIN empleados e ON u.id = e.usuario_id
       WHERE u.email = $1 AND u.activo = true`,
      [email]
    );
    
    console.log('📊 User query result:', result.rows.length > 0 ? 'User found' : 'User not found');

    if (result.rows.length === 0) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔑 Password validation:', validPassword ? 'Valid' : 'Invalid');
    
    if (!validPassword) {
      console.log('❌ Login failed: Invalid password');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    console.log('✅ Login successful for:', email);

    // Actualizar último login
    await query(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Retornar datos del usuario (sin el hash)
    delete user.password_hash;
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
        empleadoId: user.empleado_id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        fotoPerfil: user.foto_perfil
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
      `SELECT u.id, u.email, u.rol, u.ultimo_login,
              e.id as empleado_id, e.dni, e.nombres, e.apellidos, 
              e.telefono, e.fecha_ingreso, e.dias_vacaciones, e.estado,
              e.foto_perfil, p.nombre as puesto, a.nombre as area
       FROM usuarios u
       LEFT JOIN empleados e ON u.id = e.usuario_id
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
