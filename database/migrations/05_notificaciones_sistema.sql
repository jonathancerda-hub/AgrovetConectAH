-- ============================================
-- AGROVET CONECTA - CREACIÓN DE TABLAS
-- Paso 5: Notificaciones y Sistema
-- ============================================

-- NOTIFICACIONES
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('success', 'warning', 'error', 'info')),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    url_referencia TEXT,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SOLICITUDES DE NUEVO COLABORADOR
CREATE TABLE IF NOT EXISTS solicitudes_colaborador (
    id SERIAL PRIMARY KEY,
    solicitante_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    area_solicitante VARCHAR(255),
    dni_colaborador VARCHAR(8) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    puesto_solicitado VARCHAR(255) NOT NULL,
    modalidad VARCHAR(50),
    fecha_inicio DATE,
    horario VARCHAR(100),
    sueldo_propuesto DECIMAL(10, 2),
    descripcion_tarea TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado')),
    comentarios_rrhh TEXT,
    aprobado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_aprobacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOCUMENTOS DE EMPLEADOS
CREATE TABLE IF NOT EXISTS documentos_empleados (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(100) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo TEXT NOT NULL,
    fecha_subida DATE DEFAULT CURRENT_DATE,
    subido_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOLETAS DE PAGO
CREATE TABLE IF NOT EXISTS boletas_pago (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    periodo VARCHAR(7) NOT NULL,
    anio INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    salario_bruto DECIMAL(10, 2) NOT NULL,
    deducciones JSONB,
    salario_neto DECIMAL(10, 2) NOT NULL,
    url_pdf TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empleado_id, periodo)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id, leido);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created ON notificaciones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_solicitudes_colaborador_estado ON solicitudes_colaborador(estado);
CREATE INDEX IF NOT EXISTS idx_documentos_empleado ON documentos_empleados(empleado_id);
CREATE INDEX IF NOT EXISTS idx_boletas_empleado ON boletas_pago(empleado_id, periodo);

COMMENT ON TABLE notificaciones IS 'Sistema de notificaciones en tiempo real';
COMMENT ON TABLE solicitudes_colaborador IS 'Solicitudes de contratación de nuevo personal';
COMMENT ON TABLE documentos_empleados IS 'Repositorio de documentos (contratos, certificados, etc.)';
COMMENT ON TABLE boletas_pago IS 'Boletas de pago mensuales de empleados';
