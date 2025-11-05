-- ============================================
-- AGROVET CONECTA - DATOS INICIALES (SEEDS)
-- ============================================

-- Limpiar datos existentes (solo para desarrollo)
-- TRUNCATE TABLE auditoria, empleado_beneficios, beneficios, tareas_pendientes, 
-- calendario_eventos, boletas_pago, documentos_empleados, solicitudes_colaborador, 
-- notificaciones, reacciones_publicaciones, comentarios_publicaciones, publicaciones, 
-- solicitudes_vacaciones, empleados, puestos, usuarios, areas, divisiones, empresas 
-- RESTART IDENTITY CASCADE;

-- ============================================
-- ESTRUCTURA ORGANIZACIONAL
-- ============================================

-- Insertar empresa principal
INSERT INTO empresas (nombre, ruc, direccion, telefono) VALUES
('AGROVET MARKET S.A.', '20123456789', 'Av. Principal 123, Lima, Perú', '01-1234567')
ON CONFLICT DO NOTHING;

-- Insertar divisiones
INSERT INTO divisiones (empresa_id, nombre, descripcion) VALUES
(1, 'FINANZAS Y TI', 'División encargada de finanzas y tecnología de información'),
(1, 'RECURSOS HUMANOS', 'División de gestión de talento humano'),
(1, 'OPERACIONES', 'División de operaciones y logística')
ON CONFLICT DO NOTHING;

-- Insertar áreas
INSERT INTO areas (division_id, nombre, centro_costos, descripcion) VALUES
(1, 'TI (SISTEMAS)', 'GOL-GOL01', 'Área de sistemas y tecnología'),
(1, 'FINANZAS', 'GOL-FIN01', 'Área de contabilidad y finanzas'),
(2, 'TALENTO HUMANO Y SST', 'GOL-RH01', 'Gestión de personal y seguridad'),
(3, 'LOGÍSTICA', 'GOL-LOG01', 'Gestión de almacenes y distribución')
ON CONFLICT DO NOTHING;

-- ============================================
-- PUESTOS DE TRABAJO
-- ============================================

INSERT INTO puestos (nombre, area_id, nivel_jerarquia, salario_base, descripcion) VALUES
('Director General', 1, 1, 15000.00, 'Máxima autoridad de la empresa'),
('Gerente de TI', 1, 2, 10000.00, 'Responsable del área de tecnología'),
('Gerente de Talento Humano y SST', 3, 2, 9500.00, 'Responsable de RRHH'),
('Jefe de Desarrollo', 1, 4, 7000.00, 'Líder del equipo de desarrollo'),
('Coordinador de Proyectos de TI', 1, 6, 5000.00, 'Coordinación de proyectos tecnológicos'),
('Desarrollador Senior', 1, 7, 4500.00, 'Desarrollo de software'),
('Analista de RRHH', 3, 7, 4000.00, 'Análisis y gestión de personal'),
('Asistente Administrativo', 3, 8, 2500.00, 'Soporte administrativo'),
('Auxiliar de Logística', 4, 8, 2000.00, 'Apoyo en operaciones logísticas')
ON CONFLICT DO NOTHING;

-- ============================================
-- USUARIOS Y EMPLEADOS
-- ============================================

-- Usuario Administrador (password: admin123)
INSERT INTO usuarios (email, password_hash, rol) VALUES
('admin@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO empleados (usuario_id, puesto_id, area_id, dni, nombres, apellidos, tipo_contrato, fecha_ingreso, dias_vacaciones) VALUES
(1, 1, 1, '12345678', 'Carlos', 'Director', 'Indefinido', '2015-01-10', 30)
ON CONFLICT (dni) DO NOTHING;

-- Usuario RRHH (password: rrhh123)
INSERT INTO usuarios (email, password_hash, rol) VALUES
('ursula.huamancaja@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'rrhh')
ON CONFLICT (email) DO NOTHING;

INSERT INTO empleados (usuario_id, puesto_id, supervisor_id, area_id, dni, nombres, apellidos, tipo_contrato, fecha_ingreso, dias_vacaciones) VALUES
(2, 3, 1, 3, '23456789', 'Ursula', 'Huamancaja', 'Indefinido', '2016-03-15', 30)
ON CONFLICT (dni) DO NOTHING;

-- Usuario Jefe de TI (password: jefe123)
INSERT INTO usuarios (email, password_hash, rol) VALUES
('perci.mondragon@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'jefe')
ON CONFLICT (email) DO NOTHING;

INSERT INTO empleados (usuario_id, puesto_id, supervisor_id, area_id, dni, nombres, apellidos, tipo_contrato, fecha_ingreso, dias_vacaciones) VALUES
(3, 2, 1, 1, '34567890', 'Perci', 'Mondragon', 'Indefinido', '2018-06-20', 25)
ON CONFLICT (dni) DO NOTHING;

-- Usuario Coordinador (password: coord123)
INSERT INTO usuarios (email, password_hash, rol) VALUES
('jonathan.cerda@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'jefe')
ON CONFLICT (email) DO NOTHING;

INSERT INTO empleados (usuario_id, puesto_id, supervisor_id, area_id, dni, nombres, apellidos, tipo_contrato, fecha_ingreso, dias_vacaciones) VALUES
(4, 5, 3, 1, '45678901', 'Jorge Luis Jonathan', 'Cerda Piaca', 'Indefinido', '2010-11-23', 20)
ON CONFLICT (dni) DO NOTHING;

-- Empleados adicionales (password: emp123)
INSERT INTO usuarios (email, password_hash, rol) VALUES
('ana.garcia@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado'),
('carlos.martinez@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado'),
('laura.rodriguez@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado'),
('pedro.sanchez@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado')
ON CONFLICT (email) DO NOTHING;

INSERT INTO empleados (usuario_id, puesto_id, supervisor_id, area_id, dni, nombres, apellidos, tipo_contrato, fecha_ingreso, dias_vacaciones) VALUES
(5, 6, 4, 1, '56789012', 'Ana', 'García', 'Indefinido', '2022-01-15', 15),
(6, 6, 4, 1, '67890123', 'Carlos', 'Martínez', 'Plazo Fijo', '2021-11-20', 12),
(7, 7, 2, 3, '78901234', 'Laura', 'Rodríguez', 'Indefinido', '2022-03-10', 18),
(8, 8, 2, 3, '89012345', 'Pedro', 'Sánchez', 'Prácticas', '2023-05-01', 10)
ON CONFLICT (dni) DO NOTHING;

-- ============================================
-- PUBLICACIONES INICIALES
-- ============================================

INSERT INTO publicaciones (autor_id, titulo, contenido, tipo, prioridad, imagen_url) VALUES
(1, '¡Bienvenido a Agrovet Conecta!', 
'Nos complace presentar Agrovet Conecta, nuestro nuevo sistema de gestión de recursos humanos. Aquí podrás solicitar vacaciones, revisar tus boletas de pago, estar al tanto de comunicados importantes y mucho más. ¡Bienvenido a la transformación digital!', 
'Comunicado', 'Alta', NULL),

(2, '¡Estuvimos presentes en la carrera Perú Champs 10K! 🏃‍♂️🏃‍♀️',
'¡Estuvimos presentes en la carrera Perú Champs 10K! Felicitamos a nuestros corredores: Violeta Balbuena, José Montero, Steyci Lebano, Judith Atencio y Ana Gavidia, quienes representaron de gran forma a toda la empresa, corriendo formidablemente los 10 km de la carrera Perú Champs este último domingo. ¡Muy bien chicos, adelante!',
'Noticia', 'Media', 'https://i.imgur.com/0y8Ftya.png'),

(1, 'Beneficios Corporativos 2025',
'Nos complace anunciar los nuevos beneficios corporativos para el año 2025: seguro médico familiar, subsidio de educación para hijos, convenios con gimnasios, y días adicionales de vacaciones por antigüedad. Consulta con RRHH para más detalles.',
'Comunicado', 'Alta', NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- SOLICITUDES DE VACACIONES DE EJEMPLO
-- ============================================

INSERT INTO solicitudes_vacaciones (empleado_id, aprobador_id, fecha_inicio, fecha_fin, dias_solicitados, estado, comentarios) VALUES
(5, 4, '2025-12-22', '2025-12-26', 5, 'Pendiente', 'Vacaciones de fin de año'),
(6, 4, '2025-11-15', '2025-11-20', 5, 'Aprobado', 'Viaje familiar'),
(7, 2, '2025-10-10', '2025-10-15', 5, 'Aprobado', 'Descanso programado')
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTIFICACIONES INICIALES
-- ============================================

INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, url_referencia, leido) VALUES
(4, 'info', 'Nueva solicitud de vacaciones', 'Ana García ha solicitado vacaciones del 22-26 Dic', '/vacaciones/1', FALSE),
(5, 'success', 'Solicitud aprobada', 'Tu solicitud de vacaciones del 15-20 Nov ha sido aprobada', '/vacaciones/2', FALSE),
(1, 'info', 'Sistema actualizado', 'Agrovet Conecta ha sido actualizado con nuevas funcionalidades', '/portal', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- BENEFICIOS CORPORATIVOS
-- ============================================

INSERT INTO beneficios (nombre, descripcion, tipo, valor, vigencia_inicio, vigencia_fin) VALUES
('Seguro Médico Familiar', 'Cobertura médica para empleado y familia directa', 'Seguro', 500.00, '2025-01-01', '2025-12-31'),
('Subsidio de Educación', 'Apoyo para educación de hijos', 'Bono', 300.00, '2025-01-01', '2025-12-31'),
('Convenio Gimnasios', 'Acceso a red de gimnasios con descuento', 'Descuento', 80.00, '2025-01-01', '2025-12-31'),
('Bono de Cumpleaños', 'Bono especial en mes de cumpleaños', 'Bono', 200.00, '2025-01-01', '2025-12-31')
ON CONFLICT DO NOTHING;

-- Asignar beneficios a empleados
INSERT INTO empleado_beneficios (empleado_id, beneficio_id, estado) VALUES
(1, 1, 'Activo'), (1, 2, 'Activo'), (1, 4, 'Activo'),
(2, 1, 'Activo'), (2, 3, 'Activo'),
(3, 1, 'Activo'), (3, 4, 'Activo'),
(4, 1, 'Activo'), (4, 3, 'Activo'), (4, 4, 'Activo'),
(5, 1, 'Activo'), (5, 3, 'Activo'),
(6, 1, 'Activo'),
(7, 1, 'Activo'), (7, 3, 'Activo'),
(8, 3, 'Activo')
ON CONFLICT DO NOTHING;

-- ============================================
-- CONFIRMACIÓN
-- ============================================

SELECT 'Base de datos inicializada correctamente' AS mensaje;
SELECT COUNT(*) AS total_empresas FROM empresas;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_empleados FROM empleados;
SELECT COUNT(*) AS total_publicaciones FROM publicaciones;
SELECT COUNT(*) AS total_solicitudes FROM solicitudes_vacaciones;
