-- 🔍 CONSULTA RÁPIDA DE VERIFICACIÓN
-- Copia y pega esto en el SQL Editor de Supabase para verificar si los datos existen

-- 1. Contar períodos vacacionales
SELECT COUNT(*) as total_periodos FROM periodos_vacacionales;

-- 2. Ver todos los períodos
SELECT 
  pv.empleado_id,
  e.nombres || ' ' || e.apellidos as empleado,
  pv.dias_disponibles,
  pv.dias_totales,
  pv.anio_generacion,
  pv.estado
FROM periodos_vacacionales pv
LEFT JOIN empleados e ON pv.empleado_id = e.id
ORDER BY pv.empleado_id;

-- 3. Verificar específicamente el empleado 4
SELECT * FROM periodos_vacacionales WHERE empleado_id = 4;
