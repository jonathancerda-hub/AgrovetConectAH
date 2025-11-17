import { query } from '../db.js';

/**
 * Obtener todos los empleados con información completa
 */
export const getEmpleados = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        e.id,
        e.dni,
        e.nombres,
        e.apellidos,
        e.telefono,
        e.fecha_ingreso,
        e.fecha_cese,
        e.dias_vacaciones,
        e.tipo_contrato,
        e.estado,
        e.foto_perfil,
        e.puesto_id,
        e.area_id,
        p.nombre as puesto,
        p.salario_base,
        a.nombre as area,
        a.centro_costos,
        d.nombre as division,
        u.email,
        u.rol,
        supervisor.nombres || ' ' || supervisor.apellidos as supervisor_nombre
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       LEFT JOIN divisiones d ON a.division_id = d.id
       LEFT JOIN usuarios u ON e.usuario_id = u.id
       LEFT JOIN empleados supervisor ON e.supervisor_id = supervisor.id
       ORDER BY e.fecha_ingreso DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Obtener un empleado por ID
 */
export const getEmpleadoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        e.*,
        p.nombre as puesto,
        p.salario_base,
        a.nombre as area,
        a.centro_costos,
        d.nombre as division,
        u.email,
        u.rol,
        u.activo as usuario_activo,
        supervisor.nombres || ' ' || supervisor.apellidos as supervisor_nombre
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       LEFT JOIN divisiones d ON a.division_id = d.id
       LEFT JOIN usuarios u ON e.usuario_id = u.id
       LEFT JOIN empleados supervisor ON e.supervisor_id = supervisor.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Crear nuevo empleado
 */
export const createEmpleado = async (req, res) => {
  try {
    const {
      dni,
      nombres,
      apellidos,
      telefono,
      email,
      password,
      rol,
      puesto_id,
      area_id,
      supervisor_id,
      tipo_contrato,
      fecha_ingreso,
      dias_vacaciones
    } = req.body;

    // Validaciones
    if (!dni || !nombres || !apellidos || !email || !puesto_id || !area_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el DNI ya existe
    const dniCheck = await query('SELECT id FROM empleados WHERE dni = $1', [dni]);
    if (dniCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }

    // Verificar si el email ya existe
    const emailCheck = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario primero
    const bcrypt = await import('bcrypt');
    const password_hash = await bcrypt.hash(password || 'temp123', 10);

    const userResult = await query(
      'INSERT INTO usuarios (email, password_hash, rol) VALUES ($1, $2, $3) RETURNING id',
      [email, password_hash, rol || 'empleado']
    );

    const usuario_id = userResult.rows[0].id;

    // Crear empleado
    const result = await query(
      `INSERT INTO empleados 
       (usuario_id, puesto_id, area_id, supervisor_id, dni, nombres, apellidos, 
        telefono, tipo_contrato, fecha_ingreso, dias_vacaciones, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Activo')
       RETURNING *`,
      [
        usuario_id,
        puesto_id,
        area_id,
        supervisor_id || null,
        dni,
        nombres,
        apellidos,
        telefono || null,
        tipo_contrato || 'Indefinido',
        fecha_ingreso || new Date(),
        dias_vacaciones || 15
      ]
    );

    console.log('✅ Empleado creado:', result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Actualizar empleado
 */
export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dni,
      nombres,
      apellidos,
      telefono,
      puesto_id,
      area_id,
      supervisor_id,
      tipo_contrato,
      dias_vacaciones,
      estado
    } = req.body;

    const result = await query(
      `UPDATE empleados 
       SET dni = COALESCE($1, dni),
           nombres = COALESCE($2, nombres),
           apellidos = COALESCE($3, apellidos),
           telefono = COALESCE($4, telefono),
           puesto_id = COALESCE($5, puesto_id),
           area_id = COALESCE($6, area_id),
           supervisor_id = $7,
           tipo_contrato = COALESCE($8, tipo_contrato),
           dias_vacaciones = COALESCE($9, dias_vacaciones),
           estado = COALESCE($10, estado)
       WHERE id = $11
       RETURNING *`,
      [dni, nombres, apellidos, telefono, puesto_id, area_id, supervisor_id, 
       tipo_contrato, dias_vacaciones, estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    console.log('✅ Empleado actualizado:', id);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Desactivar empleado (baja)
 */
export const desactivarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_cese, motivo } = req.body;

    const result = await query(
      `UPDATE empleados 
       SET estado = 'Cesado',
           fecha_cese = $1
       WHERE id = $2
       RETURNING *`,
      [fecha_cese || new Date(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Desactivar usuario también
    await query(
      'UPDATE usuarios SET activo = false WHERE id = (SELECT usuario_id FROM empleados WHERE id = $1)',
      [id]
    );

    console.log('✅ Empleado desactivado:', id);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al desactivar empleado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Obtener puestos disponibles
 */
export const getPuestos = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, a.nombre as area_nombre
       FROM puestos p
       LEFT JOIN areas a ON p.area_id = a.id
       ORDER BY p.nombre`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Obtener áreas disponibles
 */
export const getAreas = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, d.nombre as division_nombre
       FROM areas a
       LEFT JOIN divisiones d ON a.division_id = d.id
       ORDER BY a.nombre`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * Obtener cumpleañeros del día
 */
export const getCumpleaneros = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        e.id,
        e.nombres,
        e.apellidos,
        e.nombres || ' ' || e.apellidos as nombre_completo,
        e.fecha_nacimiento,
        e.foto_perfil,
        p.nombre as puesto,
        a.nombre as area,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_nacimiento)) as edad
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       WHERE e.estado = 'Activo'
         AND EXTRACT(MONTH FROM e.fecha_nacimiento) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(DAY FROM e.fecha_nacimiento) = EXTRACT(DAY FROM CURRENT_DATE)
       ORDER BY e.nombres, e.apellidos`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener cumpleañeros:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

