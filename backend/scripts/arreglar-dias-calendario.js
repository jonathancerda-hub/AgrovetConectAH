import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function arreglar() {
  console.log('🔧 Arreglando columna dias_calendario...\n');
  
  // 1. Copiar dias_solicitados a dias_calendario donde sea NULL
  const { data: r1, error: e1 } = await supabase.rpc('execute_sql_write', {
    sql: `UPDATE solicitudes_vacaciones 
          SET dias_calendario = dias_solicitados 
          WHERE dias_calendario IS NULL`
  });
  
  if (e1) {
    console.error('Error:', e1.message);
  } else {
    console.log('✅ Copiados dias_solicitados -> dias_calendario');
  }
  
  // 2. Hacer la columna nullable (opcional, para evitar errores futuros)
  const { data: r2, error: e2 } = await supabase.rpc('execute_sql_write', {
    sql: `ALTER TABLE solicitudes_vacaciones 
          ALTER COLUMN dias_calendario DROP NOT NULL`
  });
  
  if (e2 && !e2.message.includes('does not exist')) {
    console.error('Error al hacer nullable:', e2.message);
  } else {
    console.log('✅ Columna dias_calendario ahora es nullable');
  }
  
  console.log('\n✨ Proceso completado');
}

arreglar();
