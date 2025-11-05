-- ============================================
-- AGROVET CONECTA - CREACIÓN DE TABLAS
-- Paso 3: Solicitudes de Vacaciones
-- ============================================

-- SOLICITUDES DE VACACIONES
CREATE TABLE IF NOT EXISTS solicitudes_vacaciones (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    aprobador_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado', 'Cancelado')),
    comentarios TEXT,
    motivo_rechazo TEXT,
    fecha_aprobacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_aprobador ON solicitudes_vacaciones(aprobador_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_vacaciones(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fechas ON solicitudes_vacaciones(fecha_inicio, fecha_fin);

COMMENT ON TABLE solicitudes_vacaciones IS 'Registro de solicitudes de vacaciones con flujo de aprobación';
