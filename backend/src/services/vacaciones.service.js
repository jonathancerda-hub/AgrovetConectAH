import { query as dbQuery } from '../db.js';

/**
 * Servicio de Gestión de Vacaciones
 * Implementa todas las reglas de negocio del sistema de vacaciones
 */

class VacacionesService {
  /**
   * Validar solicitud de vacaciones con todas las reglas
   */
  async validarSolicitud(solicitudData) {
    const validaciones = {
      valida: true,
      errores: [],
      advertencias: [],
      alertas: []
    };

    try {
      // Verificar que existan las tablas necesarias
      // DESACTIVADO: Supabase usa información_schema diferente
      // const tablasExisten = await this.verificarTablasExisten();
      const tablasExisten = true; // Asumimos que las tablas existen
      
      if (!tablasExisten) {
        // No mostrar advertencia, solo usar validaciones básicas
        // validaciones.alertas.push('Modo de configuración: validaciones básicas activas');
        return this.validacionesBasicasSinBD(solicitudData, validaciones);
      }

      // 1. Validar corte de planilla (hasta el 20 del mes)
      const cortePlanilla = await this.validarCortePlanilla(solicitudData);
      if (!cortePlanilla.valida) {
        validaciones.errores.push(cortePlanilla.mensaje);
        validaciones.valida = false;
      }

      // 2. Validar días disponibles
      const diasDisponibles = await this.validarDiasDisponibles(solicitudData);
      if (!diasDisponibles.valida) {
        validaciones.errores.push(diasDisponibles.mensaje);
        validaciones.valida = false;
      }

      // 3. Validar límite de viernes
      const limiteViernes = await this.validarLimiteViernes(solicitudData);
      if (!limiteViernes.valida) {
        validaciones.errores.push(limiteViernes.mensaje);
        validaciones.valida = false;
      } else if (limiteViernes.advertencia) {
        validaciones.advertencias.push(limiteViernes.mensaje);
      }

      // 4. Validar fines de semana atados
      const finesSemana = await this.validarFinesSemanaAtados(solicitudData);
      if (!finesSemana.valida) {
        validaciones.advertencias.push(finesSemana.mensaje);
      }

      // 5. Validar bloque continuo de 7 días
      const bloqueContinuo = await this.validarBloqueContinuo(solicitudData.empleado_id);
      if (!bloqueContinuo.valida) {
        validaciones.advertencias.push(bloqueContinuo.mensaje);
      }

      // 6. Validar prohibición de puenteo de feriados
      const puenteoFeriados = await this.validarPuenteoFeriados(solicitudData);
      if (!puenteoFeriados.valida) {
        validaciones.errores.push(puenteoFeriados.mensaje);
        validaciones.valida = false;
      }

      // 7. Validar fraccionamiento
      const fraccionamiento = await this.validarFraccionamiento(solicitudData);
      if (!fraccionamiento.valida) {
        validaciones.advertencias.push(fraccionamiento.mensaje);
      }

      // 8. Alertas especiales
      if (diasDisponibles.esVacacionesAdelantadas) {
        validaciones.alertas.push({
          tipo: 'vacaciones_adelantadas',
          mensaje: 'Solicitud de vacaciones adelantadas. Requiere aprobación especial de Talento Humano.'
        });
      }

    } catch (error) {
      console.error('Error en validación:', error);
      validaciones.errores.push('Error al validar la solicitud');
      validaciones.valida = false;
    }

    return validaciones;
  }

  /**
   * Regla: Corte de Planilla
   * Las solicitudes para el mismo mes deben registrarse hasta el día 20
   */
  async validarCortePlanilla(solicitudData) {
    const { fecha_inicio } = solicitudData;
    const fechaActual = new Date();
    const fechaInicio = new Date(fecha_inicio);
    
    const mesInicio = fechaInicio.getMonth();
    const anioInicio = fechaInicio.getFullYear();
    const mesActual = fechaActual.getMonth();
    const anioActual = fechaActual.getFullYear();
    const diaActual = fechaActual.getDate();

    // Si la solicitud es para el mismo mes y ya pasó el día 20
    if (mesInicio === mesActual && anioInicio === anioActual && diaActual > 20) {
      return {
        valida: false,
        mensaje: 'Las solicitudes para el mes actual deben registrarse hasta el día 20. Puede solicitar vacaciones para meses siguientes.'
      };
    }

    return { valida: true };
  }

  /**
   * Regla: Validar días disponibles y prioridad de consumo
   */
  async validarDiasDisponibles(solicitudData) {
    const { empleado_id, dias_solicitados } = solicitudData;

    // Obtener períodos disponibles ordenados por antigüedad
    const query = `
      SELECT id, anio_generacion, dias_disponibles, viernes_usados
      FROM periodos_vacacionales
      WHERE empleado_id = $1 AND estado = 'activo' AND dias_disponibles > 0
      ORDER BY anio_generacion ASC
    `;
    
    const result = await dbQuery(query, [empleado_id]);
    const periodos = result.rows;

    const totalDisponible = periodos.reduce((sum, p) => sum + p.dias_disponibles, 0);

    if (totalDisponible < dias_solicitados) {
      // Verificar si es nuevo empleado (menos de 1 año)
      const empleadoQuery = `
        SELECT fecha_ingreso FROM empleados WHERE id = $1
      `;
      const empResult = await dbQuery(empleadoQuery, [empleado_id]);
      const fechaIngreso = new Date(empResult.rows[0].fecha_ingreso);
      const hoy = new Date();
      const antiguedadMeses = (hoy - fechaIngreso) / (1000 * 60 * 60 * 24 * 30);

      if (antiguedadMeses < 12) {
        return {
          valida: false,
          esVacacionesAdelantadas: true,
          mensaje: `Saldo insuficiente. Disponible: ${totalDisponible} días. Se sugiere licencia sin goce salvo emergencia.`
        };
      }

      return {
        valida: false,
        mensaje: `Saldo insuficiente. Disponible: ${totalDisponible} días, solicitados: ${dias_solicitados} días.`
      };
    }

    return {
      valida: true,
      periodosAfectados: periodos,
      totalDisponible
    };
  }

  /**
   * Regla: Límite de Viernes
   * Máximo 5 viernes por período de 30 días
   */
  async validarLimiteViernes(solicitudData) {
    const { empleado_id, fecha_inicio, fecha_fin } = solicitudData;

    // Contar viernes en el rango solicitado
    const viernesEnRango = this.contarViernes(new Date(fecha_inicio), new Date(fecha_fin));

    // Obtener período más antiguo con días disponibles
    const periodoQuery = `
      SELECT id, viernes_usados, dias_totales, dias_usados
      FROM periodos_vacacionales
      WHERE empleado_id = $1 AND estado = 'activo' AND dias_disponibles > 0
      ORDER BY anio_generacion ASC
      LIMIT 1
    `;
    
    const result = await dbQuery(periodoQuery, [empleado_id]);
    
    if (result.rows.length === 0) {
      return { valida: true };
    }

    const periodo = result.rows[0];
    const viernesUsados = periodo.viernes_usados || 0;
    const totalViernes = viernesUsados + viernesEnRango;

    // Si ya usó los 30 días del período, se reinicia el contador
    if (periodo.dias_usados >= periodo.dias_totales) {
      return { valida: true };
    }

    if (totalViernes > 5) {
      return {
        valida: false,
        mensaje: `Límite de viernes excedido. Ya tiene ${viernesUsados} viernes usados en este período. Esta solicitud incluye ${viernesEnRango} viernes más. Máximo permitido: 5 viernes por período de 30 días.`
      };
    }

    if (totalViernes === 5) {
      return {
        valida: true,
        advertencia: true,
        mensaje: `Con esta solicitud alcanzará el límite de 5 viernes para este período. Futuras solicitudes solo podrán ser de lunes a jueves hasta completar los 30 días.`
      };
    }

    return { valida: true, viernesUsados: totalViernes };
  }

  /**
   * Regla: Fines de semana atados al viernes
   */
  async validarFinesSemanaAtados(solicitudData) {
    const { fecha_inicio, fecha_fin } = solicitudData;
    
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);
    
    // Verificar si incluye viernes
    let tieneViernes = false;
    let tieneSabado = false;
    let tieneDomingo = false;
    
    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      const diaSemana = d.getDay();
      if (diaSemana === 5) tieneViernes = true;
      if (diaSemana === 6) tieneSabado = true;
      if (diaSemana === 0) tieneDomingo = true;
    }

    if (tieneViernes && (!tieneSabado || !tieneDomingo)) {
      return {
        valida: false,
        mensaje: 'Al solicitar vacaciones que incluyen viernes, debe incluir también sábado y domingo. Esta solicitud requiere justificación y aprobación de Talento Humano si tiene compromiso laboral el fin de semana.'
      };
    }

    return { valida: true };
  }

  /**
   * Regla: Bloque continuo de 7 días
   */
  async validarBloqueContinuo(empleadoId) {
    const query = `
      SELECT 
        fecha_inicio,
        fecha_fin,
        dias_solicitados
      FROM solicitudes_vacaciones
      WHERE empleado_id = $1 
        AND estado = 'Aprobado'
        AND EXTRACT(YEAR FROM fecha_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    
    const result = await dbQuery(query, [empleadoId]);
    
    // Calcular cuántos bloques continuos de 7 días tiene el empleado
    const bloquesCumplidos = result.rows.filter(row => row.dias_solicitados >= 7).length;

    if (bloquesCumplidos < 2) {
      return {
        valida: true,
        advertencia: true,
        mensaje: `Recuerde que debe tomar al menos 2 bloques continuos de 7 días calendario durante el año. Actualmente tiene ${bloquesCumplidos} bloque(s) de 7 días.`
      };
    }

    return { valida: true };
  }

  /**
   * Regla: Prohibición de puenteo de feriados
   */
  async validarPuenteoFeriados(solicitudData) {
    const { empleado_id, fecha_inicio, fecha_fin } = solicitudData;

    // Buscar solicitudes existentes del empleado
    const solicitudesQuery = `
      SELECT fecha_inicio, fecha_fin
      FROM solicitudes_vacaciones
      WHERE empleado_id = $1 
        AND estado IN ('pendiente', 'aprobada')
        AND id != COALESCE($2, 0)
    `;
    
    const result = await dbQuery(solicitudesQuery, [empleado_id, solicitudData.id || 0]);
    const solicitudesExistentes = result.rows;

    // Obtener feriados entre las fechas relevantes
    const feriadosQuery = `
      SELECT fecha
      FROM feriados
      WHERE fecha BETWEEN $1 AND $2
      ORDER BY fecha
    `;
    
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);
    
    // Buscar en un rango amplio para detectar puenteos
    const rangoInicio = new Date(fechaInicio);
    rangoInicio.setDate(rangoInicio.getDate() - 30);
    const rangoFin = new Date(fechaFin);
    rangoFin.setDate(rangoFin.getDate() + 30);
    
    const feriadosResult = await dbQuery(feriadosQuery, [rangoInicio, rangoFin]);
    const feriados = feriadosResult.rows.map(f => new Date(f.fecha).getTime());

    // Verificar si hay puenteo con solicitudes existentes
    for (const solicitud of solicitudesExistentes) {
      const existenteInicio = new Date(solicitud.fecha_inicio).getTime();
      const existenteFin = new Date(solicitud.fecha_fin).getTime();
      const nuevaInicio = fechaInicio.getTime();
      const nuevaFin = fechaFin.getTime();

      // Buscar feriados entre las dos solicitudes
      for (const feriado of feriados) {
        // Si hay un feriado entre el fin de una solicitud y el inicio de otra
        if ((feriado > existenteFin && feriado < nuevaInicio) ||
            (feriado > nuevaFin && feriado < existenteInicio)) {
          return {
            valida: false,
            mensaje: 'No se permite "puentear" feriados. Existe un feriado entre esta solicitud y otra solicitud de vacaciones ya registrada. Debe incluir el feriado en una sola solicitud continua.'
          };
        }
      }
    }

    return { valida: true };
  }

  /**
   * Regla: Validar fraccionamiento
   */
  async validarFraccionamiento(solicitudData) {
    const { empleado_id, dias_solicitados } = solicitudData;

    // Si solicita más de 15 días, debe revisar el fraccionamiento
    if (dias_solicitados > 15) {
      return {
        valida: true,
        advertencia: true,
        mensaje: 'Recuerde que puede tomar días fraccionados con un mínimo de 1 día y máximo acumulado de 15 días incluyendo 2 fines de semana.'
      };
    }

    return { valida: true };
  }

  /**
   * Crear solicitud de vacaciones
   */
  async crearSolicitud(solicitudData, usuarioId) {
    try {
      // 1. Validar solicitud
      const validacion = await this.validarSolicitud(solicitudData);
      
      if (!validacion.valida) {
        throw new Error(validacion.errores.join('. '));
      }

      // 2. Calcular días y detalles
      const detalles = await this.calcularDetallesDias(solicitudData);
      
      // 3. Obtener período más antiguo
      console.log('🔍 Buscando período para empleado:', solicitudData.empleado_id);
      
      const periodoQuery = `
        SELECT id, dias_disponibles, dias_totales, anio_generacion FROM periodos_vacacionales
        WHERE empleado_id = $1 AND estado = 'activo'
        ORDER BY anio_generacion ASC
        LIMIT 1
      `;
      const periodoResult = await dbQuery(periodoQuery, [solicitudData.empleado_id]);
      
      console.log('📊 Períodos encontrados:', periodoResult.rows);
      
      if (!periodoResult.rows || periodoResult.rows.length === 0) {
        throw new Error(`No hay períodos vacacionales configurados para el empleado ${solicitudData.empleado_id}. Por favor contacte a RRHH.`);
      }
      
      const periodo = periodoResult.rows[0];
      const periodoId = periodo.id;
      
      if (periodo.dias_disponibles < detalles.diasCalendario) {
        throw new Error(`No tiene suficientes días disponibles. Disponibles: ${periodo.dias_disponibles}, Solicitados: ${detalles.diasCalendario}`);
      }

      // 4. Insertar solicitud (simplificado - sin transacciones)
      const insertQuery = `
        INSERT INTO solicitudes_vacaciones (
          empleado_id, periodo_id, fecha_inicio, fecha_fin,
          dias_solicitados, dias_calendario, mes_solicitud, anio_solicitud,
          estado, comentarios, motivo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;
      
      const fechaInicio = new Date(solicitudData.fecha_inicio);
      const mes = fechaInicio.getMonth() + 1;
      const anio = fechaInicio.getFullYear();
      
      const values = [
        solicitudData.empleado_id,
        periodoId,
        solicitudData.fecha_inicio,
        solicitudData.fecha_fin,
        detalles.diasCalendario,
        detalles.diasCalendario,
        mes,
        anio,
        'pendiente',
        solicitudData.comentarios || '',
        solicitudData.motivo || 'Vacaciones'
      ];

      const result = await dbQuery(insertQuery, values);
      
      console.log('📝 Resultado del INSERT:', result);
      console.log('📝 result.rows:', result.rows);
      
      if (!result.rows || result.rows.length === 0) {
        throw new Error('Error al crear la solicitud - no se devolvió el ID');
      }
      
      const solicitudId = result.rows[0].id;

      // 5. Actualizar saldo del período
      await dbQuery(`
        UPDATE periodos_vacacionales 
        SET dias_disponibles = dias_disponibles - $1
        WHERE id = $2
      `, [detalles.diasCalendario, periodoId]);

      return {
        success: true,
        solicitudId,
        validaciones: validacion,
        aprobacionAutomatica: false
      };

    } catch (error) {
      console.error('Error al crear solicitud:', error);
      throw error;
    }
  }

  /**
   * Calcular detalles de días de la solicitud
   * Regla: TODOS los días (laborables, feriados y fines de semana) se descuentan del saldo
   */
  async calcularDetallesDias(solicitudData) {
    const { fecha_inicio, fecha_fin, empleado_id } = solicitudData;
    
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);
    
    // Por defecto, los días de descanso son Sábado y Domingo (sin consultar BD)
    const diasDescanso = 'Sabado,Domingo';
    
    // Obtener feriados en el rango (con manejo de error)
    let feriadosFechas = new Set();
    try {
      const feriadosQuery = await dbQuery(
        'SELECT fecha FROM feriados WHERE fecha BETWEEN $1 AND $2',
        [fecha_inicio, fecha_fin]
      );
      feriadosFechas = new Set(feriadosQuery.rows.map(f => f.fecha.toISOString().split('T')[0]));
    } catch (error) {
      console.warn('No se pudieron cargar feriados, continuando sin ellos');
    }

    const detallesDias = [];
    let diasCalendario = 0;
    let viernesIncluidos = 0;
    let incluyeFinesSemana = false;

    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      const fechaStr = d.toISOString().split('T')[0];
      const diaSemana = d.getDay();
      const esViernes = diaSemana === 5;
      const esSabado = diaSemana === 6;
      const esDomingo = diaSemana === 0;
      const esFeriado = feriadosFechas.has(fechaStr);
      const esFinSemana = (esSabado && diasDescanso.includes('Sabado')) || 
                          (esDomingo && diasDescanso.includes('Domingo'));
      const esLaboral = !esFeriado && !esFinSemana;

      detallesDias.push({
        fecha: fechaStr,
        esLaboral,
        esFeriado,
        esFinSemana,
        esViernes
      });

      // TODOS los días cuentan como días de vacaciones
      diasCalendario++;
      
      if (esViernes) {
        viernesIncluidos++;
      }
      if (esFinSemana) {
        incluyeFinesSemana = true;
      }
    }

    return {
      diasCalendario, // Todos los días se descuentan del saldo
      viernesIncluidos,
      incluyeFinesSemana,
      detallesDias
    };
  }

  /**
   * Verificar si requiere aprobación automática (Gerentes/Directores)
   */
  async requiereAprobacionAutomatica(empleadoId, client) {
    const query = `
      SELECT p.nombre as puesto
      FROM empleados e
      LEFT JOIN puestos p ON e.puesto_id = p.id
      WHERE e.id = $1
    `;
    const result = await client.query(query, [empleadoId]);
    const puesto = result.rows[0]?.puesto?.toLowerCase() || '';
    
    return puesto.includes('gerente') || puesto.includes('director');
  }

  /**
   * Obtener aprobador (jefe inmediato)
   */
  async obtenerAprobador(empleadoId, client) {
    const query = `
      SELECT supervisor_id FROM empleados WHERE id = $1
    `;
    const result = await client.query(query, [empleadoId]);
    return result.rows[0]?.supervisor_id;
  }

  /**
   * Aplicar descuento al período vacacional
   */
  async aplicarDescuentoPeriodo(periodoId, diasUsados, viernesUsados, client) {
    const query = `
      UPDATE periodos_vacacionales
      SET dias_disponibles = dias_disponibles - $1,
          dias_usados = dias_usados + $1,
          viernes_usados = viernes_usados + $2,
          estado = CASE 
            WHEN dias_disponibles - $1 <= 0 THEN 'consumido'
            ELSE estado
          END
      WHERE id = $3
    `;
    await client.query(query, [diasUsados, viernesUsados, periodoId]);
  }

  /**
   * Crear notificación
   */
  async crearNotificacion(solicitudId, destinatarioId, tipo, client) {
    const mensajes = {
      'solicitud_creada': {
        titulo: 'Nueva solicitud de vacaciones pendiente',
        mensaje: 'Tiene una nueva solicitud de vacaciones para revisar y aprobar.'
      },
      'solicitud_aprobada': {
        titulo: 'Solicitud de vacaciones aprobada',
        mensaje: 'Su solicitud de vacaciones ha sido aprobada automáticamente.'
      },
      'solicitud_rechazada': {
        titulo: 'Solicitud de vacaciones rechazada',
        mensaje: 'Su solicitud de vacaciones ha sido rechazada.'
      },
      'recordatorio_goce': {
        titulo: 'Recordatorio: Vacaciones próximas',
        mensaje: 'Sus vacaciones comienzan en 7 días.'
      }
    };

    const mensaje = mensajes[tipo];
    
    const query = `
      INSERT INTO notificaciones_vacaciones (
        solicitud_id, destinatario_id, tipo_notificacion, titulo, mensaje
      ) VALUES ($1, $2, $3, $4, $5)
    `;
    
    await client.query(query, [solicitudId, destinatarioId, tipo, mensaje.titulo, mensaje.mensaje]);
  }

  /**
   * Contar viernes en un rango de fechas
   */
  contarViernes(fechaInicio, fechaFin) {
    let count = 0;
    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 5) count++;
    }
    return count;
  }

  /**
   * Obtener resumen de vacaciones de un empleado
   */
  async obtenerResumenEmpleado(empleadoId) {
    try {
      const query = `
        SELECT 
          e.id as empleado_id,
          e.nombres,
          e.apellidos,
          COALESCE(SUM(pv.dias_totales), 0) as dias_totales,
          COALESCE(SUM(pv.dias_disponibles), 0) as dias_disponibles,
          COALESCE(SUM(pv.dias_totales - pv.dias_disponibles), 0) as dias_usados,
          COUNT(DISTINCT pv.id) as periodos_activos,
          (
            SELECT COUNT(*) 
            FROM solicitudes_vacaciones sv 
            WHERE sv.empleado_id = e.id AND sv.estado = 'pendiente'
          ) as solicitudes_pendientes
        FROM empleados e
        LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id AND pv.estado = 'activo'
        WHERE e.id = $1
        GROUP BY e.id, e.nombres, e.apellidos
      `;
      const result = await dbQuery(query, [empleadoId]);
      return result.rows[0] || this.resumenPorDefecto();
    } catch (error) {
      console.error('Error obteniendo resumen, retornando datos por defecto:', error);
      return this.resumenPorDefecto();
    }
  }

  /**
   * Obtener períodos vacacionales de un empleado
   */
  async obtenerPeriodos(empleadoId) {
    try {
      const query = `
        SELECT * FROM periodos_vacacionales
        WHERE empleado_id = $1 AND estado = 'activo'
        ORDER BY anio_generacion ASC
      `;
      const result = await dbQuery(query, [empleadoId]);
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo períodos, retornando array vacío:', error);
      return [];
    }
  }

  /**
   * Verificar si las tablas del sistema existen
   */
  async verificarTablasExisten() {
    try {
      const tablasRequeridas = [
        'periodos_vacacionales',
        'solicitudes_vacaciones',
        'feriados',
        'tipos_trabajador'
      ];
      
      for (const tabla of tablasRequeridas) {
        const query = `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          ) as exists
        `;
        const result = await dbQuery(query, [tabla]);
        
        if (!result.rows || result.rows.length === 0 || !result.rows[0].exists) {
          console.warn(`⚠️ Tabla faltante: ${tabla}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error verificando tablas:', error);
      return false;
    }
  }

  /**
   * Validaciones básicas sin acceso a BD
   */
  validacionesBasicasSinBD(solicitudData, validaciones) {
    const { fecha_inicio, fecha_fin } = solicitudData;
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    
    // Validar que fecha fin sea mayor o igual a inicio
    if (fin < inicio) {
      validaciones.errores.push('La fecha de fin debe ser posterior a la fecha de inicio');
      validaciones.valida = false;
    }
    
    // Calcular días
    const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    
    // Validación básica de días
    if (dias > 30) {
      validaciones.advertencias.push(`Está solicitando ${dias} días. Se recomienda no exceder 30 días por solicitud.`);
    }
    
    if (dias < 1) {
      validaciones.errores.push('Debe solicitar al menos 1 día de vacaciones');
      validaciones.valida = false;
    }
    
    validaciones.alertas.push(`Solicitud de ${dias} días (del ${fecha_inicio} al ${fecha_fin})`);
    
    return validaciones;
  }

  /**
   * Resumen por defecto cuando no existe data
   */
  resumenPorDefecto() {
    return {
      dias_disponibles: 0,
      dias_usados: 0,
      dias_pendientes: 0,
      total_generado: 0
    };
  }
}

export default new VacacionesService();
