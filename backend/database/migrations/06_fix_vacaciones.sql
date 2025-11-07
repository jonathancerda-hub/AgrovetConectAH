-- Script de corrección rápida para el sistema de vacaciones
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

-- 5. Insertar feriados 2025 de Perú (solo si no existen)
INSERT INTO feriados (nombre, fecha, anio, tipo, descripcion) VALUES
('Año Nuevo', '2025-01-01', 2025, 'nacional', 'Inicio del año calendario'),
('Jueves Santo', '2025-04-17', 2025, 'nacional', 'Semana Santa'),
('Viernes Santo', '2025-04-18', 2025, 'nacional', 'Semana Santa'),
('Día del Trabajo', '2025-05-01', 2025, 'nacional', 'Día Internacional del Trabajador'),
('San Pedro y San Pablo', '2025-06-29', 2025, 'nacional', 'Festividad religiosa'),
('Fiestas Patrias - Día 1', '2025-07-28', 2025, 'nacional', 'Día de la Independencia del Perú'),
('Fiestas Patrias - Día 2', '2025-07-29', 2025, 'nacional', 'Continuación Fiestas Patrias'),
('Santa Rosa de Lima', '2025-08-30', 2025, 'nacional', 'Patrona de la Policía Nacional'),
('Combate de Angamos', '2025-10-08', 2025, 'nacional', 'Día conmemorativo'),
('Todos los Santos', '2025-11-01', 2025, 'nacional', 'Festividad religiosa'),
('Inmaculada Concepción', '2025-12-08', 2025, 'nacional', 'Festividad religiosa'),
('Batalla de Ayacucho', '2025-12-09', 2025, 'nacional', 'Día conmemorativo'),
('Navidad', '2025-12-25', 2025, 'nacional', 'Celebración del nacimiento de Jesús')
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

-- 7. Función auxiliar para calcular días calendario
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    fecha_inicio DATE,
    fecha_fin DATE
) RETURNS INTEGER AS $$
BEGIN
    RETURN (fecha_fin - fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear un período de ejemplo para el usuario actual (ajusta el ID según necesites)
-- Este es un ejemplo, puedes comentarlo si no quieres datos de prueba
DO $$
DECLARE
    v_empleado_id INTEGER;
BEGIN
    -- Obtener el primer empleado disponible (sin filtro de activo)
    SELECT id INTO v_empleado_id FROM empleados ORDER BY id LIMIT 1;
    
    IF v_empleado_id IS NOT NULL THEN
        -- Crear período 2025 si no existe
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
        
        RAISE NOTICE 'Período de prueba creado para empleado %', v_empleado_id;
    END IF;
END $$;

-- Verificación final
DO $$
BEGIN
    RAISE NOTICE '✅ Script ejecutado correctamente';
    RAISE NOTICE 'Tablas creadas: tipos_trabajador, periodos_vacacionales, feriados';
    RAISE NOTICE 'Vista creada: vista_resumen_vacaciones';
    RAISE NOTICE 'Feriados 2025: % registros', (SELECT COUNT(*) FROM feriados WHERE anio = 2025);
END $$;
