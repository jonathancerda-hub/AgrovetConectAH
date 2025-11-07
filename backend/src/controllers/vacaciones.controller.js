import vacacionesService from '../services/vacaciones.service.js';
import pool from '../db.js';

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
    const empleadoId = req.params.empleadoId || req.user?.id;
    if (!empleadoId) {
      return res.status(401).json({ error: 'No autenticado' });
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
    
    query += ` ORDER BY sv.created_at DESC`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
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
    
    const result = await pool.query(query, [aprobadorId, aprobadorId]);
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
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener datos de la solicitud
      const solicitudQuery = await client.query(
        'SELECT * FROM solicitudes_vacaciones WHERE id = $1',
        [id]
      );
      const solicitud = solicitudQuery.rows[0];
      
      if (!solicitud) {
        throw new Error('Solicitud no encontrada');
      }
      
      if (solicitud.estado !== 'pendiente') {
        throw new Error('La solicitud ya fue procesada');
      }
      
      // Actualizar solicitud
      await client.query(`
        UPDATE solicitudes_vacaciones
        SET estado = 'aprobada',
            aprobador_id = $1,
            fecha_aprobacion = CURRENT_TIMESTAMP,
            observaciones_aprobador = $2
        WHERE id = $3
      `, [aprobadorId, comentarios, id]);
      
      // Aplicar descuento al período
      const detallesQuery = await client.query(`
        SELECT dias_solicitados, viernes_incluidos, periodo_id
        FROM solicitudes_vacaciones
        WHERE id = $1
      `, [id]);
      
      const { dias_solicitados, viernes_incluidos, periodo_id } = detallesQuery.rows[0];
      
      await client.query(`
        UPDATE periodos_vacacionales
        SET dias_disponibles = dias_disponibles - $1,
            dias_usados = dias_usados + $1,
            viernes_usados = viernes_usados + $2,
            estado = CASE 
              WHEN dias_disponibles - $1 <= 0 THEN 'consumido'
              ELSE estado
            END
        WHERE id = $3
      `, [dias_solicitados, viernes_incluidos, periodo_id]);
      
      // Registrar en historial
      await client.query(`
        INSERT INTO historial_aprobaciones (
          solicitud_id, aprobador_id, accion, comentarios
        ) VALUES ($1, $2, 'aprobado', $3)
      `, [id, aprobadorId, comentarios]);
      
      // Crear notificación para el solicitante
      await client.query(`
        INSERT INTO notificaciones_vacaciones (
          solicitud_id, destinatario_id, tipo_notificacion, titulo, mensaje
        ) VALUES ($1, $2, 'solicitud_aprobada', $3, $4)
      `, [
        id,
        solicitud.empleado_id,
        'Solicitud de vacaciones aprobada',
        `Su solicitud de vacaciones del ${solicitud.fecha_inicio} al ${solicitud.fecha_fin} ha sido aprobada.`
      ]);
      
      await client.query('COMMIT');
      
      res.json({ 
        success: true, 
        mensaje: 'Solicitud aprobada exitosamente' 
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    res.status(400).json({ 
      error: 'Error al aprobar la solicitud',
      detalles: error.message 
    });
  }
};

// Rechazar solicitud
export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const aprobadorId = req.user?.id;
    if (!aprobadorId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const { motivo } = req.body;
    
    if (!motivo) {
      return res.status(400).json({ 
        error: 'Debe proporcionar un motivo de rechazo' 
      });
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener datos de la solicitud
      const solicitudQuery = await client.query(
        'SELECT * FROM solicitudes_vacaciones WHERE id = $1',
        [id]
      );
      const solicitud = solicitudQuery.rows[0];
      
      if (!solicitud) {
        throw new Error('Solicitud no encontrada');
      }
      
      // Actualizar solicitud
      await client.query(`
        UPDATE solicitudes_vacaciones
        SET estado = 'rechazada',
            aprobador_id = $1,
            fecha_aprobacion = CURRENT_TIMESTAMP,
            observaciones_aprobador = $2
        WHERE id = $3
      `, [aprobadorId, motivo, id]);
      
      // Registrar en historial
      await client.query(`
        INSERT INTO historial_aprobaciones (
          solicitud_id, aprobador_id, accion, comentarios
        ) VALUES ($1, $2, 'rechazado', $3)
      `, [id, aprobadorId, motivo]);
      
      // Crear notificación
      await client.query(`
        INSERT INTO notificaciones_vacaciones (
          solicitud_id, destinatario_id, tipo_notificacion, titulo, mensaje
        ) VALUES ($1, $2, 'solicitud_rechazada', $3, $4)
      `, [
        id,
        solicitud.empleado_id,
        'Solicitud de vacaciones rechazada',
        `Su solicitud de vacaciones ha sido rechazada. Motivo: ${motivo}`
      ]);
      
      await client.query('COMMIT');
      
      res.json({ 
        success: true, 
        mensaje: 'Solicitud rechazada' 
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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
    
    const result = await pool.query(query, params);
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
    
    await pool.query(`
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
    const result = await pool.query(`
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
    
    const result = await pool.query(`
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
