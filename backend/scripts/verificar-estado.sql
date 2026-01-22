-- Este script puede ejecutarse manualmente lote por lote
-- Ya tenemos: 38 áreas, 168 puestos, 4 tipos_trabajador

-- Ahora necesitamos cargar 219 empleados usando el archivo datos-procesados.json
-- Para esto, usa el script cargar-personal-supabase.js con las credenciales correctas

-- Verificar conexión
SELECT 'Conectado a Supabase!' as status;

-- Ver resumen actual
SELECT 
  (SELECT COUNT(*) FROM areas) as total_areas,
  (SELECT COUNT(*) FROM puestos) as total_puestos,
  (SELECT COUNT(*) FROM tipos_trabajador) as total_tipos,
  (SELECT COUNT(*) FROM empleados) as total_empleados;
