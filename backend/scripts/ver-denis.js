import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function ver() {
  // Buscar Denis
  const { data: denis } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, nombres, apellidos, correo FROM empleados WHERE correo = 'denis.huaman@agrovetmarket.com'`
  });
  
  console.log('=== DENIS HUAMÁN ===');
  console.log(JSON.stringify(denis, null, 2));
  
  if (!denis || denis.length === 0) {
    console.log('\nDenis Huamán NO existe en la base de datos');
    return;
  }
  
  const denisId = denis[0].id;
  
  // Ver períodos
  const { data: periodos } = await supabase.rpc('execute_sql', {
    sql: `SELECT * FROM periodos_vacacionales WHERE empleado_id = ${denisId} ORDER BY anio_generacion`
  });
  
  console.log('\n=== PERÍODOS ===');
  console.log(JSON.stringify(periodos, null, 2));
  
  // Ver solicitudes
  const { data: solicitudes } = await supabase.rpc('execute_sql', {
    sql: `SELECT * FROM solicitudes_vacaciones WHERE empleado_id = ${denisId} ORDER BY id DESC`
  });
  
  console.log('\n=== SOLICITUDES ===');
  console.log(JSON.stringify(solicitudes, null, 2));
}

ver();
