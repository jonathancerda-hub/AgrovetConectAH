import { query as dbQuery } from '../db.js';

/**
 * Verificar si hay conflictos de vacaciones con otros miembros del equipo
 */
const verificarConflictosEquipo = async (solicitudId, empleadoId, fechaInicio, fechaFin) => {
  try {
    // Obtener el supervisor_id y area_id del empleado
    const empleadoResult = await dbQuery(
      `SELECT supervisor_id, area_id FROM empleados WHERE id = $1`,
      [empleadoId]
    );

    if (!empleadoResult.rows || empleadoResult.rows.length === 0) {
      return [];
    }

    const { supervisor_id, area_id } = empleadoResult.rows[0];

    // Buscar otras solicitudes del mismo equipo (mismo supervisor o misma área) 
    // en fechas superpuestas, excluyendo la solicitud actual
    const conflictosQuery = `
      SELECT 
        sv.id,
        sv.fecha_inicio,
        sv.fecha_fin,
        sv.dias_solicitados,
        sv.estado,
        e.nombres || ' ' || e.apellidos as nombre_empleado,
        e.codigo_empleado,
        p.nombre as puesto
      FROM solicitudes_vacaciones sv
      JOIN empleados e ON sv.empleado_id = e.id
      LEFT JOIN puestos p ON e.puesto_id = p.id
      WHERE sv.id != $1
        AND e.id != $2
        AND (e.supervisor_id = $3 OR e.area_id = $4)
        AND sv.estado IN ('pendiente', 'aprobada')
        AND (
          (sv.fecha_inicio BETWEEN $5 AND $6)
          OR (sv.fecha_fin BETWEEN $5 AND $6)
          OR (sv.fecha_inicio <= $5 AND sv.fecha_fin >= $6)
        )
      ORDER BY sv.fecha_inicio
    `;

    const result = await dbQuery(conflictosQuery, [
      solicitudId,
      empleadoId,
      supervisor_id,
      area_id,
      fechaInicio,
      fechaFin
    ]);

    return result.rows;
  } catch (error) {
    console.error('Error al verificar conflictos:', error);
    return [];
  }
};

/**
 * Obtener solicitudes de vacaciones según el rol del usuario
 * - Si es RRHH: ve todas las solicitudes
 * - Si es supervisor: ve solo las de sus subordinados directos
 */
export const getSolicitudesParaAprobacion = async (req, res) => {
  try {
    const { empleado_id, esRRHH } = req.user; // Viene del middleware de autenticación
    
    console.log('👤 Usuario solicitante:', { empleado_id, esRRHH, rol: req.user.rol });
    
    let query;
    let params;

    if (esRRHH) {
      // Usuario de RRHH ve TODAS las solicitudes
      query = `
        SELECT 
          sv.id,
          sv.empleado_id,
          sv.fecha_inicio,
          sv.fecha_fin,
          sv.dias_solicitados,
          sv.comentarios as motivo,
          sv.estado,
          sv.fecha_creacion,
          sv.fecha_aprobacion,
          sv.observaciones_aprobador,
          e.nombres || ' ' || e.apellidos as nombre_empleado,
          e.codigo_empleado,
          p.nombre as puesto,
          a.nombre as area,
          supervisor.nombres || ' ' || supervisor.apellidos as nombre_supervisor,
          aprobador.nombres || ' ' || aprobador.apellidos as nombre_aprobador
        FROM solicitudes_vacaciones sv
        JOIN empleados e ON sv.empleado_id = e.id
        LEFT JOIN puestos p ON e.puesto_id = p.id
        LEFT JOIN areas a ON e.area_id = a.id
        LEFT JOIN empleados supervisor ON e.supervisor_id = supervisor.id
        LEFT JOIN empleados aprobador ON sv.aprobador_id = aprobador.id
        ORDER BY sv.id DESC
      `;
      params = [];
    } else {
      // Supervisor ve solo las solicitudes de sus subordinados directos
      query = `
        SELECT 
          sv.id,
          sv.empleado_id,
          sv.fecha_inicio,
          sv.fecha_fin,
          sv.dias_solicitados,
          sv.comentarios as motivo,
          sv.estado,
          sv.fecha_creacion,
          sv.fecha_aprobacion,
          sv.observaciones_aprobador,
          e.nombres || ' ' || e.apellidos as nombre_empleado,
          e.codigo_empleado,
          e.email,
          p.nombre as puesto,
          a.nombre as area,
          aprobador.nombres || ' ' || aprobador.apellidos as nombre_aprobador
        FROM solicitudes_vacaciones sv
        JOIN empleados e ON sv.empleado_id = e.id
        LEFT JOIN puestos p ON e.puesto_id = p.id
        LEFT JOIN areas a ON e.area_id = a.id
        LEFT JOIN empleados aprobador ON sv.aprobador_id = aprobador.id
        WHERE e.supervisor_id = $1
        ORDER BY sv.id DESC
      `;
      params = [empleado_id];
    }

    console.log('📊 Query params:', params);
    const result = await dbQuery(query, params);
    console.log('📋 Solicitudes encontradas:', result.rows.length);
    
    // Para cada solicitud pendiente, verificar conflictos con el equipo
    const solicitudesConConflictos = await Promise.all(
      result.rows.map(async (solicitud) => {
        // Solo verificar conflictos para solicitudes pendientes
        if (solicitud.estado === 'pendiente') {
          const conflictos = await verificarConflictosEquipo(
            solicitud.id,
            solicitud.empleado_id,
            solicitud.fecha_inicio,
            solicitud.fecha_fin
          );
          return {
            ...solicitud,
            conflictos_equipo: conflictos
          };
        }
        return {
          ...solicitud,
          conflictos_equipo: []
        };
      })
    );
    
    res.json({
      solicitudes: solicitudesConConflictos,
      esRRHH,
      total: solicitudesConConflictos.length
    });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes de vacaciones' });
  }
};

/**
 * Aprobar o rechazar una solicitud de vacaciones
 * Solo puede hacerlo el supervisor directo del empleado
 */
export const aprobarRechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params; // ID de la solicitud
    const { accion, comentarios } = req.body; // 'aprobar' o 'rechazar'
    const { empleado_id, esRRHH } = req.user;

    // Validar acción
    if (!['aprobar', 'rechazar'].includes(accion)) {
      return res.status(400).json({ error: 'Acción inválida. Use "aprobar" o "rechazar"' });
    }

    // Obtener información de la solicitud
    const solicitudResult = await dbQuery(
      `SELECT sv.*, e.supervisor_id, e.nombres || ' ' || e.apellidos as nombre_empleado
       FROM solicitudes_vacaciones sv
       JOIN empleados e ON sv.empleado_id = e.id
       WHERE sv.id = $1`,
      [id]
    );

    if (!solicitudResult.rows || solicitudResult.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    const solicitud = solicitudResult.rows[0];

    // Verificar que la solicitud esté pendiente
    if (solicitud.estado?.toLowerCase() !== 'pendiente') {
      return res.status(400).json({ 
        error: `Esta solicitud ya fue ${solicitud.estado}` 
      });
    }

    // Verificar permisos: solo el supervisor directo puede aprobar/rechazar
    // RRHH solo puede ver, no aprobar
    if (esRRHH) {
      return res.status(403).json({ 
        error: 'Los usuarios de RRHH no pueden aprobar solicitudes. Solo los supervisores directos tienen este permiso.' 
      });
    }

    if (solicitud.supervisor_id !== empleado_id) {
      return res.status(403).json({ 
        error: 'Solo el supervisor directo puede aprobar o rechazar esta solicitud' 
      });
    }

    const nuevoEstado = accion === 'aprobar' ? 'aprobada' : 'rechazada';

    // Actualizar solicitud
    await dbQuery(
      `UPDATE solicitudes_vacaciones 
       SET estado = $1, 
           aprobador_id = $2, 
           fecha_aprobacion = NOW(),
           observaciones_aprobador = $3,
           fecha_actualizacion = NOW()
       WHERE id = $4`,
      [nuevoEstado, empleado_id, comentarios || null, id]
    );

    // Si se aprueba, descontar días del período vacacional
    if (accion === 'aprobar' && solicitud.periodo_id) {
      // Calcular viernes y fines de semana en el rango de fechas
      const fechaInicio = new Date(solicitud.fecha_inicio);
      const fechaFin = new Date(solicitud.fecha_fin);
      let viernesCount = 0;
      let sabadosCount = 0;
      let domingosCount = 0;
      
      for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay();
        if (diaSemana === 5) viernesCount++;
        if (diaSemana === 6) sabadosCount++;
        if (diaSemana === 0) domingosCount++;
      }
      
      const finesSemanaCount = Math.min(sabadosCount, domingosCount);
      
      // Verificar si esta solicitud cumple el bloque de 7 días
      const cumpleBloque7Dias = solicitud.dias_solicitados >= 7;
      let yaTieneBloque = false;
      
      // Obtener el período para saber si ya tiene bloque cumplido
      try {
        const periodoResult = await dbQuery(
          'SELECT tiene_bloque_7dias FROM periodos_vacacionales WHERE id = $1',
          [solicitud.periodo_id]
        );
        
        if (periodoResult.rows.length > 0) {
          yaTieneBloque = periodoResult.rows[0].tiene_bloque_7dias || false;
        }
      } catch (periodoError) {
        console.error('⚠️ Error al consultar período:', periodoError.message);
      }
      
      // Actualizar el período con o sin marcar el bloque
      try {
        if (cumpleBloque7Dias && !yaTieneBloque) {
          // Marcar que ya cumplió el bloque de 7 días
          await dbQuery(
            `UPDATE periodos_vacacionales 
             SET dias_disponibles = dias_disponibles - $1,
                 dias_usados = dias_usados + $1,
                 viernes_usados = viernes_usados + $2,
                 fines_semana_usados = fines_semana_usados + $3,
                 tiene_bloque_7dias = true
             WHERE id = $4`,
            [solicitud.dias_solicitados, viernesCount, finesSemanaCount, solicitud.periodo_id]
          );
          
          console.log(`✅ Bloque de 7 días cumplido para período ${solicitud.periodo_id}`);
        } else {
          // Actualización normal sin marcar bloque
          await dbQuery(
            `UPDATE periodos_vacacionales 
             SET dias_disponibles = dias_disponibles - $1,
                 dias_usados = dias_usados + $1,
                 viernes_usados = viernes_usados + $2,
                 fines_semana_usados = fines_semana_usados + $3
             WHERE id = $4`,
            [solicitud.dias_solicitados, viernesCount, finesSemanaCount, solicitud.periodo_id]
          );
        }
      } catch (updateError) {
        console.error('⚠️ Error al actualizar período:', updateError.message);
      }
      
      console.log(`📊 Descontados: ${solicitud.dias_solicitados} días, ${viernesCount} viernes, ${finesSemanaCount} fines de semana`);
    }

    // Crear notificación para el empleado sobre la decisión
    try {
      const mensaje = accion === 'aprobar' 
        ? `Tu solicitud de vacaciones del ${new Date(solicitud.fecha_inicio).toLocaleDateString()} al ${new Date(solicitud.fecha_fin).toLocaleDateString()} ha sido APROBADA`
        : `Tu solicitud de vacaciones del ${new Date(solicitud.fecha_inicio).toLocaleDateString()} al ${new Date(solicitud.fecha_fin).toLocaleDateString()} ha sido RECHAZADA${comentarios ? '. Motivo: ' + comentarios : ''}`;
      
      await dbQuery(
        `INSERT INTO notificaciones_vacaciones (
          solicitud_id,
          destinatario_id,
          tipo_notificacion,
          titulo,
          mensaje,
          leida
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          id,
          solicitud.empleado_id,
          accion === 'aprobar' ? 'solicitud_aprobada' : 'solicitud_rechazada',
          accion === 'aprobar' ? 'Solicitud Aprobada' : 'Solicitud Rechazada',
          mensaje,
          false
        ]
      );
      console.log(`✅ Notificación enviada al empleado (ID: ${solicitud.empleado_id})`);
    } catch (notifError) {
      console.error('⚠️ Error al crear notificación para empleado:', notifError.message);
    }

    res.json({
      mensaje: `Solicitud ${nuevoEstado.toLowerCase()} exitosamente`,
      solicitud: {
        id,
        estado: nuevoEstado,
        empleado: solicitud.nombre_empleado,
        dias: solicitud.dias_solicitados
      }
    });

  } catch (error) {
    console.error('Error al procesar solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

/**
 * Obtener subordinados de un supervisor (toda la jerarquía)
 * Incluye subordinados directos e indirectos (equipo completo)
 */
export const getSubordinados = async (req, res) => {
  try {
    const { empleado_id } = req.user;
    
    // Usar función RPC de Supabase para obtener subordinados
    const result = await dbQuery(
      `SELECT * FROM get_subordinados($1)`,
      [empleado_id]
    );

    // Enriquecer cada subordinado con información de vacaciones
    const subordinadosConVacaciones = await Promise.all(
      result.rows.map(async (subordinado) => {
        try {
          // Obtener período actual del empleado
          const periodoQuery = await dbQuery(
            `SELECT 
              pv.id,
              pv.dias_totales,
              pv.dias_usados,
              pv.dias_disponibles,
              pv.viernes_usados,
              pv.fines_semana_usados
            FROM periodos_vacacionales pv
            WHERE pv.empleado_id = $1
            AND pv.estado = 'activo'
            ORDER BY pv.anio_generacion DESC
            LIMIT 1`,
            [subordinado.id]
          );

          const periodo = periodoQuery.rows[0];

          // Obtener días efectivos (solicitudes aprobadas cuya fecha ya pasó o está en curso)
          const efectivosQuery = await dbQuery(
            `SELECT COALESCE(SUM(dias_solicitados), 0) as dias_efectivos
            FROM solicitudes_vacaciones
            WHERE empleado_id = $1
            AND estado IN ('aprobada', 'Aprobado')
            AND fecha_inicio <= CURRENT_DATE`,
            [subordinado.id]
          );

          // Obtener días programados (solicitudes aprobadas/pendientes cuya fecha AÚN NO ha llegado)
          const programadosQuery = await dbQuery(
            `SELECT 
              COALESCE(SUM(CASE WHEN estado IN ('aprobada', 'Aprobado') THEN dias_solicitados ELSE 0 END), 0) as dias_aprobados_futuros,
              COALESCE(SUM(CASE WHEN estado IN ('pendiente', 'Pendiente') THEN dias_solicitados ELSE 0 END), 0) as dias_pendientes
            FROM solicitudes_vacaciones
            WHERE empleado_id = $1
            AND fecha_inicio > CURRENT_DATE`,
            [subordinado.id]
          );

          const diasEfectivos = parseInt(efectivosQuery.rows[0]?.dias_efectivos || 0);
          const diasAprobadosFuturos = parseInt(programadosQuery.rows[0]?.dias_aprobados_futuros || 0);
          const diasPendientes = parseInt(programadosQuery.rows[0]?.dias_pendientes || 0);
          const diasProgramados = diasAprobadosFuturos + diasPendientes;

          console.log(`👤 ${subordinado.nombres}: Efectivos=${diasEfectivos}, Programados=${diasProgramados} (Aprobados futuros=${diasAprobadosFuturos}, Pendientes=${diasPendientes})`);

          const diasProgramadosNum = parseInt(diasProgramados || 0);

          return {
            ...subordinado,
            vacaciones: {
              dias_totales: periodo?.dias_totales || 0,
              dias_usados: diasEfectivos,
              dias_disponibles: periodo?.dias_disponibles || 0,
              dias_programados: diasProgramados,
              dias_realmente_disponibles: Math.max(0, periodo?.dias_disponibles || 0)
            }
          };
        } catch (error) {
          console.error(`Error al obtener vacaciones de empleado ${subordinado.id}:`, error);
          return {
            ...subordinado,
            vacaciones: {
              dias_totales: 0,
              dias_usados: 0,
              dias_disponibles: 0,
              dias_programados: 0,
              dias_realmente_disponibles: 0
            }
          };
        }
      })
    );

    // Estadísticas adicionales
    const stats = {
      directos: subordinadosConVacaciones.filter(e => e.nivel_jerarquico === 1).length,
      indirectos: subordinadosConVacaciones.filter(e => e.nivel_jerarquico > 1).length,
      total: subordinadosConVacaciones.length,
      niveles: Math.max(...subordinadosConVacaciones.map(e => e.nivel_jerarquico), 0)
    };

    res.json({
      subordinados: subordinadosConVacaciones,
      total: subordinadosConVacaciones.length,
      estadisticas: stats
    });
  } catch (error) {
    console.error('Error al obtener subordinados:', error);
    res.status(500).json({ error: 'Error al obtener subordinados' });
  }
};
