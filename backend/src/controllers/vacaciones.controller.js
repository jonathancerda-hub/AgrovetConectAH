import vacacionesService from '../services/vacaciones.service.js';
import { query as dbQuery } from '../db.js';

/**
 * Controlador de Vacaciones
 */

// Validar solicitud de vacaciones
export const validarSolicitud = async (req, res) => {
  try {
    const empleadoId = req.user?.id;
    if (!empleadoId) {
      return res.status(401).json({ 
        error: 'No autenticado',
        detalles: 'Debe iniciar sesión para validar solicitudes' 
      });
    }
    
    const solicitudData = {
      ...req.body,
      empleado_id: empleadoId
    };
    
    const validacion = await vacacionesService.validarSolicitud(solicitudData);
    res.json(validacion);
  } catch (error) {
    console.error('Error al validar solicitud:', error);
    res.status(500).json({ 
      error: 'Error al validar la solicitud',
      detalles: error.message 
    });
  }
};

// Crear solicitud de vacaciones
export const crearSolicitud = async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      return res.status(401).json({ 
        error: 'No autenticado',
        detalles: 'Debe iniciar sesión para crear solicitudes' 
      });
    }
    
    const solicitudData = {
      ...req.body,
      empleado_id: usuarioId
    };
    
    const resultado = await vacacionesService.crearSolicitud(solicitudData, usuarioId);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(400).json({ 
      error: 'Error al crear la solicitud',
      detalles: error.message 
    });
  }
};

// Obtener resumen de vacaciones del empleado
export const obtenerResumen = async (req, res) => {
  try {
    const empleadoId = req.params.empleadoId || req.user?.id;
    if (!empleadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const resumen = await vacacionesService.obtenerResumenEmpleado(empleadoId);
    res.json(resumen);
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({ 
      error: 'Error al obtener el resumen de vacaciones',
      detalles: error.message 
    });
  }
};

// Obtener períodos vacacionales del empleado
export const obtenerPeriodos = async (req, res) => {
  try {
    const empleadoId = req.params.empleadoId || req.user?.id;
    if (!empleadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const periodos = await vacacionesService.obtenerPeriodos(empleadoId);
    res.json(periodos);
  } catch (error) {
    console.error('Error al obtener períodos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los períodos vacacionales',
      detalles: error.message 
    });
  }
};

// Obtener solicitudes del empleado
export const obtenerSolicitudes = async (req, res) => {
  try {
    const empleadoId = req.params.empleadoId || req.user?.empleado_id;
    if (!empleadoId) {
      return res.status(401).json({ error: 'No autenticado o empleado no encontrado' });
    }
    const { estado } = req.query;
    
    let query = `
      SELECT 
        sv.*,
        e.nombres || ' ' || e.apellidos as nombre_empleado
      FROM solicitudes_vacaciones sv
      JOIN empleados e ON sv.empleado_id = e.id
      WHERE sv.empleado_id = $1
    `;
    
    const params = [empleadoId];
    
    if (estado) {
      query += ` AND sv.estado = $2`;
      params.push(estado);
    }
    
    query += ` ORDER BY sv.fecha_creacion DESC`;
    
    const result = await dbQuery(query, params);
    
    // Devolver array vacío si no hay resultados (no es error)
    res.json(result.rows || []);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ 
      error: 'Error al obtener las solicitudes',
      detalles: error.message 
    });
  }
};

// Obtener solicitudes pendientes de aprobación (para jefes/RRHH)
export const obtenerSolicitudesPendientes = async (req, res) => {
  try {
    const aprobadorId = req.user?.id;
    if (!aprobadorId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    const query = `
      SELECT 
        sv.*,
        e.nombres || ' ' || e.apellidos as nombre_empleado,
        e.puesto,
        e.email,
        pv.anio_generacion,
        COUNT(DISTINCT av.id) as alertas_count
      FROM solicitudes_vacaciones sv
      JOIN empleados e ON sv.empleado_id = e.id
      LEFT JOIN periodos_vacacionales pv ON sv.periodo_id = pv.id
      LEFT JOIN alertas_validaciones av ON sv.id = av.solicitud_id AND av.resuelta = false
      WHERE sv.estado = 'pendiente'
        AND (e.supervisor_id = $1 OR $2 IN (
          SELECT id FROM empleados WHERE puesto ILIKE '%talento humano%' OR puesto ILIKE '%recursos humanos%'
        ))
      GROUP BY sv.id, e.id, pv.anio_generacion
      ORDER BY sv.fecha_creacion DESC
    `;
    
    const result = await dbQuery(query, [aprobadorId, aprobadorId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
    res.status(500).json({ 
      error: 'Error al obtener las solicitudes pendientes',
      detalles: error.message 
    });
  }
};

// Aprobar solicitud
export const aprobarSolicitud = async (req, res) => {  
  try {
    const { id } = req.params;
    const aprobadorId = req.user?.id;
    if (!aprobadorId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const { comentarios } = req.body;
    
    // Obtener datos de la solicitud
    const solicitudResult = await dbQuery(
      'SELECT * FROM solicitudes_vacaciones WHERE id = $1',
      [id]
    );
    
    if (!solicitudResult.data || solicitudResult.data.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    const solicitud = solicitudResult.data[0];
    
    if (solicitud.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La solicitud ya fue procesada' });
    }
    
    // Actualizar solicitud
    await dbQuery(`
      UPDATE solicitudes_vacaciones
      SET estado = 'aprobada',
          aprobador_id = $1,
          fecha_aprobacion = CURRENT_TIMESTAMP,
          observaciones_aprobador = $2,
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [aprobadorId, comentarios || '', id]);
    
    // Aplicar descuento al período si existe periodo_id
    if (solicitud.periodo_id) {
      await dbQuery(`
        UPDATE periodos_vacacionales
        SET dias_disponibles = dias_disponibles - $1,
            estado = CASE 
              WHEN dias_disponibles - $1 <= 0 THEN 'consumido'
              ELSE estado
            END
        WHERE id = $2
      `, [solicitud.dias_solicitados, solicitud.periodo_id]);
    }
    
    res.json({ 
      success: true, 
      mensaje: 'Solicitud aprobada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    res.status(400).json({ 
      error: 'Error al aprobar la solicitud',
      detalles: error.message 
    });
  }
};// Rechazar solicitud
export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const aprobadorId = req.user?.id;
    if (!aprobadorId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const { motivo } = req.body;
    
    if (!motivo || motivo.trim() === '') {
      return res.status(400).json({ 
        error: 'Debe proporcionar un motivo de rechazo' 
      });
    }
    
    // Obtener datos de la solicitud
    const solicitudResult = await dbQuery(
      'SELECT * FROM solicitudes_vacaciones WHERE id = $1',
      [id]
    );
    
    if (!solicitudResult.data || solicitudResult.data.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    const solicitud = solicitudResult.data[0];
    
    if (solicitud.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La solicitud ya fue procesada' });
    }
    
    // Actualizar solicitud
    await dbQuery(`
      UPDATE solicitudes_vacaciones
      SET estado = 'rechazada',
          aprobador_id = $1,
          fecha_aprobacion = CURRENT_TIMESTAMP,
          observaciones_aprobador = $2,
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [aprobadorId, motivo, id]);
    
    res.json({ 
      success: true, 
      mensaje: 'Solicitud rechazada' 
    });
    
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(400).json({ 
      error: 'Error al rechazar la solicitud',
      detalles: error.message 
    });
  }
};

// Obtener notificaciones del usuario
export const obtenerNotificaciones = async (req, res) => {
  try {
    const empleadoId = req.user?.id;
    if (!empleadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const { leida } = req.query;
    
    let query = `
      SELECT nv.*, sv.fecha_inicio, sv.fecha_fin, sv.estado
      FROM notificaciones_vacaciones nv
      LEFT JOIN solicitudes_vacaciones sv ON nv.solicitud_id = sv.id
      WHERE nv.destinatario_id = $1
    `;
    
    const params = [empleadoId];
    
    if (leida !== undefined) {
      query += ` AND nv.leida = $2`;
      params.push(leida === 'true');
    }
    
    query += ` ORDER BY nv.fecha_creacion DESC LIMIT 50`;
    
    const result = await dbQuery(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener las notificaciones',
      detalles: error.message 
    });
  }
};

// Marcar notificación como leída
export const marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const empleadoId = req.user?.id;
    if (!empleadoId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    await dbQuery(`
      UPDATE notificaciones_vacaciones
      SET leida = true, fecha_lectura = CURRENT_TIMESTAMP
      WHERE id = $1 AND destinatario_id = $2
    `, [id, empleadoId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ 
      error: 'Error al marcar la notificación',
      detalles: error.message 
    });
  }
};

// Obtener tipos de trabajador
export const obtenerTiposTrabajador = async (req, res) => {
  try {
    const result = await dbQuery(`
      SELECT * FROM tipos_trabajador
      WHERE activo = true
      ORDER BY dias_vacaciones_anuales DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tipos de trabajador:', error);
    res.status(500).json({ 
      error: 'Error al obtener los tipos de trabajador',
      detalles: error.message 
    });
  }
};

// Obtener feriados del año
export const obtenerFeriados = async (req, res) => {
  try {
    const { anio } = req.query;
    const anioActual = anio || new Date().getFullYear();
    
    const result = await dbQuery(`
      SELECT * FROM feriados
      WHERE anio = $1
      ORDER BY fecha
    `, [anioActual]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener feriados:', error);
    res.status(500).json({ 
      error: 'Error al obtener los feriados',
      detalles: error.message 
    });
  }
};

// Control de vacaciones RRHH - Vista completa de todos los empleados
export const obtenerControlRRHH = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id as empleado_id,
        e.nombres || ' ' || e.apellidos as nombre_completo,
        a.nombre as area,
        p.nombre as puesto,
        COALESCE(SUM(pv.dias_totales), 0) as dias_totales,
        COALESCE(SUM(pv.dias_disponibles), 0) as dias_disponibles,
        COALESCE(SUM(pv.dias_totales - pv.dias_disponibles), 0) as dias_usados,
        COALESCE(
          (SELECT COUNT(*) 
           FROM solicitudes_vacaciones sv 
           WHERE sv.empleado_id = e.id AND sv.estado = 'pendiente'
          ), 0
        ) as solicitudes_pendientes,
        COALESCE(
          (SELECT SUM(dias_solicitados) 
           FROM solicitudes_vacaciones sv 
           WHERE sv.empleado_id = e.id AND sv.estado = 'pendiente'
          ), 0
        ) as dias_pendientes
      FROM empleados e
      LEFT JOIN areas a ON e.area_id = a.id
      LEFT JOIN puestos p ON e.puesto_id = p.id
      LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id 
        AND pv.estado = 'activo'
        AND pv.anio_generacion = EXTRACT(YEAR FROM CURRENT_DATE)
      WHERE e.activo = true
      GROUP BY e.id, e.nombres, e.apellidos, a.nombre, p.nombre
      ORDER BY e.apellidos, e.nombres
    `;
    
    const result = await dbQuery(query);
    
    // Devolver array vacío si no hay resultados (no es error)
    res.json(result.rows || []);
  } catch (error) {
    console.error('Error al obtener control RRHH:', error);
    res.status(500).json({ 
      error: 'Error al obtener el control de vacaciones',
      detalles: error.message 
    });
  }
};

// Dashboard RRHH - Métricas y estadísticas
export const obtenerDashboardRRHH = async (req, res) => {
  try {
    // Total empleados activos
    const totalEmpleados = await dbQuery(`
      SELECT COUNT(*) as total FROM empleados WHERE activo = true
    `);

    // Empleados que necesitan tomar vacaciones (más del 70% disponible)
    const necesitanVacaciones = await dbQuery(`
      SELECT COUNT(DISTINCT e.id) as total
      FROM empleados e
      JOIN periodos_vacacionales pv ON e.id = pv.empleado_id
      WHERE e.activo = true
        AND pv.estado = 'activo'
        AND pv.anio_generacion = EXTRACT(YEAR FROM CURRENT_DATE)
        AND (pv.dias_disponibles::float / NULLIF(pv.dias_totales, 0)) > 0.7
    `);

    // Solicitudes pendientes de aprobación
    const solicitudesPendientes = await dbQuery(`
      SELECT COUNT(*) as total 
      FROM solicitudes_vacaciones 
      WHERE estado = 'pendiente'
    `);

    // Días totales de vacaciones en el sistema
    const diasTotales = await dbQuery(`
      SELECT 
        COALESCE(SUM(dias_totales), 0) as total,
        COALESCE(SUM(dias_disponibles), 0) as disponibles,
        COALESCE(SUM(dias_totales - dias_disponibles), 0) as usados
      FROM periodos_vacacionales
      WHERE estado = 'activo'
        AND anio_generacion = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    // Empleados en riesgo (más del 90% de días disponibles)
    const enRiesgo = await dbQuery(`
      SELECT COUNT(DISTINCT e.id) as total
      FROM empleados e
      JOIN periodos_vacacionales pv ON e.id = pv.empleado_id
      WHERE e.activo = true
        AND pv.estado = 'activo'
        AND pv.anio_generacion = EXTRACT(YEAR FROM CURRENT_DATE)
        AND (pv.dias_disponibles::float / NULLIF(pv.dias_totales, 0)) > 0.9
    `);

    // Solicitudes por mes (últimos 6 meses)
    const solicitudesPorMes = await dbQuery(`
      SELECT 
        TO_CHAR(fecha_creacion, 'YYYY-MM') as mes,
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) as aprobadas,
        SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) as rechazadas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes
      FROM solicitudes_vacaciones
      WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(fecha_creacion, 'YYYY-MM')
      ORDER BY mes DESC
    `);

    res.json({
      totalEmpleados: parseInt(totalEmpleados.rows[0].total),
      necesitanVacaciones: parseInt(necesitanVacaciones.rows[0].total),
      solicitudesPendientes: parseInt(solicitudesPendientes.rows[0].total),
      enRiesgo: parseInt(enRiesgo.rows[0].total),
      diasTotales: parseInt(diasTotales.rows[0].total),
      diasDisponibles: parseInt(diasTotales.rows[0].disponibles),
      diasUsados: parseInt(diasTotales.rows[0].usados),
      solicitudesPorMes: solicitudesPorMes.rows
    });
  } catch (error) {
    console.error('Error al obtener dashboard RRHH:', error);
    res.status(500).json({ 
      error: 'Error al obtener el dashboard',
      detalles: error.message 
    });
  }
};

// Historial completo de vacaciones
export const obtenerHistorialVacaciones = async (req, res) => {
  try {
    const { empleadoId, estado, fechaInicio, fechaFin, page = 1, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        sv.id as solicitud_id,
        sv.empleado_id,
        sv.fecha_inicio,
        sv.fecha_fin,
        sv.dias_solicitados,
        sv.estado,
        sv.motivo,
        sv.fecha_creacion,
        sv.aprobador_id,
        sv.fecha_aprobacion,
        sv.observaciones_aprobador,
        e.nombres || ' ' || e.apellidos as nombre_completo,
        a.nombre as area,
        p.nombre as puesto,
        aprobador.nombres || ' ' || aprobador.apellidos as nombre_aprobador
      FROM solicitudes_vacaciones sv
      JOIN empleados e ON sv.empleado_id = e.id
      LEFT JOIN areas a ON e.area_id = a.id
      LEFT JOIN puestos p ON e.puesto_id = p.id
      LEFT JOIN empleados aprobador ON sv.aprobador_id = aprobador.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCounter = 1;
    
    if (empleadoId) {
      query += ` AND sv.empleado_id = $${paramCounter}`;
      params.push(empleadoId);
      paramCounter++;
    }
    
    if (estado) {
      query += ` AND sv.estado = $${paramCounter}`;
      params.push(estado);
      paramCounter++;
    }
    
    if (fechaInicio) {
      query += ` AND sv.fecha_inicio >= $${paramCounter}`;
      params.push(fechaInicio);
      paramCounter++;
    }
    
    if (fechaFin) {
      query += ` AND sv.fecha_fin <= $${paramCounter}`;
      params.push(fechaFin);
      paramCounter++;
    }
    
    query += ` ORDER BY sv.fecha_creacion DESC`;
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    params.push(parseInt(limit));
    params.push((parseInt(page) - 1) * parseInt(limit));
    
    const result = await dbQuery(query, params);
    
    // Contar total de registros
    let countQuery = `
      SELECT COUNT(*) as total
      FROM solicitudes_vacaciones sv
      WHERE 1=1
    `;
    const countParams = params.slice(0, -2); // Remover limit y offset
    
    const countResult = await dbQuery(countQuery, countParams);
    
    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      error: 'Error al obtener el historial de vacaciones',
      detalles: error.message 
    });
  }
};
