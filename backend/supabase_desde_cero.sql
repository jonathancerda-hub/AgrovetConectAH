-- ==========================================
-- CREACIÓN COMPLETA DE BASE DE DATOS DESDE CERO
-- Para Supabase - Sistema AgroVet Conecta
-- ==========================================

-- 1. TABLA: Áreas/Departamentos
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    gerente_id INTEGER,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: Puestos
CREATE TABLE IF NOT EXISTS puestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel_jerarquico INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: Tipos de Trabajador
CREATE TABLE IF NOT EXISTS tipos_trabajador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    dias_vacaciones_anuales INT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar tipos predefinidos
INSERT INTO tipos_trabajador (nombre, dias_vacaciones_anuales, descripcion) VALUES
('Tiempo Completo', 30, 'Trabajador a tiempo completo'),
('Part Time', 7, 'Trabajador a tiempo parcial'),
('Practicante', 15, 'Practicante profesional o pre-profesional')
ON CONFLICT (nombre) DO NOTHING;

-- 4. TABLA: Empleados
CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    codigo_empleado VARCHAR(20) UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_ingreso DATE NOT NULL,
    puesto_id INTEGER REFERENCES puestos(id),
    area_id INTEGER REFERENCES areas(id),
    supervisor_id INTEGER REFERENCES empleados(id),
    tipo_trabajador_id INTEGER REFERENCES tipos_trabajador(id) DEFAULT 1,
    dias_descanso VARCHAR(50) DEFAULT 'Sabado,Domingo',
    es_rrhh BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'empleado' CHECK (rol IN ('empleado', 'coordinador', 'gerente', 'rrhh', 'admin')),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA: Períodos Vacacionales
CREATE TABLE IF NOT EXISTS periodos_vacacionales (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    anio_generacion INT NOT NULL,
    fecha_inicio_periodo DATE NOT NULL,
    fecha_fin_periodo DATE NOT NULL,
    dias_totales INT NOT NULL,
    dias_disponibles INT NOT NULL,
    dias_usados INT DEFAULT 0,
    viernes_usados INT DEFAULT 0,
    tiene_bloque_7dias BOOLEAN DEFAULT false,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'vencido', 'consumido')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empleado_id, anio_generacion)
);

-- 7. TABLA: Solicitudes de Vacaciones
CREATE TABLE IF NOT EXISTS solicitudes_vacaciones (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    periodo_id INT REFERENCES periodos_vacacionales(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INT NOT NULL,
    dias_calendario INT NOT NULL,
    viernes_incluidos INT DEFAULT 0,
    incluye_fines_semana BOOLEAN DEFAULT false,
    motivo TEXT,
    comentarios TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada')),
    tipo_solicitud VARCHAR(20) DEFAULT 'normal' CHECK (tipo_solicitud IN ('normal', 'fraccionada', 'adelantada')),
    es_bloque_continuo BOOLEAN DEFAULT false,
    
    -- Aprobación
    aprobador_id INT REFERENCES empleados(id),
    fecha_aprobacion TIMESTAMP,
    observaciones_aprobador TEXT,
    aprobacion_automatica BOOLEAN DEFAULT false,
    
    -- Control de planilla
    mes_solicitud INT NOT NULL,
    anio_solicitud INT NOT NULL,
    fecha_corte_cumplida BOOLEAN DEFAULT true,
    
    -- Auditoría
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT REFERENCES empleados(id),
    
    -- Restricciones
    CONSTRAINT chk_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT chk_dias_positivos CHECK (dias_solicitados > 0)
);

-- 8. TABLA: Feriados
CREATE TABLE IF NOT EXISTS feriados (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'nacional' CHECK (tipo IN ('nacional', 'regional', 'festivo')),
    pais VARCHAR(3) DEFAULT 'PE',
    anio INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar feriados de Perú 2025
INSERT INTO feriados (fecha, nombre, tipo, anio) VALUES
('2025-01-01', 'Año Nuevo', 'nacional', 2025),
('2025-04-17', 'Jueves Santo', 'nacional', 2025),
('2025-04-18', 'Viernes Santo', 'nacional', 2025),
('2025-05-01', 'Día del Trabajo', 'nacional', 2025),
('2025-06-29', 'San Pedro y San Pablo', 'nacional', 2025),
('2025-07-28', 'Día de la Independencia', 'nacional', 2025),
('2025-07-29', 'Fiestas Patrias', 'nacional', 2025),
('2025-08-30', 'Santa Rosa de Lima', 'nacional', 2025),
('2025-10-08', 'Combate de Angamos', 'nacional', 2025),
('2025-11-01', 'Día de Todos los Santos', 'nacional', 2025),
('2025-12-08', 'Inmaculada Concepción', 'nacional', 2025),
('2025-12-25', 'Navidad', 'nacional', 2025)
ON CONFLICT (fecha) DO NOTHING;

-- 9. TABLA: Aprobaciones
CREATE TABLE IF NOT EXISTS aprobaciones_vacaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INTEGER NOT NULL REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    aprobador_id INTEGER NOT NULL REFERENCES empleados(id),
    nivel INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    comentarios TEXT,
    fecha_revision TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(solicitud_id, nivel)
);

-- 10. TABLA: Historial de Saldos
CREATE TABLE IF NOT EXISTS historial_saldos (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id),
    periodo_id INTEGER REFERENCES periodos_vacacionales(id),
    tipo_movimiento VARCHAR(50) NOT NULL,
    dias_anteriores INTEGER NOT NULL,
    dias_movimiento INTEGER NOT NULL,
    dias_nuevos INTEGER NOT NULL,
    descripcion TEXT,
    solicitud_id INTEGER REFERENCES solicitudes_vacaciones(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES empleados(id)
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_empleados_email ON empleados(email);
CREATE INDEX IF NOT EXISTS idx_empleados_supervisor ON empleados(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_empleados_area ON empleados(area_id);
CREATE INDEX IF NOT EXISTS idx_empleados_es_rrhh ON empleados(es_rrhh);
CREATE INDEX IF NOT EXISTS idx_usuarios_empleado ON usuarios(empleado_id);
CREATE INDEX IF NOT EXISTS idx_periodos_empleado ON periodos_vacacionales(empleado_id);
CREATE INDEX IF NOT EXISTS idx_periodos_estado ON periodos_vacacionales(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_vacaciones(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha_creacion ON solicitudes_vacaciones(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_feriados_fecha ON feriados(fecha);
CREATE INDEX IF NOT EXISTS idx_aprobaciones_solicitud ON aprobaciones_vacaciones(solicitud_id);

-- TRIGGERS
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha_solicitudes
    BEFORE UPDATE ON solicitudes_vacaciones
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

CREATE TRIGGER trigger_actualizar_fecha_periodos
    BEFORE UPDATE ON periodos_vacacionales
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- FUNCIÓN: Calcular días calendario
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
) RETURNS INT AS $$
BEGIN
    RETURN (p_fecha_fin - p_fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;

-- Mensaje final
SELECT '✅ Base de datos creada exitosamente' as mensaje;
