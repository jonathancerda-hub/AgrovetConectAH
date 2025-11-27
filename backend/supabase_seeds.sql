-- ==========================================
-- DATOS DE PRUEBA PARA SUPABASE
-- Sistema AgroVet Conecta
-- ==========================================

-- 1. ÁREAS
INSERT INTO areas (nombre, descripcion, activo) VALUES
('TI (SISTEMAS)', 'Área de sistemas y tecnología', true),
('FINANZAS', 'Área de contabilidad y finanzas', true),
('TALENTO HUMANO Y SST', 'Gestión de personal y seguridad', true),
('LOGÍSTICA', 'Gestión de almacenes y distribución', true)
ON CONFLICT (nombre) DO NOTHING;

-- 2. TIPOS DE TRABAJADOR
INSERT INTO tipos_trabajador (nombre, descripcion, dias_vacaciones_anuales, activo) VALUES
('Plazo Indeterminado', 'Contrato a plazo indeterminado', 30, true),
('Plazo Fijo', 'Contrato a plazo fijo', 30, true),
('Temporal', 'Contrato temporal o por obra', 15, true),
('Prácticas', 'Contrato de prácticas profesionales', 7, true)
ON CONFLICT (nombre) DO NOTHING;

-- 3. PUESTOS
INSERT INTO puestos (nombre, descripcion, nivel_jerarquico, activo) VALUES
('Director General', 'Máxima autoridad de la empresa', 1, true),
('Gerente de TI', 'Responsable del área de tecnología', 2, true),
('Gerente de Talento Humano y SST', 'Responsable de RRHH', 2, true),
('Jefe de Desarrollo', 'Líder del equipo de desarrollo', 4, true),
('Coordinador de Proyectos de TI', 'Coordinación de proyectos tecnológicos', 6, true),
('Desarrollador Senior', 'Desarrollo de software', 7, true),
('Analista de RRHH', 'Análisis y gestión de personal', 7, true),
('Asistente Administrativo', 'Soporte administrativo', 8, true)
ON CONFLICT (nombre) DO NOTHING;

-- 4. EMPLEADOS (sin supervisores primero)
-- Password para todos: el hash es de bcrypt para "admin123", "rrhh123", "jefe123", "coord123", "emp123"
INSERT INTO empleados (codigo_empleado, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, activo) VALUES
('EMP001', 'Carlos', 'Director', 'admin@agrovet.com', '2015-01-10', (SELECT id FROM puestos WHERE nombre = 'Director General'), (SELECT id FROM areas WHERE nombre = 'TI (SISTEMAS)'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP002', 'Ursula', 'Huamancaja', 'ursula.huamancaja@agrovet.com', '2016-03-15', (SELECT id FROM puestos WHERE nombre = 'Gerente de Talento Humano y SST'), (SELECT id FROM areas WHERE nombre = 'TALENTO HUMANO Y SST'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP003', 'Perci', 'Mondragon', 'perci.mondragon@agrovet.com', '2018-06-20', (SELECT id FROM puestos WHERE nombre = 'Gerente de TI'), (SELECT id FROM areas WHERE nombre = 'TI (SISTEMAS)'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP004', 'Jorge Luis Jonathan', 'Cerda Piaca', 'jonathan.cerda@agrovet.com', '2010-11-23', (SELECT id FROM puestos WHERE nombre = 'Coordinador de Proyectos de TI'), (SELECT id FROM areas WHERE nombre = 'TI (SISTEMAS)'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP005', 'Ana', 'García', 'ana.garcia@agrovet.com', '2022-01-15', (SELECT id FROM puestos WHERE nombre = 'Desarrollador Senior'), (SELECT id FROM areas WHERE nombre = 'TI (SISTEMAS)'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP006', 'Carlos', 'Martínez', 'carlos.martinez@agrovet.com', '2021-11-20', (SELECT id FROM puestos WHERE nombre = 'Desarrollador Senior'), (SELECT id FROM areas WHERE nombre = 'TI (SISTEMAS)'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP007', 'Laura', 'Rodríguez', 'laura.rodriguez@agrovet.com', '2022-03-10', (SELECT id FROM puestos WHERE nombre = 'Analista de RRHH'), (SELECT id FROM areas WHERE nombre = 'TALENTO HUMANO Y SST'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Indeterminado'), true),
('EMP008', 'Pedro', 'Sánchez', 'pedro.sanchez@agrovet.com', '2023-05-01', (SELECT id FROM puestos WHERE nombre = 'Asistente Administrativo'), (SELECT id FROM areas WHERE nombre = 'TALENTO HUMANO Y SST'), (SELECT id FROM tipos_trabajador WHERE nombre = 'Plazo Fijo'), true)
ON CONFLICT (email) DO NOTHING;

-- 5. ACTUALIZAR SUPERVISORES Y MARCAR RRHH
UPDATE empleados SET supervisor_id = NULL WHERE email = 'admin@agrovet.com';
UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE email = 'admin@agrovet.com') WHERE email = 'ursula.huamancaja@agrovet.com';
UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE email = 'admin@agrovet.com') WHERE email = 'perci.mondragon@agrovet.com';
UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE email = 'perci.mondragon@agrovet.com') WHERE email = 'jonathan.cerda@agrovet.com';
UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE email = 'jonathan.cerda@agrovet.com') WHERE email IN ('ana.garcia@agrovet.com', 'carlos.martinez@agrovet.com');
UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE email = 'ursula.huamancaja@agrovet.com') WHERE email IN ('laura.rodriguez@agrovet.com', 'pedro.sanchez@agrovet.com');

-- Marcar a Ursula como RRHH
UPDATE empleados SET es_rrhh = true WHERE email = 'ursula.huamancaja@agrovet.com';

-- 6. USUARIOS
-- Password hash para: admin123, rrhh123, jefe123, coord123, emp123
INSERT INTO usuarios (empleado_id, username, password_hash, rol, activo) VALUES
((SELECT id FROM empleados WHERE email = 'admin@agrovet.com'), 'admin@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'admin', true),
((SELECT id FROM empleados WHERE email = 'ursula.huamancaja@agrovet.com'), 'ursula.huamancaja@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'rrhh', true),
((SELECT id FROM empleados WHERE email = 'perci.mondragon@agrovet.com'), 'perci.mondragon@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'gerente', true),
((SELECT id FROM empleados WHERE email = 'jonathan.cerda@agrovet.com'), 'jonathan.cerda@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'coordinador', true),
((SELECT id FROM empleados WHERE email = 'ana.garcia@agrovet.com'), 'ana.garcia@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado', true),
((SELECT id FROM empleados WHERE email = 'carlos.martinez@agrovet.com'), 'carlos.martinez@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado', true),
((SELECT id FROM empleados WHERE email = 'laura.rodriguez@agrovet.com'), 'laura.rodriguez@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado', true),
((SELECT id FROM empleados WHERE email = 'pedro.sanchez@agrovet.com'), 'pedro.sanchez@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'empleado', true)
ON CONFLICT (username) DO NOTHING;

-- 7. PERÍODOS VACACIONALES 2025
INSERT INTO periodos_vacacionales (empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo, dias_totales, dias_disponibles, estado) VALUES
((SELECT id FROM empleados WHERE email = 'jonathan.cerda@agrovet.com'), 2025, '2025-01-01', '2025-12-31', 30, 30, 'activo'),
((SELECT id FROM empleados WHERE email = 'ana.garcia@agrovet.com'), 2025, '2025-01-01', '2025-12-31', 30, 30, 'activo'),
((SELECT id FROM empleados WHERE email = 'carlos.martinez@agrovet.com'), 2025, '2025-01-01', '2025-12-31', 30, 30, 'activo'),
((SELECT id FROM empleados WHERE email = 'laura.rodriguez@agrovet.com'), 2025, '2025-01-01', '2025-12-31', 30, 25, 'activo'),
((SELECT id FROM empleados WHERE email = 'pedro.sanchez@agrovet.com'), 2025, '2025-01-01', '2025-12-31', 7, 7, 'activo')
ON CONFLICT (empleado_id, anio_generacion) DO UPDATE SET
  dias_totales = EXCLUDED.dias_totales,
  dias_disponibles = EXCLUDED.dias_disponibles,
  estado = EXCLUDED.estado;

-- 8. SOLICITUDES DE VACACIONES DE PRUEBA
-- Primero eliminar solicitudes existentes para evitar duplicados
DELETE FROM solicitudes_vacaciones WHERE empleado_id IN (
  SELECT id FROM empleados WHERE email IN (
    'ana.garcia@agrovet.com',
    'carlos.martinez@agrovet.com',
    'laura.rodriguez@agrovet.com'
  )
);

INSERT INTO solicitudes_vacaciones (
  empleado_id, 
  periodo_id,
  fecha_inicio, 
  fecha_fin, 
  dias_solicitados, 
  dias_calendario,
  mes_solicitud,
  anio_solicitud,
  estado, 
  comentarios,
  motivo
) VALUES
-- Solicitud pendiente de Ana García (supervisor: Jonathan Cerda)
(
  (SELECT id FROM empleados WHERE email = 'ana.garcia@agrovet.com'),
  (SELECT id FROM periodos_vacacionales WHERE empleado_id = (SELECT id FROM empleados WHERE email = 'ana.garcia@agrovet.com') AND anio_generacion = 2025),
  '2025-12-22', 
  '2025-12-26', 
  5, 
  5, 
  12, 
  2025, 
  'pendiente', 
  'Solicito estos días para celebrar fin de año con mi familia',
  'Vacaciones de fin de año'
),

-- Solicitud pendiente de Carlos Martínez (supervisor: Jonathan Cerda)
(
  (SELECT id FROM empleados WHERE email = 'carlos.martinez@agrovet.com'),
  (SELECT id FROM periodos_vacacionales WHERE empleado_id = (SELECT id FROM empleados WHERE email = 'carlos.martinez@agrovet.com') AND anio_generacion = 2025),
  '2025-12-15', 
  '2025-12-20', 
  5, 
  6, 
  12, 
  2025, 
  'pendiente', 
  'Viaje programado hace 3 meses',
  'Viaje familiar'
),

-- Solicitud aprobada de Laura Rodríguez (supervisor: Ursula Huamancaja)
(
  (SELECT id FROM empleados WHERE email = 'laura.rodriguez@agrovet.com'),
  (SELECT id FROM periodos_vacacionales WHERE empleado_id = (SELECT id FROM empleados WHERE email = 'laura.rodriguez@agrovet.com') AND anio_generacion = 2025),
  '2025-10-10', 
  '2025-10-15', 
  5, 
  6, 
  10, 
  2025, 
  'aprobada', 
  'Aprobado para descanso programado',
  'Descanso médico programado'
);

-- Mensaje de confirmación
SELECT 
  (SELECT COUNT(*) FROM empleados) as total_empleados,
  (SELECT COUNT(*) FROM usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM solicitudes_vacaciones) as total_solicitudes,
  (SELECT COUNT(*) FROM periodos_vacacionales) as total_periodos;
