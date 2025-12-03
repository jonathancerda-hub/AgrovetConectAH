-- Agregar columnas created_at y updated_at a solicitudes_vacaciones
ALTER TABLE solicitudes_vacaciones 
  ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE solicitudes_vacaciones 
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Copiar datos existentes
UPDATE solicitudes_vacaciones 
SET created_at = fecha_creacion 
WHERE created_at IS NULL;

UPDATE solicitudes_vacaciones 
SET updated_at = COALESCE(fecha_actualizacion, fecha_creacion) 
WHERE updated_at IS NULL;

-- Crear función para sincronizar created_at con fecha_creacion
CREATE OR REPLACE FUNCTION sync_created_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_creacion IS NOT NULL THEN
    NEW.created_at := NEW.fecha_creacion;
  END IF;
  IF NEW.created_at IS NOT NULL THEN
    NEW.fecha_creacion := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear función para sincronizar updated_at con fecha_actualizacion
CREATE OR REPLACE FUNCTION sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_actualizacion IS NOT NULL THEN
    NEW.updated_at := NEW.fecha_actualizacion;
  ELSIF NEW.updated_at IS NOT NULL THEN
    NEW.fecha_actualizacion := NEW.updated_at;
  ELSE
    NEW.updated_at := NOW();
    NEW.fecha_actualizacion := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para solicitudes_vacaciones
DROP TRIGGER IF EXISTS trigger_sync_created_at ON solicitudes_vacaciones;
CREATE TRIGGER trigger_sync_created_at
  BEFORE INSERT OR UPDATE ON solicitudes_vacaciones
  FOR EACH ROW
  EXECUTE FUNCTION sync_created_at();

DROP TRIGGER IF EXISTS trigger_sync_updated_at ON solicitudes_vacaciones;
CREATE TRIGGER trigger_sync_updated_at
  BEFORE INSERT OR UPDATE ON solicitudes_vacaciones
  FOR EACH ROW
  EXECUTE FUNCTION sync_updated_at();

-- Hacer lo mismo para notificaciones
ALTER TABLE notificaciones 
  ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE notificaciones 
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE notificaciones 
SET created_at = fecha_creacion 
WHERE created_at IS NULL;

UPDATE notificaciones 
SET updated_at = COALESCE(fecha_actualizacion, fecha_creacion) 
WHERE updated_at IS NULL;

DROP TRIGGER IF EXISTS trigger_sync_created_at ON notificaciones;
CREATE TRIGGER trigger_sync_created_at
  BEFORE INSERT OR UPDATE ON notificaciones
  FOR EACH ROW
  EXECUTE FUNCTION sync_created_at();

DROP TRIGGER IF EXISTS trigger_sync_updated_at ON notificaciones;
CREATE TRIGGER trigger_sync_updated_at
  BEFORE INSERT OR UPDATE ON notificaciones
  FOR EACH ROW
  EXECUTE FUNCTION sync_updated_at();
