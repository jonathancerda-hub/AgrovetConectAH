import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testQuery() {
  // Simular la query del backend
  const { data } = await supabase.rpc('execute_sql', {
    sql: `SELECT 
        e.id as empleado_id,
        e.nombres || ' ' || e.apellidos as nombre_completo,
        a.nombre as area,
        p.nombre as puesto,
        COALESCE(SUM(pv.dias_totales), 0) as dias_totales,
        COALESCE(SUM(pv.dias_disponibles), 0) as dias_disponibles,
        COALESCE(SUM(pv.dias_usados), 0) as dias_tomados
      FROM empleados e
      LEFT JOIN areas a ON e.area_id = a.id
      LEFT JOIN puestos p ON e.puesto_id = p.id
      LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id 
        AND pv.estado = 'activo'
      WHERE e.activo = true AND e.id = 13
      GROUP BY e.id, e.nombres, e.apellidos, a.nombre, p.nombre`
  });
  
  console.log('=== RESULTADO QUERY DASHBOARD ===');
  console.log(JSON.stringify(data, null, 2));
  
  // Ver períodos directamente
  const { data: periodos } = await supabase.rpc('execute_sql', {
    sql: `SELECT id, anio_generacion, dias_totales, dias_disponibles, dias_usados, estado
          FROM periodos_vacacionales 
          WHERE empleado_id = 13 AND estado = 'activo'`
  });
  
  console.log('\n=== PERÍODOS DE DENIS ===');
  console.log(JSON.stringify(periodos, null, 2));
}

testQuery();
