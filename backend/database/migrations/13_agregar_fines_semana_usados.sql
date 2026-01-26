-- Agregar campo para trackear fines de semana usados en periodos vacacionales
-- Fecha: 26 de enero de 2026

-- Agregar columna si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'periodos_vacacionales' 
        AND column_name = 'fines_semana_usados'
    ) THEN
        ALTER TABLE periodos_vacacionales 
        ADD COLUMN fines_semana_usados INT DEFAULT 0;
        
        COMMENT ON COLUMN periodos_vacacionales.fines_semana_usados IS 
        'Cantidad de fines de semana (sábado + domingo) usados en este período';
        
        RAISE NOTICE 'Columna fines_semana_usados agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna fines_semana_usados ya existe';
    END IF;
END $$;

-- Actualizar registros existentes calculando fines de semana desde solicitudes aprobadas
UPDATE periodos_vacacionales pv
SET fines_semana_usados = COALESCE((
    SELECT SUM(
        LEAST(
            (SELECT COUNT(*) FROM generate_series(sv.fecha_inicio::date, sv.fecha_fin::date, '1 day'::interval) AS d WHERE EXTRACT(DOW FROM d) = 6),
            (SELECT COUNT(*) FROM generate_series(sv.fecha_inicio::date, sv.fecha_fin::date, '1 day'::interval) AS d WHERE EXTRACT(DOW FROM d) = 0)
        )
    )
    FROM solicitudes_vacaciones sv
    WHERE sv.periodo_id = pv.id 
      AND sv.estado = 'aprobada'
), 0)
WHERE EXISTS (
    SELECT 1 FROM solicitudes_vacaciones sv 
    WHERE sv.periodo_id = pv.id AND sv.estado = 'aprobada'
);

SELECT 'Migración 13_agregar_fines_semana_usados.sql completada exitosamente' AS status;
