import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Wrapper para usar sintaxis de pg
export const query = async (text, params = []) => {
  // Convertir queries parametrizadas de pg ($1, $2) a queries normales
  let finalQuery = text;
  params.forEach((param, index) => {
    let value;
    if (param === null || param === undefined) {
      value = 'NULL';
    } else if (typeof param === 'string') {
      value = `'${param.replace(/'/g, "''")}'`;
    } else if (param instanceof Date) {
      value = `'${param.toISOString()}'`;
    } else {
      value = param;
    }
    finalQuery = finalQuery.replace(`$${index + 1}`, value);
  });
  
  console.log('🔍 Ejecutando query:', finalQuery.substring(0, 100) + '...');
  
  // Detectar si es SELECT o si tiene RETURNING (que devuelve datos)
  const isSelect = /^\s*SELECT/i.test(finalQuery);
  const hasReturning = /RETURNING/i.test(finalQuery);
  
  if (hasReturning) {
    console.log('📝 Query con RETURNING detectada');
    console.log('📝 Query completa:', finalQuery);
  }
  
  if (isSelect || hasReturning) {
    const { data, error } = await supabase.rpc('execute_sql', { sql: finalQuery });
    
    if (error) {
      console.error('Error en query Supabase:', error);
      throw error;
    }
    
    return { rows: data || [] };
  } else {
    // Para INSERT, UPDATE, DELETE sin RETURNING usamos execute_sql_write
    const { data, error } = await supabase.rpc('execute_sql_write', { sql: finalQuery });
    
    if (error) {
      console.error('Error en query Supabase:', error);
      throw error;
    }
    
    return { rows: [], rowCount: data };
  }
};

export const getClient = async () => ({
  query,
  release: () => {}
});

export default supabase;
