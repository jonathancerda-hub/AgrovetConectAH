import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function revisar() {
  // Ver todas las solicitudes de Denis
  const { data: solicitudes } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, fecha_inicio, fecha_fin, dias_solicitados, estado, fecha_creacion
          FROM solicitudes_vacaciones 
          WHERE empleado_id = (SELECT id FROM empleados WHERE correo = 'denis.huaman@agrovetmarket.com')
          ORDER BY id`
  });
  
  console.log('=== TODAS LAS SOLICITUDES DE DENIS ===');
  console.log(JSON.stringify(solicitudes, null, 2));
  
  // Ver períodos de vacaciones
  const { data: periodos } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, anio, dias_totales, dias_tomados, dias_disponibles
          FROM periodos_vacaciones 
          WHERE empleado_id = (SELECT id FROM empleados WHERE correo = 'denis.huaman@agrovetmarket.com')
          ORDER BY anio`
  });
  
  console.log('\n=== PERÍODOS DE VACACIONES ===');
  console.log(JSON.stringify(periodos, null, 2));
}

revisar();
