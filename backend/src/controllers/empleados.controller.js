import { query } from '../db.js';

/**
 * Obtener todos los empleados con información completa
 */
export const getEmpleados = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        e.id,
        e.codigo_empleado,
        e.dni,
        e.nombres,
        e.apellidos,
        e.email,
        e.telefono,
        e.fecha_nacimiento,
        e.direccion,
        e.fecha_ingreso,
        e.puesto_id,
        e.area_id,
        e.es_rrhh,
        e.supervisor_id,
        e.tipo_trabajador_id,
        e.activo,
        p.nombre as puesto,
        a.nombre as area,
        tt.nombre as tipo_contrato,
        u.id as usuario_id,
        u.email as email_usuario,
        u.rol,
        supervisor.nombres || ' ' || supervisor.apellidos as supervisor_nombre,
        COALESCE(pv.dias_disponibles, 0) as dias_vacaciones,
        COALESCE(pv.dias_totales, 30) as dias_por_ano,
        COALESCE(pv.dias_usados, 0) as dias_tomados
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       LEFT JOIN tipos_trabajador tt ON e.tipo_trabajador_id = tt.id
       LEFT JOIN usuarios u ON u.empleado_id = e.id
       LEFT JOIN empleados supervisor ON e.supervisor_id = supervisor.id
       LEFT JOIN periodos_vacacionales pv ON pv.empleado_id = e.id AND pv.estado = 'activo' AND pv.anio_generacion = EXTRACT(YEAR FROM CURRENT_DATE)
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
        a.nombre as area,
        tt.nombre as tipo_contrato,
        u.email,
        u.rol,
        u.activo as usuario_activo,
        supervisor.nombres || ' ' || supervisor.apellidos as supervisor_nombre,
        COALESCE(pv.dias_disponibles, 0) as dias_vacaciones
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       LEFT JOIN tipos_trabajador tt ON e.tipo_trabajador_id = tt.id
       LEFT JOIN usuarios u ON u.empleado_id = e.id
       LEFT JOIN empleados supervisor ON e.supervisor_id = supervisor.id
       LEFT JOIN periodos_vacacionales pv ON pv.empleado_id = e.id AND pv.estado = 'activo' AND pv.anio_generacion = EXTRACT(YEAR FROM CURRENT_DATE)
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
      tipo_trabajador_id,
      fecha_ingreso,
      fecha_nacimiento,
      direccion,
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

    // Crear empleado primero
    const empleadoResult = await query(
      `INSERT INTO empleados 
       (puesto_id, area_id, supervisor_id, tipo_trabajador_id, dni, nombres, apellidos, 
        telefono, fecha_ingreso, fecha_nacimiento, direccion, dias_vacaciones, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
       RETURNING *`,
      [
        puesto_id,
        area_id,
        supervisor_id || null,
        tipo_trabajador_id || 1,
        dni,
        nombres,
        apellidos,
        telefono || null,
        fecha_ingreso || new Date(),
        fecha_nacimiento || null,
        direccion || null,
        dias_vacaciones || 30
      ]
    );

    const empleado_id = empleadoResult.rows[0].id;

    // Crear usuario vinculado al empleado
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password || 'temp123', 10);

    await query(
      'INSERT INTO usuarios (empleado_id, email, password, rol) VALUES ($1, $2, $3, $4)',
      [empleado_id, email, hashedPassword, rol || 'empleado']
    );

    console.log('✅ Empleado creado:', empleadoResult.rows[0].id);
    res.status(201).json(empleadoResult.rows[0]);
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
      tipo_trabajador_id,
      fecha_ingreso,
      fecha_nacimiento,
      direccion,
      dias_vacaciones,
      activo
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
           tipo_trabajador_id = COALESCE($8, tipo_trabajador_id),
           fecha_ingreso = COALESCE($9, fecha_ingreso),
           fecha_nacimiento = $10,
           direccion = $11,
           dias_vacaciones = COALESCE($12, dias_vacaciones),
           activo = COALESCE($13, activo)
       WHERE id = $14
       RETURNING *`,
      [
        dni, 
        nombres, 
        apellidos, 
        telefono, 
        puesto_id, 
        area_id, 
        supervisor_id,
        tipo_trabajador_id,
        fecha_ingreso,
        fecha_nacimiento,
        direccion,
        dias_vacaciones,
        activo,
        id
      ]
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
      'UPDATE usuarios SET activo = false WHERE empleado_id = $1',
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
      `SELECT p.*
       FROM puestos p
       WHERE p.activo = true
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
      `SELECT a.*
       FROM areas a
       WHERE a.activo = true
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
        p.nombre as puesto,
        a.nombre as area,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_nacimiento)) as edad
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto_id = p.id
       LEFT JOIN areas a ON e.area_id = a.id
       WHERE e.activo = true
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

/**
 * Asignar o remover rol de RRHH a un empleado
 */
export const setRolRRHH = async (req, res) => {
  try {
    const { id } = req.params;
    const { es_rrhh } = req.body;

    // Validar que es_rrhh sea booleano
    if (typeof es_rrhh !== 'boolean') {
      return res.status(400).json({ error: 'El campo es_rrhh debe ser booleano' });
    }

    // Verificar que el empleado existe
    const empleadoCheck = await query('SELECT id FROM empleados WHERE id = $1', [id]);
    if (empleadoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Actualizar el rol RRHH
    const result = await query(
      'UPDATE empleados SET es_rrhh = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [es_rrhh, id]
    );

    res.json({
      mensaje: `Rol RRHH ${es_rrhh ? 'asignado' : 'removido'} exitosamente`,
      empleado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al asignar rol RRHH:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

