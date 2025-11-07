-- Crear tablas faltantes del sistema de vacaciones

-- 1. Tabla de aprobaciones (para workflow de aprobación)
CREATE TABLE IF NOT EXISTS aprobaciones_vacaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INTEGER NOT NULL REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    aprobador_id INTEGER NOT NULL REFERENCES empleados(id),
    nivel INTEGER NOT NULL, -- 1=supervisor, 2=gerencia, 3=RRHH
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, aprobado, rechazado
    comentarios TEXT,
    fecha_revision TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(solicitud_id, nivel)
);

CREATE INDEX IF NOT EXISTS idx_aprobaciones_solicitud ON aprobaciones_vacaciones(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_aprobaciones_aprobador ON aprobaciones_vacaciones(aprobador_id);
CREATE INDEX IF NOT EXISTS idx_aprobaciones_estado ON aprobaciones_vacaciones(estado);

-- 2. Tabla de historial de saldos (auditoría)
CREATE TABLE IF NOT EXISTS historial_saldos (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id),
    periodo_id INTEGER REFERENCES periodos_vacacionales(id),
    tipo_movimiento VARCHAR(50) NOT NULL, -- generacion, uso, ajuste, caducidad
    dias_anteriores INTEGER NOT NULL,
    dias_movimiento INTEGER NOT NULL,
    dias_nuevos INTEGER NOT NULL,
    descripcion TEXT,
    solicitud_id INTEGER REFERENCES solicitudes_vacaciones(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES empleados(id)
);

CREATE INDEX IF NOT EXISTS idx_historial_empleado ON historial_saldos(empleado_id);
CREATE INDEX IF NOT EXISTS idx_historial_periodo ON historial_saldos(periodo_id);
CREATE INDEX IF NOT EXISTS idx_historial_tipo ON historial_saldos(tipo_movimiento);

-- 3. Verificación final
DO $$
BEGIN
    RAISE NOTICE '✅ Tablas adicionales creadas correctamente';
    RAISE NOTICE '   - aprobaciones_vacaciones';
    RAISE NOTICE '   - historial_saldos';
END $$;
