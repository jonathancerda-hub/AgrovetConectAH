import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function ver() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql: "SELECT * FROM feriados WHERE fecha BETWEEN '2025-12-15' AND '2026-01-15' ORDER BY fecha"
  });
  
  console.log('FERIADOS:');
  console.log(JSON.stringify(data, null, 2));
  
  const { data: sol } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, fecha_inicio, fecha_fin, estado, dias_solicitados 
          FROM solicitudes_vacaciones 
          WHERE empleado_id = (SELECT id FROM empleados WHERE correo = 'denis.huaman@agrovetmarket.com')
          AND estado IN ('pendiente', 'aprobada')
          ORDER BY fecha_inicio`
  });
  
  console.log('\nSOLICITUDES EXISTENTES:');
  console.log(JSON.stringify(sol, null, 2));
}

ver();
