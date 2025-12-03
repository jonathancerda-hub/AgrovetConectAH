import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function recalcular() {
  console.log('🔧 Recalculando días disponibles de todos los períodos...\n');
  
  // Obtener todos los períodos activos
  const { data: periodos } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, empleado_id, anio_generacion, dias_totales 
          FROM periodos_vacacionales 
          WHERE estado = 'activo'`
  });
  
  console.log(`📊 Encontrados ${periodos.length} períodos activos\n`);
  
  for (const periodo of periodos) {
    // Sumar días solicitados (solo una columna)
    const { data: suma } = await supabase.rpc('execute_sql', {
      sql: `SELECT COALESCE(SUM(dias_solicitados), 0) as total
            FROM solicitudes_vacaciones
            WHERE periodo_id = ${periodo.id}
            AND estado IN ('pendiente', 'aprobada')`
    });
    
    const diasUsados = suma[0].total;
    const diasDisponibles = periodo.dias_totales - diasUsados;
    
    // Actualizar el período
    const { error } = await supabase.rpc('execute_sql_write', {
      sql: `UPDATE periodos_vacacionales
            SET dias_disponibles = ${diasDisponibles},
                dias_usados = ${diasUsados}
            WHERE id = ${periodo.id}`
    });
    
    if (error) {
      console.error(`❌ Error en período ${periodo.id}:`, error.message);
    } else {
      console.log(`✅ Período ${periodo.anio_generacion} (empleado ${periodo.empleado_id}): ${periodo.dias_totales} - ${diasUsados} = ${diasDisponibles} días`);
    }
  }
  
  console.log('\n✨ Recalculo completado!');
}

recalcular();
