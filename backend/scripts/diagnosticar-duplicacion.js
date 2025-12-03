import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function diagnosticar() {
  // Ver estado actual del periodo 18 (2024 de Denis)
  const { data: periodo } = await supabase.rpc('execute_sql', {
    sql: `SELECT * FROM periodos_vacacionales WHERE id = 18`
  });
  
  console.log('=== PERÍODO 18 (2024) ===');
  console.log(JSON.stringify(periodo, null, 2));
  
  // Ver todas las solicitudes que afectan este periodo
  const { data: solicitudes } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, fecha_inicio, fecha_fin, dias_solicitados, dias_calendario, estado, created_at 
          FROM solicitudes_vacaciones 
          WHERE periodo_id = 18 
          ORDER BY id DESC 
          LIMIT 10`
  });
  
  console.log('\n=== SOLICITUDES DEL PERÍODO 18 ===');
  console.log(JSON.stringify(solicitudes, null, 2));
  
  // Calcular total de días que DEBERÍAN haberse restado
  const { data: suma } = await supabase.rpc('execute_sql', {
    sql: `SELECT 
            SUM(dias_solicitados) as total_solicitados,
            SUM(COALESCE(dias_calendario, 0)) as total_calendario,
            COUNT(*) as num_solicitudes
          FROM solicitudes_vacaciones 
          WHERE periodo_id = 18 
          AND estado IN ('pendiente', 'aprobada')`
  });
  
  console.log('\n=== SUMA DE DÍAS ===');
  console.log(JSON.stringify(suma, null, 2));
  
  // Calcular lo que DEBERÍA ser
  if (periodo && periodo.length > 0) {
    const diasTotales = periodo[0].dias_totales;
    const diasDisponibles = periodo[0].dias_disponibles;
    const diasUsados = diasTotales - diasDisponibles;
    const sumaSolicitudes = suma[0].total_solicitados;
    
    console.log('\n=== ANÁLISIS ===');
    console.log(`Días totales: ${diasTotales}`);
    console.log(`Días disponibles actuales: ${diasDisponibles}`);
    console.log(`Días usados (calculado): ${diasUsados}`);
    console.log(`Suma de solicitudes: ${sumaSolicitudes}`);
    console.log(`Diferencia: ${diasUsados - sumaSolicitudes} (debería ser 0)`);
    
    if (diasUsados !== sumaSolicitudes) {
      console.log('\n⚠️ HAY DUPLICACIÓN!');
      console.log(`Se restaron ${diasUsados} días pero solo hay ${sumaSolicitudes} días en solicitudes`);
    }
  }
}

diagnosticar();
