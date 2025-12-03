import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function verTriggers() {
  const { data } = await supabase.rpc('execute_sql', {
    sql: `SELECT 
            t.tgname AS trigger_name,
            c.relname AS table_name,
            p.proname AS function_name,
            pg_get_triggerdef(t.oid) AS trigger_definition
          FROM pg_trigger t
          JOIN pg_class c ON t.tgrelid = c.oid
          JOIN pg_proc p ON t.tgfoid = p.oid
          WHERE c.relname IN ('solicitudes_vacaciones', 'periodos_vacacionales')
          AND NOT t.tgisinternal
          ORDER BY c.relname, t.tgname`
  });
  
  console.log('=== TRIGGERS EN TABLAS DE VACACIONES ===');
  console.log(JSON.stringify(data, null, 2));
}

verTriggers();
