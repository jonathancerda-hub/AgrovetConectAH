-- ============================================
-- SCRIPT COMPLETO DE MIGRACIÃ“N A SUPABASE
-- Ejecuta TODAS las migraciones en orden
-- ============================================

-- Este script combina todas las migraciones en el orden correcto
-- para crear la base de datos completa desde cero

\echo 'ðŸš€ Iniciando migraciÃ³n completa a Supabase...'
\echo ''

-- MIGRACIÃ“N 01: Estructura base
\echo 'ðŸ“¦ Ejecutando migraciÃ³n 01: Estructura base...'
\i 01_estructura_base.sql

-- MIGRACIÃ“N 02: Sistema de usuarios
\echo 'ðŸ‘¥ Ejecutando migraciÃ³n 02: Sistema de usuarios...'
\i 02_sistema_usuarios.sql

-- MIGRACIÃ“N 03: GestiÃ³n de empleados
\echo 'ðŸ‘¤ Ejecutando migraciÃ³n 03: GestiÃ³n de empleados...'
\i 03_gestion_empleados.sql

-- MIGRACIÃ“N 04: Comunicaciones
\echo 'ðŸ“¢ Ejecutando migraciÃ³n 04: Comunicaciones...'
\i 04_comunicaciones.sql

-- MIGRACIÃ“N 05: Sistema de vacaciones
\echo 'ðŸ–ï¸ Ejecutando migraciÃ³n 05: Sistema de vacaciones...'
\i 05_sistema_vacaciones.sql

-- MIGRACIÃ“N 06: GestiÃ³n de documentos
\echo 'ðŸ“„ Ejecutando migraciÃ³n 06: GestiÃ³n de documentos...'
\i 06_gestion_documentos.sql

-- MIGRACIÃ“N 07: Tablas adicionales
\echo 'ðŸ“Š Ejecutando migraciÃ³n 07: Tablas adicionales...'
\i 07_tablas_adicionales.sql

-- MIGRACIÃ“N 08: Columna es_rrhh
\echo 'ðŸ” Ejecutando migraciÃ³n 08: Columna es_rrhh...'
\i 08_agregar_es_rrhh.sql

-- MIGRACIÃ“N 09: Columnas de auditorÃ­a
\echo 'ðŸ“ Ejecutando migraciÃ³n 09: Columnas de auditorÃ­a...'
\i 09_agregar_columnas_auditoria.sql

\echo ''
\echo 'âœ… MigraciÃ³n completa exitosa!'
\echo ''
\echo 'PrÃ³ximo paso: Ejecutar seeds.sql para insertar datos de prueba'
-- Script de verificaciÃ³n y creaciÃ³n mÃ­nima para testing

-- Verificar si las tablas existen
DO $$ 
BEGIN
    -- Crear tipos_trabajador si no existe
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tipos_trabajador') THEN
        CREATE TABLE tipos_trabajador (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            descripcion TEXT,
            dias_vacaciones_anuales INTEGER NOT NULL,
            activo BOOLEAN DEFAULT true,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        INSERT INTO tipos_trabajador (nombre, descripcion, dias_vacaciones_anuales) VALUES
        ('Tiempo Completo', 'Empleados a tiempo completo', 30),
        ('Part Time', 'Empleados a tiempo parcial', 7),
        ('Practicante', 'Practicantes y pasantes', 15);
        
        RAISE NOTICE 'Tabla tipos_trabajador creada';
    END IF;

    -- Agregar columnas a empleados si no existen
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'empleados' AND column_name = 'tipo_trabajador_id') THEN
        ALTER TABLE empleados ADD COLUMN tipo_trabajador_id INTEGER REFERENCES tipos_trabajador(id) DEFAULT 1;
        RAISE NOTICE 'Columna tipo_trabajador_id agregada a empleados';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'empleados' AND column_name = 'dias_descanso') THEN
        ALTER TABLE empleados ADD COLUMN dias_descanso VARCHAR(50) DEFAULT 'SÃ¡bado,Domingo';
        RAISE NOTICE 'Columna dias_descanso agregada a empleados';
    END IF;

    -- Crear periodos_vacacionales si no existe
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'periodos_vacacionales') THEN
        CREATE TABLE periodos_vacacionales (
            id SERIAL PRIMARY KEY,
            empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
            anio_generacion INTEGER NOT NULL,
            fecha_generacion DATE NOT NULL,
            dias_totales INTEGER NOT NULL,
            dias_disponibles INTEGER NOT NULL,
            dias_usados INTEGER DEFAULT 0,
            viernes_usados INTEGER DEFAULT 0,
            estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'consumido', 'expirado')),
            fecha_expiracion DATE,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX idx_periodos_empleado ON periodos_vacacionales(empleado_id);
        CREATE INDEX idx_periodos_estado ON periodos_vacacionales(estado);
        RAISE NOTICE 'Tabla periodos_vacacionales creada';
    END IF;

    -- Crear feriados si no existe
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'feriados') THEN
        CREATE TABLE feriados (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            fecha DATE NOT NULL,
            anio INTEGER NOT NULL,
            tipo VARCHAR(50) DEFAULT 'nacional',
            descripcion TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX idx_feriados_fecha ON feriados(fecha);
        CREATE INDEX idx_feriados_anio ON feriados(anio);
        
        -- Insertar feriados 2025 de PerÃº
        INSERT INTO feriados (nombre, fecha, anio, tipo) VALUES
        ('AÃ±o Nuevo', '2025-01-01', 2025, 'nacional'),
        ('Jueves Santo', '2025-04-17', 2025, 'nacional'),
        ('Viernes Santo', '2025-04-18', 2025, 'nacional'),
        ('DÃ­a del Trabajo', '2025-05-01', 2025, 'nacional'),
        ('San Pedro y San Pablo', '2025-06-29', 2025, 'nacional'),
        ('Fiestas Patrias', '2025-07-28', 2025, 'nacional'),
        ('Fiestas Patrias', '2025-07-29', 2025, 'nacional'),
        ('Santa Rosa de Lima', '2025-08-30', 2025, 'nacional'),
        ('Combate de Angamos', '2025-10-08', 2025, 'nacional'),
        ('Todos los Santos', '2025-11-01', 2025, 'nacional'),
        ('Inmaculada ConcepciÃ³n', '2025-12-08', 2025, 'nacional'),
        ('Navidad', '2025-12-25', 2025, 'nacional');
        
        RAISE NOTICE 'Tabla feriados creada con datos 2025';
    END IF;

END $$;

-- Crear una funciÃ³n simple para calcular dÃ­as calendario
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    fecha_inicio DATE,
    fecha_fin DATE
) RETURNS INTEGER AS $$
BEGIN
    RETURN (fecha_fin - fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;
-- =====================================================
-- SISTEMA DE GESTIÃ“N DE VACACIONES - ESTRUCTURA COMPLETA
-- =====================================================

-- 1. TABLA: Tipos de Trabajador
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

-- 2. Agregar campo tipo_trabajador a empleados
ALTER TABLE empleados 
ADD COLUMN IF NOT EXISTS tipo_trabajador_id INT REFERENCES tipos_trabajador(id) DEFAULT 1,
ADD COLUMN IF NOT EXISTS dias_descanso VARCHAR(50) DEFAULT 'Sabado,Domingo';

-- 3. TABLA: PerÃ­odos Vacacionales
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

-- Ãndices para periodos vacacionales
CREATE INDEX IF NOT EXISTS idx_periodos_empleado ON periodos_vacacionales(empleado_id);
CREATE INDEX IF NOT EXISTS idx_periodos_estado ON periodos_vacacionales(estado);
CREATE INDEX IF NOT EXISTS idx_periodos_anio ON periodos_vacacionales(anio_generacion);

-- 4. TABLA: Solicitudes de Vacaciones (mejorada)
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
    
    -- AprobaciÃ³n
    aprobador_id INT REFERENCES empleados(id),
    fecha_aprobacion TIMESTAMP,
    observaciones_aprobador TEXT,
    aprobacion_automatica BOOLEAN DEFAULT false,
    
    -- Control de planilla
    mes_solicitud INT NOT NULL,
    anio_solicitud INT NOT NULL,
    fecha_corte_cumplida BOOLEAN DEFAULT true,
    
    -- AuditorÃ­a
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT REFERENCES empleados(id),
    
    -- Restricciones
    CONSTRAINT chk_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT chk_dias_positivos CHECK (dias_solicitados > 0)
);

-- Ãndices para solicitudes
CREATE INDEX IF NOT EXISTS idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_vacaciones(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fechas ON solicitudes_vacaciones(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_solicitudes_periodo ON solicitudes_vacaciones(periodo_id);

-- 5. TABLA: Detalle de DÃ­as Solicitados
CREATE TABLE IF NOT EXISTS detalle_dias_vacaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT NOT NULL REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    es_dia_laboral BOOLEAN DEFAULT true,
    es_feriado BOOLEAN DEFAULT false,
    es_fin_semana BOOLEAN DEFAULT false,
    es_viernes BOOLEAN DEFAULT false,
    periodo_origen_id INT REFERENCES periodos_vacacionales(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_detalle_solicitud ON detalle_dias_vacaciones(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_detalle_fecha ON detalle_dias_vacaciones(fecha);

-- 6. TABLA: Historial de Aprobaciones
CREATE TABLE IF NOT EXISTS historial_aprobaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT NOT NULL REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    aprobador_id INT NOT NULL REFERENCES empleados(id),
    nivel_aprobacion INT DEFAULT 1,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('aprobado', 'rechazado', 'redirigido', 'pendiente')),
    comentarios TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    CONSTRAINT unique_nivel_solicitud UNIQUE(solicitud_id, nivel_aprobacion)
);

CREATE INDEX IF NOT EXISTS idx_historial_solicitud ON historial_aprobaciones(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_historial_aprobador ON historial_aprobaciones(aprobador_id);

-- 7. TABLA: Notificaciones de Vacaciones
CREATE TABLE IF NOT EXISTS notificaciones_vacaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    destinatario_id INT NOT NULL REFERENCES empleados(id),
    tipo_notificacion VARCHAR(50) NOT NULL CHECK (tipo_notificacion IN (
        'solicitud_creada',
        'solicitud_aprobada',
        'solicitud_rechazada',
        'recordatorio_goce',
        'periodo_proximo_vencer',
        'alerta_viernes_limite',
        'alerta_bloque_continuo'
    )),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    fecha_lectura TIMESTAMP,
    enviado_email BOOLEAN DEFAULT false,
    fecha_envio_email TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notif_destinatario ON notificaciones_vacaciones(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_notif_leida ON notificaciones_vacaciones(leida);
CREATE INDEX IF NOT EXISTS idx_notif_solicitud ON notificaciones_vacaciones(solicitud_id);

-- 8. TABLA: Alertas y Validaciones
CREATE TABLE IF NOT EXISTS alertas_validaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    tipo_alerta VARCHAR(50) NOT NULL,
    nivel VARCHAR(20) DEFAULT 'warning' CHECK (nivel IN ('info', 'warning', 'error')),
    mensaje TEXT NOT NULL,
    regla_violada VARCHAR(100),
    requiere_aprobacion_especial BOOLEAN DEFAULT false,
    resuelta BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alertas_solicitud ON alertas_validaciones(solicitud_id);

-- 9. TABLA: Feriados (para cÃ¡lculos)
CREATE TABLE IF NOT EXISTS feriados (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'nacional' CHECK (tipo IN ('nacional', 'regional', 'festivo')),
    pais VARCHAR(3) DEFAULT 'PE',
    anio INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar feriados de PerÃº 2025
INSERT INTO feriados (fecha, nombre, tipo, anio) VALUES
('2025-01-01', 'AÃ±o Nuevo', 'nacional', 2025),
('2025-04-17', 'Jueves Santo', 'nacional', 2025),
('2025-04-18', 'Viernes Santo', 'nacional', 2025),
('2025-04-19', 'SÃ¡bado de Gloria', 'nacional', 2025),
('2025-05-01', 'DÃ­a del Trabajo', 'nacional', 2025),
('2025-06-29', 'San Pedro y San Pablo', 'nacional', 2025),
('2025-07-28', 'DÃ­a de la Independencia', 'nacional', 2025),
('2025-07-29', 'Fiestas Patrias', 'nacional', 2025),
('2025-08-30', 'Santa Rosa de Lima', 'nacional', 2025),
('2025-10-08', 'Combate de Angamos', 'nacional', 2025),
('2025-11-01', 'DÃ­a de Todos los Santos', 'nacional', 2025),
('2025-12-08', 'Inmaculada ConcepciÃ³n', 'nacional', 2025),
('2025-12-25', 'Navidad', 'nacional', 2025)
ON CONFLICT (fecha) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_feriados_fecha ON feriados(fecha);
CREATE INDEX IF NOT EXISTS idx_feriados_anio ON feriados(anio);

-- 10. FUNCIÃ“N: Generar perÃ­odo vacacional automÃ¡ticamente
CREATE OR REPLACE FUNCTION generar_periodo_vacacional(
    p_empleado_id INT,
    p_fecha_inicio DATE
) RETURNS INT AS $$
DECLARE
    v_tipo_trabajador_id INT;
    v_dias_anuales INT;
    v_anio INT;
    v_periodo_id INT;
BEGIN
    -- Obtener tipo de trabajador y dÃ­as correspondientes
    SELECT tipo_trabajador_id INTO v_tipo_trabajador_id
    FROM empleados WHERE id = p_empleado_id;
    
    SELECT dias_vacaciones_anuales INTO v_dias_anuales
    FROM tipos_trabajador WHERE id = v_tipo_trabajador_id;
    
    v_anio := EXTRACT(YEAR FROM p_fecha_inicio);
    
    -- Insertar nuevo perÃ­odo
    INSERT INTO periodos_vacacionales (
        empleado_id, anio_generacion, fecha_inicio_periodo, 
        fecha_fin_periodo, dias_totales, dias_disponibles
    ) VALUES (
        p_empleado_id, v_anio, p_fecha_inicio,
        p_fecha_inicio + INTERVAL '1 year' - INTERVAL '1 day',
        v_dias_anuales, v_dias_anuales
    ) RETURNING id INTO v_periodo_id;
    
    RETURN v_periodo_id;
END;
$$ LANGUAGE plpgsql;

-- 11. FUNCIÃ“N: Calcular dÃ­as calendario entre fechas (TODOS los dÃ­as cuentan)
-- SegÃºn regla: "Los feriados oficiales y dÃ­as de descanso deben contar como un dÃ­a normal 
-- y ser descontados del saldo (dÃ­as calendario)"
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
) RETURNS INT AS $$
BEGIN
    -- Contar todos los dÃ­as calendario entre las fechas (inclusive)
    RETURN (p_fecha_fin - p_fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;

-- 12. TRIGGER: Actualizar fecha de modificaciÃ³n
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_periodos_actualizacion
    BEFORE UPDATE ON periodos_vacacionales
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_solicitudes_actualizacion
    BEFORE UPDATE ON solicitudes_vacaciones
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- 13. VISTA: Resumen de vacaciones por empleado
CREATE OR REPLACE VIEW vista_resumen_vacaciones AS
SELECT 
    e.id as empleado_id,
    e.nombres || ' ' || e.apellidos as nombre_completo,
    e.puesto,
    tt.nombre as tipo_trabajador,
    tt.dias_vacaciones_anuales as dias_anuales_asignados,
    COALESCE(SUM(pv.dias_disponibles), 0) as dias_disponibles_total,
    COALESCE(SUM(pv.dias_usados), 0) as dias_usados_total,
    COUNT(DISTINCT pv.id) as periodos_activos,
    COUNT(DISTINCT CASE WHEN sv.estado = 'pendiente' THEN sv.id END) as solicitudes_pendientes,
    COUNT(DISTINCT CASE WHEN sv.estado = 'aprobada' THEN sv.id END) as solicitudes_aprobadas
FROM empleados e
LEFT JOIN tipos_trabajador tt ON e.tipo_trabajador_id = tt.id
LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id AND pv.estado = 'activo'
LEFT JOIN solicitudes_vacaciones sv ON e.id = sv.empleado_id
WHERE e.activo = true
GROUP BY e.id, e.nombres, e.apellidos, e.puesto, tt.nombre, tt.dias_vacaciones_anuales;

-- 14. COMENTARIOS en las tablas
COMMENT ON TABLE periodos_vacacionales IS 'Almacena los perÃ­odos vacacionales generados por aÃ±o para cada empleado';
COMMENT ON TABLE solicitudes_vacaciones IS 'Registro de todas las solicitudes de vacaciones con su estado y validaciones';
COMMENT ON TABLE detalle_dias_vacaciones IS 'Detalle dÃ­a por dÃ­a de cada solicitud con clasificaciÃ³n de tipo de dÃ­a';
COMMENT ON TABLE historial_aprobaciones IS 'HistÃ³rico completo del flujo de aprobaciÃ³n de cada solicitud';
COMMENT ON TABLE notificaciones_vacaciones IS 'Sistema de notificaciones in-app y email para eventos de vacaciones';
COMMENT ON TABLE alertas_validaciones IS 'Registro de alertas y validaciones aplicadas a las solicitudes';

-- Fin del script
-- Script de correcciÃ³n rÃ¡pida para el sistema de vacaciones
-- Ejecutar este script en la base de datos de Render

-- 1. Verificar y crear tabla tipos_trabajador
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tipos_trabajador') THEN
        CREATE TABLE tipos_trabajador (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            descripcion TEXT,
            dias_vacaciones_anuales INTEGER NOT NULL,
            activo BOOLEAN DEFAULT true,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        INSERT INTO tipos_trabajador (nombre, descripcion, dias_vacaciones_anuales) VALUES
        ('Tiempo Completo', 'Empleados a tiempo completo', 30),
        ('Part Time', 'Empleados a tiempo parcial', 7),
        ('Practicante', 'Practicantes y pasantes', 15);
        
        RAISE NOTICE 'Tabla tipos_trabajador creada';
    END IF;
END $$;

-- 2. Agregar columna tipo_trabajador_id a empleados (solo si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'empleados' AND column_name = 'tipo_trabajador_id'
    ) THEN
        ALTER TABLE empleados 
        ADD COLUMN tipo_trabajador_id INTEGER REFERENCES tipos_trabajador(id) DEFAULT 1;
        
        RAISE NOTICE 'Columna tipo_trabajador_id agregada';
    END IF;
END $$;

-- 3. Crear tabla periodos_vacacionales
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'periodos_vacacionales') THEN
        CREATE TABLE periodos_vacacionales (
            id SERIAL PRIMARY KEY,
            empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
            anio_generacion INTEGER NOT NULL,
            fecha_generacion DATE NOT NULL,
            dias_totales INTEGER NOT NULL,
            dias_disponibles INTEGER NOT NULL,
            dias_usados INTEGER DEFAULT 0,
            viernes_usados INTEGER DEFAULT 0,
            estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'consumido', 'expirado')),
            fecha_expiracion DATE,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(empleado_id, anio_generacion)
        );
        
        CREATE INDEX idx_periodos_empleado ON periodos_vacacionales(empleado_id);
        CREATE INDEX idx_periodos_estado ON periodos_vacacionales(estado);
        CREATE INDEX idx_periodos_anio ON periodos_vacacionales(anio_generacion);
        
        RAISE NOTICE 'Tabla periodos_vacacionales creada';
    END IF;
END $$;

-- 4. Crear tabla feriados
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'feriados') THEN
        CREATE TABLE feriados (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            fecha DATE NOT NULL,
            anio INTEGER NOT NULL,
            tipo VARCHAR(50) DEFAULT 'nacional',
            descripcion TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(fecha, nombre)
        );
        
        CREATE INDEX idx_feriados_fecha ON feriados(fecha);
        CREATE INDEX idx_feriados_anio ON feriados(anio);
        
        RAISE NOTICE 'Tabla feriados creada';
    END IF;
END $$;

-- 5. Insertar feriados 2025 de PerÃº (solo si no existen)
INSERT INTO feriados (nombre, fecha, anio, tipo, descripcion) VALUES
('AÃ±o Nuevo', '2025-01-01', 2025, 'nacional', 'Inicio del aÃ±o calendario'),
('Jueves Santo', '2025-04-17', 2025, 'nacional', 'Semana Santa'),
('Viernes Santo', '2025-04-18', 2025, 'nacional', 'Semana Santa'),
('DÃ­a del Trabajo', '2025-05-01', 2025, 'nacional', 'DÃ­a Internacional del Trabajador'),
('San Pedro y San Pablo', '2025-06-29', 2025, 'nacional', 'Festividad religiosa'),
('Fiestas Patrias - DÃ­a 1', '2025-07-28', 2025, 'nacional', 'DÃ­a de la Independencia del PerÃº'),
('Fiestas Patrias - DÃ­a 2', '2025-07-29', 2025, 'nacional', 'ContinuaciÃ³n Fiestas Patrias'),
('Santa Rosa de Lima', '2025-08-30', 2025, 'nacional', 'Patrona de la PolicÃ­a Nacional'),
('Combate de Angamos', '2025-10-08', 2025, 'nacional', 'DÃ­a conmemorativo'),
('Todos los Santos', '2025-11-01', 2025, 'nacional', 'Festividad religiosa'),
('Inmaculada ConcepciÃ³n', '2025-12-08', 2025, 'nacional', 'Festividad religiosa'),
('Batalla de Ayacucho', '2025-12-09', 2025, 'nacional', 'DÃ­a conmemorativo'),
('Navidad', '2025-12-25', 2025, 'nacional', 'CelebraciÃ³n del nacimiento de JesÃºs')
ON CONFLICT (fecha, nombre) DO NOTHING;

-- 6. Crear vista de resumen (simplificada)
CREATE OR REPLACE VIEW vista_resumen_vacaciones AS
SELECT 
    e.id as empleado_id,
    e.nombres || ' ' || e.apellidos as nombre_completo,
    COALESCE(SUM(pv.dias_disponibles), 0) as dias_disponibles,
    COALESCE(SUM(pv.dias_usados), 0) as dias_usados,
    COALESCE(SUM(pv.dias_totales), 0) as total_generado,
    0 as dias_pendientes -- Por ahora sin tabla de solicitudes
FROM empleados e
LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id AND pv.estado = 'activo'
GROUP BY e.id, e.nombres, e.apellidos;

-- 7. FunciÃ³n auxiliar para calcular dÃ­as calendario
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    fecha_inicio DATE,
    fecha_fin DATE
) RETURNS INTEGER AS $$
BEGIN
    RETURN (fecha_fin - fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear un perÃ­odo de ejemplo para el usuario actual (ajusta el ID segÃºn necesites)
-- Este es un ejemplo, puedes comentarlo si no quieres datos de prueba
DO $$
DECLARE
    v_empleado_id INTEGER;
BEGIN
    -- Obtener el primer empleado disponible (sin filtro de activo)
    SELECT id INTO v_empleado_id FROM empleados ORDER BY id LIMIT 1;
    
    IF v_empleado_id IS NOT NULL THEN
        -- Crear perÃ­odo 2025 si no existe
        INSERT INTO periodos_vacacionales (
            empleado_id, 
            anio_generacion, 
            fecha_generacion, 
            dias_totales, 
            dias_disponibles
        )
        VALUES (
            v_empleado_id,
            2025,
            CURRENT_DATE,
            30,
            30
        )
        ON CONFLICT (empleado_id, anio_generacion) DO NOTHING;
        
        RAISE NOTICE 'PerÃ­odo de prueba creado para empleado %', v_empleado_id;
    END IF;
END $$;

-- VerificaciÃ³n final
DO $$
BEGIN
    RAISE NOTICE 'âœ… Script ejecutado correctamente';
    RAISE NOTICE 'Tablas creadas: tipos_trabajador, periodos_vacacionales, feriados';
    RAISE NOTICE 'Vista creada: vista_resumen_vacaciones';
    RAISE NOTICE 'Feriados 2025: % registros', (SELECT COUNT(*) FROM feriados WHERE anio = 2025);
END $$;
-- Crear tablas faltantes del sistema de vacaciones

-- 1. Tabla de aprobaciones (para workflow de aprobaciÃ³n)
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

-- 2. Tabla de historial de saldos (auditorÃ­a)
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

-- 3. VerificaciÃ³n final
DO $$
BEGIN
    RAISE NOTICE 'âœ… Tablas adicionales creadas correctamente';
    RAISE NOTICE '   - aprobaciones_vacaciones';
    RAISE NOTICE '   - historial_saldos';
END $$;
-- MigraciÃ³n: Agregar columna es_rrhh a tabla empleados
-- Fecha: 2025-11-26
-- DescripciÃ³n: Permite identificar empleados que pertenecen a RRHH y pueden ver todas las solicitudes

-- Agregar columna es_rrhh
ALTER TABLE empleados 
ADD COLUMN IF NOT EXISTS es_rrhh BOOLEAN DEFAULT FALSE;

-- Agregar comentario a la columna
COMMENT ON COLUMN empleados.es_rrhh IS 'Indica si el empleado pertenece al departamento de RRHH y puede ver todas las solicitudes';

-- Crear Ã­ndice para mejorar bÃºsquedas
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

-- Log de migraciÃ³n
DO $$
BEGIN
    RAISE NOTICE 'MigraciÃ³n 08_agregar_es_rrhh completada exitosamente';
END $$;
-- MigraciÃ³n: Agregar columnas de auditorÃ­a a solicitudes_vacaciones si no existen

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

-- Crear trigger para actualizar fecha_actualizacion automÃ¡ticamente
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

-- Crear Ã­ndice en fecha_creacion para mejorar performance en ordenamientos
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha_creacion 
ON solicitudes_vacaciones(fecha_creacion DESC);

SELECT 'MigraciÃ³n 09: Columnas de auditorÃ­a agregadas exitosamente' as mensaje;
