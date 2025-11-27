-- Migración: Agregar columnas de auditoría a solicitudes_vacaciones si no existen

-- Agregar fecha_creacion si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'solicitudes_vacaciones' 
        AND column_name = 'fecha_creacion'
    ) THEN
        ALTER TABLE solicitudes_vacaciones 
        ADD COLUMN fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Actualizar registros existentes con la fecha actual
        UPDATE solicitudes_vacaciones 
        SET fecha_creacion = CURRENT_TIMESTAMP 
        WHERE fecha_creacion IS NULL;
        
        RAISE NOTICE 'Columna fecha_creacion agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna fecha_creacion ya existe';
    END IF;
END $$;

-- Agregar fecha_actualizacion si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'solicitudes_vacaciones' 
        AND column_name = 'fecha_actualizacion'
    ) THEN
        ALTER TABLE solicitudes_vacaciones 
        ADD COLUMN fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Actualizar registros existentes con la fecha actual
        UPDATE solicitudes_vacaciones 
        SET fecha_actualizacion = CURRENT_TIMESTAMP 
        WHERE fecha_actualizacion IS NULL;
        
        RAISE NOTICE 'Columna fecha_actualizacion agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna fecha_actualizacion ya existe';
    END IF;
END $$;

-- Crear trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger si existe y crearlo de nuevo
DROP TRIGGER IF EXISTS trigger_actualizar_fecha ON solicitudes_vacaciones;

CREATE TRIGGER trigger_actualizar_fecha
    BEFORE UPDATE ON solicitudes_vacaciones
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Crear índice en fecha_creacion para mejorar performance en ordenamientos
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha_creacion 
ON solicitudes_vacaciones(fecha_creacion DESC);

SELECT 'Migración 09: Columnas de auditoría agregadas exitosamente' as mensaje;
