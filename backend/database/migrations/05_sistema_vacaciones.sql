-- =====================================================
-- SISTEMA DE GESTIÓN DE VACACIONES - ESTRUCTURA COMPLETA
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

-- 3. TABLA: Períodos Vacacionales
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

-- Índices para periodos vacacionales
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

-- Índices para solicitudes
CREATE INDEX IF NOT EXISTS idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_vacaciones(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fechas ON solicitudes_vacaciones(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_solicitudes_periodo ON solicitudes_vacaciones(periodo_id);

-- 5. TABLA: Detalle de Días Solicitados
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

-- 9. TABLA: Feriados (para cálculos)
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
('2025-04-19', 'Sábado de Gloria', 'nacional', 2025),
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

CREATE INDEX IF NOT EXISTS idx_feriados_fecha ON feriados(fecha);
CREATE INDEX IF NOT EXISTS idx_feriados_anio ON feriados(anio);

-- 10. FUNCIÓN: Generar período vacacional automáticamente
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
    -- Obtener tipo de trabajador y días correspondientes
    SELECT tipo_trabajador_id INTO v_tipo_trabajador_id
    FROM empleados WHERE id = p_empleado_id;
    
    SELECT dias_vacaciones_anuales INTO v_dias_anuales
    FROM tipos_trabajador WHERE id = v_tipo_trabajador_id;
    
    v_anio := EXTRACT(YEAR FROM p_fecha_inicio);
    
    -- Insertar nuevo período
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

-- 11. FUNCIÓN: Calcular días calendario entre fechas (TODOS los días cuentan)
-- Según regla: "Los feriados oficiales y días de descanso deben contar como un día normal 
-- y ser descontados del saldo (días calendario)"
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
) RETURNS INT AS $$
BEGIN
    -- Contar todos los días calendario entre las fechas (inclusive)
    RETURN (p_fecha_fin - p_fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;

-- 12. TRIGGER: Actualizar fecha de modificación
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
COMMENT ON TABLE periodos_vacacionales IS 'Almacena los períodos vacacionales generados por año para cada empleado';
COMMENT ON TABLE solicitudes_vacaciones IS 'Registro de todas las solicitudes de vacaciones con su estado y validaciones';
COMMENT ON TABLE detalle_dias_vacaciones IS 'Detalle día por día de cada solicitud con clasificación de tipo de día';
COMMENT ON TABLE historial_aprobaciones IS 'Histórico completo del flujo de aprobación de cada solicitud';
COMMENT ON TABLE notificaciones_vacaciones IS 'Sistema de notificaciones in-app y email para eventos de vacaciones';
COMMENT ON TABLE alertas_validaciones IS 'Registro de alertas y validaciones aplicadas a las solicitudes';

-- Fin del script
