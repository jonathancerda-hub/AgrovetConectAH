-- ============================================
-- AGROVET CONECTA - CREACIÓN DE TABLAS
-- Paso 6: Utilidades y Auditoría
-- ============================================

-- CALENDARIO DE EVENTOS
CREATE TABLE IF NOT EXISTS calendario_eventos (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    tipo_evento VARCHAR(50) CHECK (tipo_evento IN ('Vacaciones', 'Reunión', 'Feriado', 'Capacitación')),
    color VARCHAR(7) DEFAULT '#1976d2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TAREAS PENDIENTES
CREATE TABLE IF NOT EXISTS tareas_pendientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) DEFAULT 'Media' CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    fecha_limite DATE,
    completada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BENEFICIOS
CREATE TABLE IF NOT EXISTS beneficios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(100),
    valor DECIMAL(10, 2),
    vigencia_inicio DATE,
    vigencia_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EMPLEADO_BENEFICIOS (Relación M:N)
CREATE TABLE IF NOT EXISTS empleado_beneficios (
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    beneficio_id INTEGER NOT NULL REFERENCES beneficios(id) ON DELETE CASCADE,
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(empleado_id, beneficio_id)
);

-- AUDITORIA (BITÁCORA)
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
    tabla_afectada VARCHAR(100),
    registro_id INTEGER,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_calendario_empleado ON calendario_eventos(empleado_id);
CREATE INDEX IF NOT EXISTS idx_calendario_fechas ON calendario_eventos(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_tareas_usuario ON tareas_pendientes(usuario_id, completada);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabla ON auditoria(tabla_afectada, registro_id);

COMMENT ON TABLE calendario_eventos IS 'Eventos del calendario (vacaciones, reuniones, feriados)';
COMMENT ON TABLE tareas_pendientes IS 'Lista de tareas pendientes por usuario';
COMMENT ON TABLE beneficios IS 'Catálogo de beneficios corporativos';
COMMENT ON TABLE empleado_beneficios IS 'Asignación de beneficios a empleados (M:N)';
COMMENT ON TABLE auditoria IS 'Registro de todas las acciones del sistema para trazabilidad';
