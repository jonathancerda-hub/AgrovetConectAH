-- =====================================================
-- FUNCIONES RPC PARA SUPABASE
-- Ejecuta este script EN EL SQL EDITOR DE SUPABASE
-- =====================================================

-- Eliminar funciones si existen
DROP FUNCTION IF EXISTS execute_sql(text);
DROP FUNCTION IF EXISTS execute_sql_write(text);

-- Función para ejecutar cualquier SQL (SELECT, INSERT con RETURNING, etc.)
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  is_select boolean;
  is_returning boolean;
BEGIN
  -- Detectar si es SELECT o tiene RETURNING
  is_select := sql ~* '^\s*SELECT';
  is_returning := sql ~* 'RETURNING';
  
  IF is_select THEN
    -- Es un SELECT directo
    EXECUTE format('SELECT json_agg(t) FROM (%s) t', sql) INTO result;
  ELSIF is_returning THEN
    -- Es INSERT/UPDATE/DELETE con RETURNING
    EXECUTE format('WITH result AS (%s) SELECT json_agg(result) FROM result', sql) INTO result;
  ELSE
    -- No debería llegar aquí
    RAISE EXCEPTION 'execute_sql solo acepta SELECT o comandos con RETURNING';
  END IF;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Función para ejecutar comandos de escritura sin RETURNING
CREATE OR REPLACE FUNCTION execute_sql_write(sql text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows integer;
BEGIN
  EXECUTE sql;
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$;

-- Verificar que se crearon correctamente
SELECT 'Funciones RPC creadas exitosamente' as mensaje;
