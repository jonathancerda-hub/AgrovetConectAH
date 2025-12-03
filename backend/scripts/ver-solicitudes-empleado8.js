import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function ver() {
  // Ver solicitudes del empleado 8
  const { data } = await supabase.rpc('execute_sql', {
    sql: `SELECT sv.id, sv.fecha_inicio, sv.fecha_fin, sv.dias_solicitados, sv.estado,
                 sv.periodo_id,
                 pv.anio_generacion, pv.dias_disponibles as periodo_disponibles
          FROM solicitudes_vacaciones sv
          JOIN periodos_vacacionales pv ON sv.periodo_id = pv.id
          WHERE sv.empleado_id = 8
          ORDER BY sv.id DESC`
  });
  
  console.log('=== SOLICITUDES Y PERÍODOS ===');
  console.log(JSON.stringify(data, null, 2));
  
  // Ver saldo actual de períodos
  const { data: periodos } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, anio_generacion, dias_totales, dias_disponibles, dias_usados
          FROM periodos_vacacionales
          WHERE empleado_id = 8
          ORDER BY anio_generacion`
  });
  
  console.log('\n=== SALDOS DE PERÍODOS ===');
  console.log(JSON.stringify(periodos, null, 2));
}

ver();
