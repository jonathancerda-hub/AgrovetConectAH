-- ============================================
-- AGROVET CONECTA - CREACIÓN DE TABLAS
-- Paso 2: Usuarios y Empleados
-- ============================================

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'rrhh', 'jefe', 'empleado')),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PUESTOS
CREATE TABLE IF NOT EXISTS puestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    nivel_jerarquia INTEGER CHECK (nivel_jerarquia BETWEEN 1 AND 10),
    descripcion TEXT,
    salario_base DECIMAL(10, 2),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EMPLEADOS
CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    puesto_id INTEGER REFERENCES puestos(id) ON DELETE SET NULL,
    supervisor_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL,
    area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    direccion TEXT,
    tipo_contrato VARCHAR(50) CHECK (tipo_contrato IN ('Indefinido', 'Plazo Fijo', 'Prácticas')),
    fecha_ingreso DATE NOT NULL,
    fecha_cese DATE,
    dias_vacaciones INTEGER DEFAULT 30,
    suplente_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL,
    foto_perfil TEXT,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Vacaciones', 'Inactivo', 'Cesado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_empleados_dni ON empleados(dni);
CREATE INDEX IF NOT EXISTS idx_empleados_supervisor ON empleados(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_empleados_area ON empleados(area_id);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);

COMMENT ON TABLE usuarios IS 'Credenciales de acceso al sistema';
COMMENT ON TABLE puestos IS 'Catálogo de puestos de trabajo';
COMMENT ON TABLE empleados IS 'Información personal y laboral de empleados';
