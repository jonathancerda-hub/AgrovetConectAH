-- ============================================
-- AGREGAR COLUMNAS created_at y updated_at
-- Fecha: 2025-12-03
-- Descripción: Agrega alias created_at/updated_at para compatibilidad
-- ============================================

BEGIN;

-- 1. Agregar columna created_at como alias de fecha_creacion
DO $$ 
BEGIN
    -- Agregar created_at a solicitudes_vacaciones si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='solicitudes_vacaciones' AND column_name='created_at'
    ) THEN
        ALTER TABLE solicitudes_vacaciones 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Copiar datos existentes de fecha_creacion a created_at
        UPDATE solicitudes_vacaciones 
        SET created_at = fecha_creacion 
        WHERE created_at IS NULL;
    END IF;

    -- Agregar updated_at a solicitudes_vacaciones si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='solicitudes_vacaciones' AND column_name='updated_at'
    ) THEN
        ALTER TABLE solicitudes_vacaciones 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Copiar datos existentes de fecha_actualizacion a updated_at
        UPDATE solicitudes_vacaciones 
        SET updated_at = fecha_actualizacion 
        WHERE updated_at IS NULL;
    END IF;

    -- Agregar created_at a notificaciones si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='notificaciones' AND column_name='created_at'
    ) THEN
        ALTER TABLE notificaciones 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Agregar updated_at a notificaciones si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='notificaciones' AND column_name='updated_at'
    ) THEN
        ALTER TABLE notificaciones 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 2. Crear triggers para mantener sincronizadas las columnas
-- Trigger para actualizar created_at cuando se inserte un registro
CREATE OR REPLACE FUNCTION sync_created_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_at IS NULL AND NEW.fecha_creacion IS NOT NULL THEN
        NEW.created_at := NEW.fecha_creacion;
    END IF;
    IF NEW.fecha_creacion IS NULL AND NEW.created_at IS NOT NULL THEN
        NEW.fecha_creacion := NEW.created_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at cuando se actualice un registro
CREATE OR REPLACE FUNCTION sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    NEW.fecha_actualizacion := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a solicitudes_vacaciones
DROP TRIGGER IF EXISTS trg_sync_created_at_solicitudes ON solicitudes_vacaciones;
CREATE TRIGGER trg_sync_created_at_solicitudes
    BEFORE INSERT ON solicitudes_vacaciones
    FOR EACH ROW
    EXECUTE FUNCTION sync_created_at();

DROP TRIGGER IF EXISTS trg_sync_updated_at_solicitudes ON solicitudes_vacaciones;
CREATE TRIGGER trg_sync_updated_at_solicitudes
    BEFORE UPDATE ON solicitudes_vacaciones
    FOR EACH ROW
    EXECUTE FUNCTION sync_updated_at();

-- 3. Verificación
SELECT 
    'solicitudes_vacaciones' as tabla,
    COUNT(*) FILTER (WHERE created_at IS NOT NULL) as con_created_at,
    COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as con_updated_at,
    COUNT(*) as total
FROM solicitudes_vacaciones
UNION ALL
SELECT 
    'notificaciones' as tabla,
    COUNT(*) FILTER (WHERE created_at IS NOT NULL) as con_created_at,
    COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as con_updated_at,
    COUNT(*) as total
FROM notificaciones;

COMMIT;

-- ============================================
-- NOTAS:
-- ============================================
-- Esta migración agrega las columnas created_at y updated_at
-- como alias de fecha_creacion y fecha_actualizacion para
-- mantener compatibilidad con el código que usa ambas convenciones.
-- Los triggers mantienen ambas columnas sincronizadas automáticamente.
-- ============================================
