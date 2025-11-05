-- ============================================
-- AGROVET CONECTA - CREACIÓN DE TABLAS
-- Paso 4: Publicaciones y Social
-- ============================================

-- PUBLICACIONES (BOLETINES)
CREATE TABLE IF NOT EXISTS publicaciones (
    id SERIAL PRIMARY KEY,
    autor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(500) NOT NULL,
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    tipo VARCHAR(50) DEFAULT 'Noticia' CHECK (tipo IN ('Noticia', 'Comunicado', 'Evento')),
    prioridad VARCHAR(20) DEFAULT 'Media' CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMENTARIOS EN PUBLICACIONES
CREATE TABLE IF NOT EXISTS comentarios_publicaciones (
    id SERIAL PRIMARY KEY,
    publicacion_id INTEGER NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REACCIONES EN PUBLICACIONES
CREATE TABLE IF NOT EXISTS reacciones_publicaciones (
    id SERIAL PRIMARY KEY,
    publicacion_id INTEGER NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_reaccion VARCHAR(20) DEFAULT 'like' CHECK (tipo_reaccion IN ('like', 'love', 'celebrate')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(publicacion_id, usuario_id)
);

-- Índices para publicaciones
CREATE INDEX IF NOT EXISTS idx_publicaciones_visible ON publicaciones(visible, fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_publicaciones_autor ON publicaciones(autor_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_publicacion ON comentarios_publicaciones(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_reacciones_publicacion ON reacciones_publicaciones(publicacion_id);

COMMENT ON TABLE publicaciones IS 'Publicaciones del portal interno (boletines, noticias, comunicados)';
COMMENT ON TABLE comentarios_publicaciones IS 'Comentarios de usuarios en publicaciones';
COMMENT ON TABLE reacciones_publicaciones IS 'Reacciones (Me gusta, etc.) en publicaciones';
