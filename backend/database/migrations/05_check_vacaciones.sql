-- Script de verificación y creación mínima para testing

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
        ALTER TABLE empleados ADD COLUMN dias_descanso VARCHAR(50) DEFAULT 'Sábado,Domingo';
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
        
        -- Insertar feriados 2025 de Perú
        INSERT INTO feriados (nombre, fecha, anio, tipo) VALUES
        ('Año Nuevo', '2025-01-01', 2025, 'nacional'),
        ('Jueves Santo', '2025-04-17', 2025, 'nacional'),
        ('Viernes Santo', '2025-04-18', 2025, 'nacional'),
        ('Día del Trabajo', '2025-05-01', 2025, 'nacional'),
        ('San Pedro y San Pablo', '2025-06-29', 2025, 'nacional'),
        ('Fiestas Patrias', '2025-07-28', 2025, 'nacional'),
        ('Fiestas Patrias', '2025-07-29', 2025, 'nacional'),
        ('Santa Rosa de Lima', '2025-08-30', 2025, 'nacional'),
        ('Combate de Angamos', '2025-10-08', 2025, 'nacional'),
        ('Todos los Santos', '2025-11-01', 2025, 'nacional'),
        ('Inmaculada Concepción', '2025-12-08', 2025, 'nacional'),
        ('Navidad', '2025-12-25', 2025, 'nacional');
        
        RAISE NOTICE 'Tabla feriados creada con datos 2025';
    END IF;

END $$;

-- Crear una función simple para calcular días calendario
CREATE OR REPLACE FUNCTION calcular_dias_calendario(
    fecha_inicio DATE,
    fecha_fin DATE
) RETURNS INTEGER AS $$
BEGIN
    RETURN (fecha_fin - fecha_inicio) + 1;
END;
$$ LANGUAGE plpgsql;
