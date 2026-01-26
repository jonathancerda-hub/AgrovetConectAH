import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de conexión a Supabase
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }
});

/**
 * Recalcula los contadores de viernes y fines de semana para todos los períodos
 * basándose en las solicitudes aprobadas existentes
 */
async function recalcularContadores() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando recálculo de contadores de períodos...\n');
    
    // Obtener todos los períodos activos
    const periodosQuery = `
      SELECT id, empleado_id, anio_generacion, dias_totales
      FROM periodos_vacacionales
      WHERE estado = 'activo'
      ORDER BY empleado_id, anio_generacion
    `;
    
    const periodosResult = await client.query(periodosQuery);
    console.log(`📊 Períodos encontrados: ${periodosResult.rows.length}\n`);
    
    let periodosActualizados = 0;
    
    for (const periodo of periodosResult.rows) {
      console.log(`\n📋 Procesando Período ${periodo.anio_generacion} - Empleado ID: ${periodo.empleado_id}`);
      
      // Obtener todas las solicitudes aprobadas de este período
      const solicitudesQuery = `
        SELECT 
          id,
          fecha_inicio,
          fecha_fin,
          dias_solicitados,
          estado
        FROM solicitudes_vacaciones
        WHERE periodo_id = $1
          AND estado IN ('aprobada', 'completada')
        ORDER BY fecha_inicio
      `;
      
      const solicitudesResult = await client.query(solicitudesQuery, [periodo.id]);
      
      if (solicitudesResult.rows.length === 0) {
        console.log('   ℹ️  No hay solicitudes aprobadas en este período');
        continue;
      }
      
      console.log(`   📅 Solicitudes aprobadas: ${solicitudesResult.rows.length}`);
      
      // Calcular totales
      let totalViernes = 0;
      let totalSabados = 0;
      let totalDomingos = 0;
      let totalDias = 0;
      
      for (const solicitud of solicitudesResult.rows) {
        const inicio = new Date(solicitud.fecha_inicio + 'T00:00:00');
        const fin = new Date(solicitud.fecha_fin + 'T00:00:00');
        
        let viernes = 0;
        let sabados = 0;
        let domingos = 0;
        
        let fecha = new Date(inicio);
        while (fecha <= fin) {
          const diaSemana = fecha.getDay();
          if (diaSemana === 5) viernes++;
          else if (diaSemana === 6) sabados++;
          else if (diaSemana === 0) domingos++;
          fecha.setDate(fecha.getDate() + 1);
        }
        
        totalViernes += viernes;
        totalSabados += sabados;
        totalDomingos += domingos;
        totalDias += solicitud.dias_solicitados;
        
        console.log(`      • ${solicitud.fecha_inicio} → ${solicitud.fecha_fin}: ${solicitud.dias_solicitados} días (${viernes} viernes, ${sabados} sáb, ${domingos} dom)`);
      }
      
      const totalFinesSemana = Math.min(totalSabados, totalDomingos);
      
      console.log(`   ✅ Totales: ${totalDias} días, ${totalViernes} viernes, ${totalFinesSemana} fines de semana`);
      
      // Actualizar el período
      const updateQuery = `
        UPDATE periodos_vacacionales
        SET 
          dias_usados = $1,
          dias_disponibles = dias_totales - $1,
          viernes_usados = $2,
          fines_semana_usados = $3
        WHERE id = $4
        RETURNING dias_totales, dias_usados, dias_disponibles, viernes_usados, fines_semana_usados
      `;
      
      const updateResult = await client.query(updateQuery, [
        totalDias,
        totalViernes,
        totalFinesSemana,
        periodo.id
      ]);
      
      const updated = updateResult.rows[0];
      console.log(`   💾 Actualizado: ${updated.dias_usados}/${updated.dias_totales} días, ${updated.viernes_usados} viernes, ${updated.fines_semana_usados} fines de semana`);
      console.log(`   📊 Disponibles: ${updated.dias_disponibles} días`);
      
      periodosActualizados++;
    }
    
    console.log(`\n\n✅ Recálculo completado!`);
    console.log(`   Períodos actualizados: ${periodosActualizados}/${periodosResult.rows.length}`);
    
  } catch (error) {
    console.error('❌ Error al recalcular contadores:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar
recalcularContadores()
  .then(() => {
    console.log('\n✅ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
