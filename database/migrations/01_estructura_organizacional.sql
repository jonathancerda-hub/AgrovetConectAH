-- ============================================
-- AGROVET CONECTA - CREACIÓN DE TABLAS
-- Paso 1: Estructura Organizacional
-- ============================================

-- EMPRESAS
CREATE TABLE IF NOT EXISTS empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DIVISIONES
CREATE TABLE IF NOT EXISTS divisiones (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AREAS
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    division_id INTEGER REFERENCES divisiones(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    centro_costos VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_divisiones_empresa ON divisiones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_areas_division ON areas(division_id);

COMMENT ON TABLE empresas IS 'Empresas del grupo corporativo';
COMMENT ON TABLE divisiones IS 'Divisiones organizacionales por empresa';
COMMENT ON TABLE areas IS 'Áreas funcionales dentro de cada división';
