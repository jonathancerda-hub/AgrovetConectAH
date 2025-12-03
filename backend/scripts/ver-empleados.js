import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function verificar() {
  const { data: emp } = await supabase.rpc('execute_sql', {
    sql: 'SELECT COUNT(*) as total FROM empleados'
  });
  
  console.log('Total empleados:', emp[0].total);
  
  const { data: lista } = await supabase.rpc('execute_sql', {
    sql: 'SELECT id, nombres, apellidos, correo FROM empleados LIMIT 10'
  });
  
  console.log('\nEmpleados:');
  console.log(JSON.stringify(lista, null, 2));
  
  // Ver períodos de empleado 8 (si existe)
  const { data: per } = await supabase.rpc('execute_sql', {
    sql: 'SELECT * FROM periodos_vacacionales WHERE empleado_id = 8'
  });
  
  console.log('\nPeríodos del empleado 8:');
  console.log(JSON.stringify(per, null, 2));
}

verificar();
