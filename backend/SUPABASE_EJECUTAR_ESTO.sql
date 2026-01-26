-- =====================================================
-- SCRIPT COMPLETO PARA SUPABASE
-- EJECUTAR TODO ESTE ARCHIVO EN SUPABASE SQL EDITOR
-- =====================================================

-- PASO 0: CREAR FUNCIONES RPC PRIMERO
DROP FUNCTION IF EXISTS execute_sql(text);
DROP FUNCTION IF EXISTS execute_sql_write(text);

CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  is_select boolean;
  is_returning boolean;
BEGIN
  -- Detectar si es SELECT o tiene RETURNING
  is_select := sql ~* '^\s*SELECT';
  is_returning := sql ~* 'RETURNING';
  
  IF is_select THEN
    -- Es un SELECT directo
    EXECUTE format('SELECT json_agg(t) FROM (%s) t', sql) INTO result;
  ELSIF is_returning THEN
    -- Es INSERT/UPDATE/DELETE con RETURNING
    EXECUTE format('WITH result AS (%s) SELECT json_agg(result) FROM result', sql) INTO result;
  ELSE
    -- No debería llegar aquí
    RAISE EXCEPTION 'execute_sql solo acepta SELECT o comandos con RETURNING';
  END IF;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

CREATE OR REPLACE FUNCTION execute_sql_write(sql text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows integer;
BEGIN
  EXECUTE sql;
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$;

-- PASO 1: ELIMINAR TODO (si existe)
DROP TABLE IF EXISTS detalle_dias_vacaciones CASCADE;
DROP TABLE IF EXISTS historial_aprobaciones CASCADE;
DROP TABLE IF EXISTS notificaciones_vacaciones CASCADE;
DROP TABLE IF EXISTS alertas_validaciones CASCADE;
DROP TABLE IF EXISTS solicitudes_vacaciones CASCADE;
DROP TABLE IF EXISTS periodos_vacacionales CASCADE;
DROP TABLE IF EXISTS feriados CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS empleados CASCADE;
DROP TABLE IF EXISTS puestos CASCADE;
DROP TABLE IF EXISTS areas CASCADE;
DROP TABLE IF EXISTS tipos_trabajador CASCADE;

-- PASO 2: CREAR TABLAS

-- 1. Tipos de Trabajador
CREATE TABLE tipos_trabajador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    dias_vacaciones_anuales INT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Áreas
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Puestos
CREATE TABLE puestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    area_id INT REFERENCES areas(id),
    descripcion TEXT,
    nivel_jerarquico INT DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Empleados
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    codigo_empleado VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_ingreso DATE NOT NULL,
    puesto_id INT REFERENCES puestos(id),
    area_id INT REFERENCES areas(id),
    supervisor_id INT REFERENCES empleados(id),
    tipo_trabajador_id INT REFERENCES tipos_trabajador(id),
    es_supervisor BOOLEAN DEFAULT false,
    es_rrhh BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    empleado_id INT UNIQUE REFERENCES empleados(id) ON DELETE CASCADE,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'empleado' CHECK (rol IN ('empleado', 'supervisor', 'coordinador', 'rrhh', 'admin')),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Períodos Vacacionales
CREATE TABLE periodos_vacacionales (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    anio_generacion INT NOT NULL,
    fecha_inicio_periodo DATE NOT NULL,
    fecha_fin_periodo DATE NOT NULL,
    dias_totales INT NOT NULL,
    dias_disponibles INT NOT NULL,
    dias_usados INT DEFAULT 0,
    viernes_usados INT DEFAULT 0,
    fines_semana_usados INT DEFAULT 0,
    tiene_bloque_7dias BOOLEAN DEFAULT false,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'vencido', 'consumido')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empleado_id, anio_generacion)
);

-- 7. Solicitudes de Vacaciones
CREATE TABLE solicitudes_vacaciones (
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
    tipo_solicitud VARCHAR(20) DEFAULT 'normal',
    es_bloque_continuo BOOLEAN DEFAULT false,
    aprobador_id INT REFERENCES empleados(id),
    fecha_aprobacion TIMESTAMP,
    observaciones_aprobador TEXT,
    aprobacion_automatica BOOLEAN DEFAULT false,
    mes_solicitud INT NOT NULL,
    anio_solicitud INT NOT NULL,
    fecha_corte_cumplida BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT REFERENCES empleados(id),
    CONSTRAINT chk_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT chk_dias_positivos CHECK (dias_solicitados > 0)
);

-- 8. Feriados
CREATE TABLE feriados (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'nacional',
    pais VARCHAR(3) DEFAULT 'PE',
    anio INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Historial de Aprobaciones
CREATE TABLE historial_aprobaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT NOT NULL REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    aprobador_id INT NOT NULL REFERENCES empleados(id),
    nivel_aprobacion INT DEFAULT 1,
    accion VARCHAR(20) NOT NULL,
    comentarios TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
);

-- 10. Notificaciones
CREATE TABLE notificaciones_vacaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    destinatario_id INT NOT NULL REFERENCES empleados(id),
    tipo_notificacion VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    fecha_lectura TIMESTAMP,
    enviado_email BOOLEAN DEFAULT false,
    fecha_envio_email TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Alertas
CREATE TABLE alertas_validaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT REFERENCES solicitudes_vacaciones(id) ON DELETE CASCADE,
    tipo_alerta VARCHAR(50) NOT NULL,
    nivel VARCHAR(20) DEFAULT 'warning',
    mensaje TEXT NOT NULL,
    regla_violada VARCHAR(100),
    requiere_aprobacion_especial BOOLEAN DEFAULT false,
    resuelta BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Detalle de Días
CREATE TABLE detalle_dias_vacaciones (
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

-- PASO 3: CREAR ÍNDICES
CREATE INDEX idx_empleados_email ON empleados(email);
CREATE INDEX idx_empleados_supervisor ON empleados(supervisor_id);
CREATE INDEX idx_usuarios_empleado ON usuarios(empleado_id);
CREATE INDEX idx_periodos_empleado ON periodos_vacacionales(empleado_id);
CREATE INDEX idx_periodos_estado ON periodos_vacacionales(estado);
CREATE INDEX idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes_vacaciones(estado);
CREATE INDEX idx_solicitudes_periodo ON solicitudes_vacaciones(periodo_id);

-- PASO 4: CREAR FUNCIONES RPC

-- Eliminar funciones existentes primero
DROP FUNCTION IF EXISTS execute_sql(text);
DROP FUNCTION IF EXISTS execute_sql_write(text);

-- Función para ejecutar SQL de lectura (parámetro debe llamarse "sql")
CREATE FUNCTION execute_sql(sql TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSON;
BEGIN
    EXECUTE format('SELECT json_agg(t) FROM (%s) t', sql) INTO result_data;
    RETURN COALESCE(result_data, '[]'::json);
END;
$$;

-- Función para ejecutar SQL de escritura (parámetro debe llamarse "sql")
CREATE FUNCTION execute_sql_write(sql TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_data JSON;
    affected_rows INT;
BEGIN
    EXECUTE sql;
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    result_data := json_build_object(
        'success', true,
        'rowCount', affected_rows,
        'message', 'Query executed successfully'
    );
    
    RETURN result_data;
EXCEPTION WHEN OTHERS THEN
    result_data := json_build_object(
        'success', false,
        'error', SQLERRM,
        'detail', SQLSTATE
    );
    RETURN result_data;
END;
$$;

-- PASO 5: INSERTAR DATOS SEED

-- 1. Tipos de Trabajador
INSERT INTO tipos_trabajador (nombre, descripcion, dias_vacaciones_anuales, activo) VALUES
('Plazo Indeterminado', 'Contrato a plazo indeterminado', 30, true),
('Plazo Fijo', 'Contrato a plazo fijo', 30, true),
('Temporal', 'Contrato temporal o por obra', 15, true),
('Prácticas', 'Contrato de prácticas profesionales', 7, true);

-- 2. Áreas
INSERT INTO areas (nombre, descripcion, activo) VALUES
('Tecnología', 'Área de desarrollo y sistemas', true),
('Recursos Humanos', 'Gestión del talento humano', true),
('Operaciones', 'Operaciones y logística', true),
('Administración', 'Administración general', true);

-- 3. Puestos
INSERT INTO puestos (nombre, area_id, nivel_jerarquico, activo) VALUES
('Coordinador TI', (SELECT id FROM areas WHERE nombre = 'Tecnología'), 3, true),
('Desarrollador Senior', (SELECT id FROM areas WHERE nombre = 'Tecnología'), 2, true),
('Desarrollador Junior', (SELECT id FROM areas WHERE nombre = 'Tecnología'), 1, true),
('Analista RRHH', (SELECT id FROM areas WHERE nombre = 'Recursos Humanos'), 2, true),
('Jefe RRHH', (SELECT id FROM areas WHERE nombre = 'Recursos Humanos'), 3, true),
('Operador', (SELECT id FROM areas WHERE nombre = 'Operaciones'), 1, true),
('Supervisor Operaciones', (SELECT id FROM areas WHERE nombre = 'Operaciones'), 3, true),
('Asistente Administrativo', (SELECT id FROM areas WHERE nombre = 'Administración'), 1, true);

-- 4. Empleados
INSERT INTO empleados (codigo_empleado, nombres, apellidos, email, fecha_nacimiento, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo) VALUES
('EMP001', 'María', 'López Silva', 'maria.lopez@agrovet.com', '1985-03-15', '2015-01-10', 
 (SELECT id FROM puestos WHERE nombre = 'Jefe RRHH'), 
 (SELECT id FROM areas WHERE nombre = 'Recursos Humanos'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), false, true, true),

('EMP002', 'Carlos', 'Martínez Ramos', 'carlos.martinez@agrovet.com', '1990-07-22', '2018-03-15',
 (SELECT id FROM puestos WHERE nombre = 'Desarrollador Senior'),
 (SELECT id FROM areas WHERE nombre = 'Tecnología'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), false, false, true),

('EMP003', 'Úrsula', 'Huamancaja Torres', 'ursula.huamancaja@agrovet.com', '1988-11-30', '2016-06-01',
 (SELECT id FROM puestos WHERE nombre = 'Analista RRHH'),
 (SELECT id FROM areas WHERE nombre = 'Recursos Humanos'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), false, true, true),

('EMP004', 'Jorge Luis Jonathan', 'Cerda Piaca', 'jonathan.cerda@agrovet.com', '1992-05-18', '2010-02-01',
 (SELECT id FROM puestos WHERE nombre = 'Coordinador TI'),
 (SELECT id FROM areas WHERE nombre = 'Tecnología'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true, false, true),

('EMP005', 'Ana', 'García Pérez', 'ana.garcia@agrovet.com', '1995-09-10', '2020-08-15',
 (SELECT id FROM puestos WHERE nombre = 'Desarrollador Junior'),
 (SELECT id FROM areas WHERE nombre = 'Tecnología'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Fijo'), false, false, true),

('EMP006', 'Luis', 'Rodríguez Castro', 'luis.rodriguez@agrovet.com', '1987-12-05', '2017-04-20',
 (SELECT id FROM puestos WHERE nombre = 'Supervisor Operaciones'),
 (SELECT id FROM areas WHERE nombre = 'Operaciones'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true, false, true),

('EMP007', 'Patricia', 'Fernández Quispe', 'patricia.fernandez@agrovet.com', '1993-02-28', '2019-10-10',
 (SELECT id FROM puestos WHERE nombre = 'Operador'),
 (SELECT id FROM areas WHERE nombre = 'Operaciones'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Fijo'), false, false, true),

('EMP008', 'Roberto', 'Sánchez Vega', 'roberto.sanchez@agrovet.com', '1991-06-14', '2018-11-25',
 (SELECT id FROM puestos WHERE nombre = 'Asistente Administrativo'),
 (SELECT id FROM areas WHERE nombre = 'Administración'),
 (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), false, false, true);

-- 5. Actualizar supervisores
UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE codigo_empleado = 'EMP004') 
WHERE codigo_empleado IN ('EMP002', 'EMP005');

UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE codigo_empleado = 'EMP006') 
WHERE codigo_empleado = 'EMP007';

-- 6. Usuarios (passwords hasheados con bcrypt - contraseña: "coord123", "emp123", "rrhh123")
INSERT INTO usuarios (empleado_id, email, password, rol, activo) VALUES
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP001'), 'maria.lopez@agrovet.com', 
 '$2b$10$qLz4Xr5Q8V9K3N7mP2oLOeYjK4mW8nR5tL6zX1cY9vH2sD4fG6hJK', 'rrhh', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP002'), 'carlos.martinez@agrovet.com',
 '$2b$10$qLz4Xr5Q8V9K3N7mP2oLOeYjK4mW8nR5tL6zX1cY9vH2sD4fG6hJK', 'empleado', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP003'), 'ursula.huamancaja@agrovet.com',
 '$2b$10$uN8vR3tY6mL2kP9jX5qW7OzH4sF1dG8cV2nM6bT9yE3wQ7rA5xC1B', 'rrhh', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP004'), 'jonathan.cerda@agrovet.com',
 '$2b$10$dR2mK7oP3nL6jH4sT8vY1OqF5uG9wZ3xC6bN2yE4rA8vM1kJ7tD0S', 'coordinador', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP005'), 'ana.garcia@agrovet.com',
 '$2b$10$qLz4Xr5Q8V9K3N7mP2oLOeYjK4mW8nR5tL6zX1cY9vH2sD4fG6hJK', 'empleado', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP006'), 'luis.rodriguez@agrovet.com',
 '$2b$10$dR2mK7oP3nL6jH4sT8vY1OqF5uG9wZ3xC6bN2yE4rA8vM1kJ7tD0S', 'supervisor', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP007'), 'patricia.fernandez@agrovet.com',
 '$2b$10$qLz4Xr5Q8V9K3N7mP2oLOeYjK4mW8nR5tL6zX1cY9vH2sD4fG6hJK', 'empleado', true),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP008'), 'roberto.sanchez@agrovet.com',
 '$2b$10$qLz4Xr5Q8V9K3N7mP2oLOeYjK4mW8nR5tL6zX1cY9vH2sD4fG6hJK', 'empleado', true);

-- 7. Períodos Vacacionales (IMPORTANTE: Esto es lo que falta)
INSERT INTO periodos_vacacionales (empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo, dias_totales, dias_disponibles, dias_usados, estado) VALUES
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP004'), 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP005'), 2025, '2025-01-01', '2025-12-31', 30, 25, 5, 'activo'),
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP002'), 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP006'), 2025, '2025-01-01', '2025-12-31', 30, 22, 8, 'activo'),
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP007'), 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo');

-- 8. Feriados 2025 Perú
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
('2025-11-01', 'Todos los Santos', 'nacional', 2025),
('2025-12-08', 'Inmaculada Concepción', 'nacional', 2025),
('2025-12-25', 'Navidad', 'nacional', 2025);

-- 9. Solicitudes de Prueba
INSERT INTO solicitudes_vacaciones (empleado_id, periodo_id, fecha_inicio, fecha_fin, dias_solicitados, dias_calendario, motivo, estado, mes_solicitud, anio_solicitud, fecha_creacion) VALUES
((SELECT id FROM empleados WHERE codigo_empleado = 'EMP005'),
 (SELECT id FROM periodos_vacacionales WHERE empleado_id = (SELECT id FROM empleados WHERE codigo_empleado = 'EMP005') AND anio_generacion = 2025),
 '2025-12-15', '2025-12-19', 5, 5, 'Vacaciones de fin de año', 'pendiente', 12, 2025, CURRENT_TIMESTAMP),

((SELECT id FROM empleados WHERE codigo_empleado = 'EMP002'),
 (SELECT id FROM periodos_vacacionales WHERE empleado_id = (SELECT id FROM empleados WHERE codigo_empleado = 'EMP002') AND anio_generacion = 2025),
 '2025-12-01', '2025-12-05', 5, 5, 'Asuntos personales', 'pendiente', 12, 2025, CURRENT_TIMESTAMP);

-- PASO 6: VERIFICAR INSTALACIÓN
SELECT 
    'tipos_trabajador' as tabla, COUNT(*) as registros FROM tipos_trabajador
UNION ALL SELECT 'areas', COUNT(*) FROM areas
UNION ALL SELECT 'puestos', COUNT(*) FROM puestos
UNION ALL SELECT 'empleados', COUNT(*) FROM empleados
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL SELECT 'periodos_vacacionales', COUNT(*) FROM periodos_vacacionales
UNION ALL SELECT 'feriados', COUNT(*) FROM feriados
UNION ALL SELECT 'solicitudes_vacaciones', COUNT(*) FROM solicitudes_vacaciones;
