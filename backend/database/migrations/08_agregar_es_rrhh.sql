-- Migración: Agregar columna es_rrhh a tabla empleados
-- Fecha: 2025-11-26
-- Descripción: Permite identificar empleados que pertenecen a RRHH y pueden ver todas las solicitudes

-- Agregar columna es_rrhh
ALTER TABLE empleados 
ADD COLUMN IF NOT EXISTS es_rrhh BOOLEAN DEFAULT FALSE;

-- Agregar comentario a la columna
COMMENT ON COLUMN empleados.es_rrhh IS 'Indica si el empleado pertenece al departamento de RRHH y puede ver todas las solicitudes';

-- Crear índice para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_empleados_es_rrhh ON empleados(es_rrhh);

-- Actualizar trigger de updated_at (si no existe)
CREATE OR REPLACE FUNCTION update_empleados_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS empleados_updated_at ON empleados;
CREATE TRIGGER empleados_updated_at
    BEFORE UPDATE ON empleados
    FOR EACH ROW
    EXECUTE FUNCTION update_empleados_updated_at();

-- Log de migración
DO $$
BEGIN
    RAISE NOTICE 'Migración 08_agregar_es_rrhh completada exitosamente';
END $$;
