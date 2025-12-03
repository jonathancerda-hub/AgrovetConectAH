-- ====================================
-- MIGRACIÓN DE DATOS DE EMPLEADOS
-- Actualiza/Inserta empleados del JSON
-- ====================================

BEGIN;

-- 1. Actualizar/Insertar ÁREAS
INSERT INTO areas (id, nombre, descripcion, activo)
VALUES 
  (1, 'Finanzas', 'Dirección de Finanzas y TI', true),
  (2, 'Transformacion Digital', 'Transformación Digital', true),
  (3, 'Administracion', 'Administración', true),
  (4, 'Recursos Humanos', 'Recursos Humanos', true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

-- 2. Actualizar/Insertar PUESTOS
INSERT INTO puestos (id, nombre, descripcion, salario_base, activo)
VALUES 
  (1, 'DIRECTOR FINANZAS Y T.I', 'Director de Finanzas y TI', 0, true),
  (2, 'Gerente Transformación Digital', 'Gerente de Transformación Digital', 0, true),
  (3, 'Jefe de Proyectos Ti', 'Jefe de Proyectos TI', 0, true),
  (4, 'Jefe de Aplicaciones', 'Jefe de Aplicaciones', 0, true),
  (5, 'Jefe Finanzas', 'Jefe de Finanzas', 0, true),
  (6, 'Jefe Planeamiento Financiero', 'Jefe de Planeamiento Financiero', 0, true),
  (7, 'Jefe Admin.', 'Jefe de Administración', 0, true),
  (8, 'Asesor Legal', 'Asesor Legal', 0, true),
  (9, 'Supervisor de Infraestructura y Operaciones Ti', 'Supervisor de Infraestructura', 0, true),
  (10, 'Supervisor de Seguridad de la Información', 'Supervisor de Seguridad', 0, true),
  (11, 'Asistente de Aplicaciones', 'Asistente de Aplicaciones', 0, true),
  (12, 'Asistente Infraestructura y Soporte Ti', 'Asistente de Infraestructura', 0, true),
  (13, 'Practicante Ti', 'Practicante TI', 0, true),
  (14, 'Supervisor Finanzas', 'Supervisor de Finanzas', 0, true),
  (15, 'Supervisor Créditos y Cobranzas', 'Supervisor de Créditos', 0, true),
  (16, 'Supervisor Contable', 'Supervisor Contable', 0, true),
  (17, 'Supervisor Costos', 'Supervisor de Costos', 0, true),
  (18, 'Developer', 'Desarrollador', 0, true),
  (19, 'Gerente de Talento Humano y SST I HHR', 'Gerente de RRHH', 0, true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

-- 3. Resetear secuencia de usuarios si es necesario
SELECT setval('usuarios_id_seq', GREATEST(22, (SELECT MAX(id) FROM usuarios)), true);
SELECT setval('empleados_id_seq', GREATEST(21, (SELECT MAX(id) FROM empleados)), true);

-- 4. Actualizar/Insertar USUARIOS
INSERT INTO usuarios (id, email, password, rol, activo, created_at, updated_at)
VALUES 
  (1, 'jose.garcia@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (2, 'ena.fernandez@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (3, 'teodoro.balarezo@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (4, 'juana.lovaton@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (5, 'jose.pariasca@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (6, 'pamela.torres@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (7, 'ricardo.calderon@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (8, 'evin.marrokin@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (9, 'carlos.garcia@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (10, 'mariano.polo@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (11, 'juan.portal@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (12, 'miguel.maguina@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (13, 'denis.huaman@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (14, 'jose.guerrero@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (15, 'luis.ortega@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (16, 'marilia.tinoco@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (17, 'katia.barcena@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (18, 'ana.flores@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (19, 'blanca.loayza@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (21, 'jonathan.cerda@agrovetmarket.com', '$2a$10$defaulthash', 'empleado', true, NOW(), NOW()),
  (22, 'ursula.huamancaja@agrovetmarket.com', '$2a$10$defaulthash', 'rrhh', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  rol = EXCLUDED.rol,
  updated_at = NOW();

-- 5. Actualizar/Insertar EMPLEADOS
INSERT INTO empleados (
  id, codigo_empleado, nombres, apellidos, email, dni, telefono,
  fecha_nacimiento, fecha_ingreso, puesto_id, area_id, es_rrhh,
  supervisor_id, tipo_trabajador_id, activo, foto_perfil,
  created_at, updated_at
)
VALUES 
  -- 1. José Garcia - Director
  (1, 'EMP001', 'José', 'Garcia', 'jose.garcia@agrovetmarket.com', '00000001', '', 
   '1970-01-01', '2001-10-02', 1, 1, false, NULL, 1, true, '', NOW(), NOW()),
  
  -- 2. Ena Fernández - Gerente
  (2, 'EMP002', 'Ena', 'Fernández', 'ena.fernandez@agrovetmarket.com', '00000002', '', 
   '1970-01-01', '2001-10-03', 2, 2, false, 1, 1, true, '', NOW(), NOW()),
  
  -- 3. Teodoro Balarezo - Jefe
  (3, 'EMP004', 'Teodoro', 'Balarezo', 'teodoro.balarezo@agrovetmarket.com', '00000004', '', 
   '1970-01-01', '2001-10-05', 3, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 4. Juana Lovaton - Jefe
  (4, 'EMP005', 'Juana', 'Lovaton', 'juana.lovaton@agrovetmarket.com', '00000005', '', 
   '1970-01-01', '2001-10-06', 4, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 5. José Pariasca - Jefe
  (5, 'EMP006', 'José', 'Pariasca', 'jose.pariasca@agrovetmarket.com', '00000006', '', 
   '1970-01-01', '2001-10-07', 5, 1, false, 1, 1, true, '', NOW(), NOW()),
  
  -- 6. Pamela Torres - Jefe
  (6, 'EMP007', 'Pamela', 'Torres', 'pamela.torres@agrovetmarket.com', '00000007', '', 
   '1970-01-01', '2001-10-08', 6, 1, false, 1, 1, true, '', NOW(), NOW()),
  
  -- 7. Ricardo Calderón - Jefe
  (7, 'EMP008', 'Ricardo', 'Calderón', 'ricardo.calderon@agrovetmarket.com', '00000008', '', 
   '1970-01-01', '2001-10-09', 7, 3, false, 1, 1, true, '', NOW(), NOW()),
  
  -- 8. Kevin Marroquin - Asesor
  (8, 'EMP009', 'Kevin', 'Marroquin', 'evin.marrokin@agrovetmarket.com', '00000009', '', 
   '1970-01-01', '2001-10-10', 8, 1, false, 1, 1, true, '', NOW(), NOW()),
  
  -- 9. Cesar Garcia - Supervisor
  (9, 'EMP010', 'Cesar', 'Garcia', 'carlos.garcia@agrovetmarket.com', '00000010', '', 
   '1970-01-01', '2001-10-11', 9, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 10. Mariano Polo - Supervisor
  (10, 'EMP011', 'Mariano', 'Polo', 'mariano.polo@agrovetmarket.com', '00000011', '', 
   '1970-01-01', '2001-10-12', 10, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 11. Juan Portal - Asistente
  (11, 'EMP012', 'Juan', 'Portal', 'juan.portal@agrovetmarket.com', '00000012', '', 
   '1970-01-01', '2001-10-13', 11, 2, false, 4, 1, true, '', NOW(), NOW()),
  
  -- 12. Miguel Maguiña - Asistente
  (12, 'EMP013', 'Miguel', 'Maguiña', 'miguel.maguina@agrovetmarket.com', '00000013', '', 
   '1970-01-01', '2001-10-14', 12, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 13. Denis Huamán - Asistente
  (13, 'EMP014', 'Denis', 'Huamán', 'denis.huaman@agrovetmarket.com', '00000014', '', 
   '1970-01-01', '2001-10-15', 12, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 14. José Guerrero - Practicante
  (14, 'EMP015', 'José', 'Guerrero', 'jose.guerrero@agrovetmarket.com', '00000015', '', 
   '1970-01-01', '2001-10-16', 13, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 15. Luis Ortega - Practicante
  (15, 'EMP016', 'Luis', 'Ortega', 'luis.ortega@agrovetmarket.com', '00000016', '', 
   '1970-01-01', '2001-10-17', 13, 2, false, 2, 1, true, '', NOW(), NOW()),
  
  -- 16. Marilia Tinoco - Supervisor
  (16, 'EMP017', 'Marilia', 'Tinoco', 'marilia.tinoco@agrovetmarket.com', '00000017', '', 
   '1970-01-01', '2001-10-18', 14, 1, false, 6, 1, true, '', NOW(), NOW()),
  
  -- 17. Katia Barcena - Supervisor
  (17, 'EMP018', 'K. Barcena', 'Barcena', 'katia.barcena@agrovetmarket.com', '00000018', '', 
   '1970-01-01', '2001-10-19', 15, 1, false, 5, 1, true, '', NOW(), NOW()),
  
  -- 18. Ana Flores - Supervisor
  (18, 'EMP019', 'A. Flores', 'Flores', 'ana.flores@agrovetmarket.com', '00000019', '', 
   '1970-01-01', '2001-10-20', 16, 1, false, 6, 1, true, '', NOW(), NOW()),
  
  -- 19. Blanca Loayza - Supervisor
  (19, 'EMP020', 'B. Loayza', 'Loayza', 'blanca.loayza@agrovetmarket.com', '00000020', '', 
   '1970-01-01', '2001-10-21', 17, 1, false, 6, 1, true, '', NOW(), NOW()),
  
  -- 20. Jonathan Cerda - Developer
  (20, 'EMP021', 'Jonathan', 'Cerda', 'jonathan.cerda@agrovetmarket.com', '00000021', '', 
   '1995-01-01', '2025-09-17', 18, 2, false, 3, 1, true, '', NOW(), NOW()),
  
  -- 21. Ursula Huamancaja - Gerente RRHH
  (21, 'EMP035', 'Ursula', 'Huamancaja', 'ursula.huamancaja@agrovetmarket.com', '00000035', '', 
   '1970-01-01', '2020-05-15', 19, 4, true, NULL, 1, true, '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  nombres = EXCLUDED.nombres,
  apellidos = EXCLUDED.apellidos,
  email = EXCLUDED.email,
  dni = EXCLUDED.dni,
  fecha_ingreso = EXCLUDED.fecha_ingreso,
  puesto_id = EXCLUDED.puesto_id,
  area_id = EXCLUDED.area_id,
  es_rrhh = EXCLUDED.es_rrhh,
  supervisor_id = EXCLUDED.supervisor_id,
  updated_at = NOW();

-- 6. Vincular usuarios con empleados
UPDATE usuarios u SET empleado_id = e.id
FROM empleados e
WHERE u.email = e.email
AND u.empleado_id IS NULL;

-- 7. Crear periodos de vacaciones para los empleados
INSERT INTO periodos_vacaciones (
  empleado_id, periodo_anio, fecha_inicio_periodo, fecha_fin_periodo,
  dias_totales, dias_usados, dias_disponibles, estado, activo
)
SELECT 
  e.id,
  2025,
  '2025-01-01',
  '2025-12-31',
  CASE WHEN e.es_rrhh THEN 42 ELSE 30 END,
  0,
  CASE WHEN e.es_rrhh THEN 42 ELSE 30 END,
  'activo',
  true
FROM empleados e
WHERE e.id <= 21
ON CONFLICT (empleado_id, periodo_anio) 
DO UPDATE SET
  dias_totales = EXCLUDED.dias_totales,
  dias_disponibles = EXCLUDED.dias_disponibles;

COMMIT;

-- Verificar la migración
SELECT 
  e.id,
  e.codigo_empleado,
  e.nombres || ' ' || e.apellidos as nombre_completo,
  e.email,
  e.dni,
  p.nombre as puesto,
  a.nombre as area,
  e.es_rrhh,
  u.id as usuario_id,
  u.rol,
  COALESCE(pv.dias_disponibles, 0) as dias_vacaciones
FROM empleados e
LEFT JOIN puestos p ON e.puesto_id = p.id
LEFT JOIN areas a ON e.area_id = a.id
LEFT JOIN usuarios u ON e.email = u.email
LEFT JOIN periodos_vacaciones pv ON e.id = pv.empleado_id AND pv.periodo_anio = 2025
WHERE e.id <= 21
ORDER BY e.id;
