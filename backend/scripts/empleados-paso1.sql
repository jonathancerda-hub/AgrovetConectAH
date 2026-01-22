-- PASO 1: Obtener IDs de puestos
DO $$
DECLARE
  puesto_record RECORD;
BEGIN
  -- Crear tabla temporal para mapeo de puestos
  CREATE TEMP TABLE IF NOT EXISTS temp_puestos_map (nombre TEXT, puesto_id INT);
  FOR puesto_record IN SELECT id, nombre FROM puestos LOOP
    INSERT INTO temp_puestos_map VALUES (puesto_record.nombre, puesto_record.id);
  END LOOP;
END $$;
