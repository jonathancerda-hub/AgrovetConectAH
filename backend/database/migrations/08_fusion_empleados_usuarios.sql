-- ============================================
-- FUSIÓN DE EMPLEADOS Y USUARIOS
-- Fecha: 2025-12-03
-- Descripción: Integra los empleados del JSON con la estructura actual
-- ============================================

BEGIN;

-- 1. Primero, limpiar datos existentes (opcional, comentar si quieres mantener datos actuales)
-- TRUNCATE TABLE empleados CASCADE;
-- TRUNCATE TABLE usuarios CASCADE;

-- 2. Insertar/Actualizar Áreas (solo si no existen)
INSERT INTO areas (id, nombre) VALUES
(1, 'Finanzas'),
(2, 'Transformación Digital'),
(3, 'Administración'),
(4, 'Recursos Humanos')
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar/Actualizar Puestos (solo si no existen)
INSERT INTO puestos (id, nombre, area_id) VALUES
(1, 'DIRECTOR FINANZAS Y T.I', 1),
(2, 'Gerente Transformación Digital', 2),
(3, 'Jefe de Proyectos TI', 2),
(4, 'Jefe de Aplicaciones', 2),
(5, 'Jefe Finanzas', 1),
(6, 'Jefe Planeamiento Financiero', 1),
(7, 'Jefe Admin.', 3),
(8, 'Asesor Legal', 1),
(9, 'Supervisor de Infraestructura y Operaciones TI', 2),
(10, 'Supervisor de Seguridad de la Información', 2),
(11, 'Asistente de Aplicaciones', 2),
(12, 'Asistente Infraestructura y Soporte TI', 2),
(13, 'Practicante TI', 2),
(14, 'Supervisor Finanzas', 1),
(15, 'Supervisor Créditos y Cobranzas', 1),
(16, 'Supervisor Contable', 1),
(17, 'Supervisor Costos', 1),
(18, 'Developer', 2),
(19, 'Gerente de Talento Humano y SST', 4)
ON CONFLICT (id) DO NOTHING;

-- 3.5. Agregar columna DNI si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='empleados' AND column_name='dni') THEN
        ALTER TABLE empleados ADD COLUMN dni VARCHAR(20) UNIQUE;
    END IF;
END $$;

-- 4. Insertar Empleados primero (sin relación a usuarios todavía)
INSERT INTO empleados (id, codigo_empleado, dni, nombres, apellidos, email, telefono, fecha_ingreso, puesto_id, area_id, supervisor_id) VALUES
(1, 'EMP-001', '00000001', 'José', 'Garcia', 'jose.garcia@agrovetmarket.com', '', '2001-10-02', 1, 1, NULL),
(2, 'EMP-002', '00000002', 'Ena', 'Fernández', 'ena.fernandez@agrovetmarket.com', '', '2001-10-03', 2, 2, 1),
(3, 'EMP-003', '00000004', 'Teodoro', 'Balarezo', 'teodoro.balarezo@agrovetmarket.com', '', '2001-10-05', 3, 2, 2),
(4, 'EMP-004', '00000005', 'Juana', 'Lovaton', 'juana.lovaton@agrovetmarket.com', '', '2001-10-06', 4, 2, 2),
(5, 'EMP-005', '00000006', 'José', 'Pariasca', 'jose.pariasca@agrovetmarket.com', '', '2001-10-07', 5, 1, 1),
(6, 'EMP-006', '00000007', 'Pamela', 'Torres', 'pamela.torres@agrovetmarket.com', '', '2001-10-08', 6, 1, 1),
(7, 'EMP-007', '00000008', 'Ricardo', 'Calderón', 'ricardo.calderon@agrovetmarket.com', '', '2001-10-09', 7, 3, 1),
(8, 'EMP-008', '00000009', 'Kevin', 'Marroquin', 'kevin.marroquin@agrovetmarket.com', '', '2001-10-10', 8, 1, 1),
(9, 'EMP-009', '00000010', 'Cesar', 'Garcia', 'cesar.garcia@agrovetmarket.com', '', '2001-10-11', 9, 2, 2),
(10, 'EMP-010', '00000011', 'Mariano', 'Polo', 'mariano.polo@agrovetmarket.com', '', '2001-10-12', 10, 2, 2),
(11, 'EMP-011', '00000012', 'Juan', 'Portal', 'juan.portal@agrovetmarket.com', '', '2001-10-13', 11, 2, 4),
(12, 'EMP-012', '00000013', 'Miguel', 'Maguiña', 'miguel.maguina@agrovetmarket.com', '', '2001-10-14', 12, 2, 2),
(13, 'EMP-013', '00000014', 'Denis', 'Huamán', 'denis.huaman@agrovetmarket.com', '', '2001-10-15', 12, 2, 2),
(14, 'EMP-014', '00000015', 'José', 'Guerrero', 'jose.guerrero@agrovetmarket.com', '', '2001-10-16', 13, 2, 2),
(15, 'EMP-015', '00000016', 'Luis', 'Ortega', 'luis.ortega@agrovetmarket.com', '', '2001-10-17', 13, 2, 2),
(16, 'EMP-016', '00000017', 'Marilia', 'Tinoco', 'marilia.tinoco@agrovetmarket.com', '', '2001-10-18', 14, 1, 6),
(17, 'EMP-017', '00000018', 'Katia', 'Barcena', 'katia.barcena@agrovetmarket.com', '', '2001-10-19', 15, 1, 5),
(18, 'EMP-018', '00000019', 'Ana', 'Flores', 'ana.flores@agrovetmarket.com', '', '2001-10-20', 16, 1, 6),
(19, 'EMP-019', '00000020', 'Blanca', 'Loayza', 'blanca.loayza@agrovetmarket.com', '', '2001-10-21', 17, 1, 6),
(20, 'EMP-020', '00000021', 'Jonathan', 'Cerda', 'jonathan.cerda@agrovetmarket.com', '', '2025-09-17', 18, 2, 3),
(21, 'EMP-021', '00000035', 'Ursula', 'Huamancaja', 'ursula.huamancaja@agrovetmarket.com', '', '2020-05-15', 19, 4, NULL)
ON CONFLICT (id) DO UPDATE SET 
  codigo_empleado = EXCLUDED.codigo_empleado,
  dni = EXCLUDED.dni,
  nombres = EXCLUDED.nombres,
  apellidos = EXCLUDED.apellidos,
  email = EXCLUDED.email,
  fecha_ingreso = EXCLUDED.fecha_ingreso,
  puesto_id = EXCLUDED.puesto_id,
  area_id = EXCLUDED.area_id,
  supervisor_id = EXCLUDED.supervisor_id;

-- 5. Insertar Usuarios con relación a empleados
INSERT INTO usuarios (id, empleado_id, email, password, rol, activo) VALUES
(1, 1, 'jose.garcia@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'admin', true),
(2, 2, 'ena.fernandez@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'admin', true),
(3, 3, 'teodoro.balarezo@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(4, 4, 'juana.lovaton@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(5, 5, 'jose.pariasca@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(6, 6, 'pamela.torres@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(7, 7, 'ricardo.calderon@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(8, 8, 'kevin.marroquin@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'empleado', true),
(9, 9, 'cesar.garcia@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(10, 10, 'mariano.polo@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(11, 11, 'juan.portal@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'empleado', true),
(12, 12, 'miguel.maguina@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'empleado', true),
(13, 13, 'denis.huaman@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'empleado', true),
(14, 14, 'jose.guerrero@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'empleado', true),
(15, 15, 'luis.ortega@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'empleado', true),
(16, 16, 'marilia.tinoco@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(17, 17, 'katia.barcena@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(18, 18, 'ana.flores@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(19, 19, 'blanca.loayza@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'supervisor', true),
(21, 20, 'jonathan.cerda@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'coordinador', true),
(22, 21, 'ursula.huamancaja@agrovetmarket.com', '$2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO', 'rrhh', true)
ON CONFLICT (id) DO UPDATE SET 
  empleado_id = EXCLUDED.empleado_id,
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  rol = EXCLUDED.rol;

-- 6. Insertar Periodos Vacacionales (2024 y 2025) - 30 días por año para todos
INSERT INTO periodos_vacacionales (empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo, dias_totales, dias_disponibles, dias_usados, estado) VALUES
-- Año 2024
(1, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(2, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(3, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(4, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(5, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(6, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(7, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(8, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(9, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(10, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(11, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(12, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(13, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(14, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(15, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(16, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(17, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(18, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(19, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
(20, 2024, '2024-09-17', '2024-12-31', 12, 12, 0, 'activo'), -- Jonathan (ingreso en Sep, proporcional)
(21, 2024, '2024-01-01', '2024-12-31', 30, 30, 0, 'activo'),
-- Año 2025
(1, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(2, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(3, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(4, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(5, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(6, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(7, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(8, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(9, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(10, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(11, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(12, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(13, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(14, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(15, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(16, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(17, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(18, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(19, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(20, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo'),
(21, 2025, '2025-01-01', '2025-12-31', 30, 30, 0, 'activo')
ON CONFLICT (empleado_id, anio_generacion) DO UPDATE SET 
  fecha_inicio_periodo = EXCLUDED.fecha_inicio_periodo,
  fecha_fin_periodo = EXCLUDED.fecha_fin_periodo,
  dias_totales = EXCLUDED.dias_totales,
  dias_disponibles = EXCLUDED.dias_disponibles;

-- 7. Actualizar secuencias
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('empleados_id_seq', (SELECT MAX(id) FROM empleados));
SELECT setval('areas_id_seq', (SELECT MAX(id) FROM areas));
SELECT setval('puestos_id_seq', (SELECT MAX(id) FROM puestos));
SELECT setval('periodos_vacacionales_id_seq', (SELECT MAX(id) FROM periodos_vacacionales));

-- 8. Verificación
SELECT 'Total Usuarios:' as tipo, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'Total Empleados:' as tipo, COUNT(*) as cantidad FROM empleados
UNION ALL
SELECT 'Total Areas:' as tipo, COUNT(*) as cantidad FROM areas
UNION ALL
SELECT 'Total Puestos:' as tipo, COUNT(*) as cantidad FROM puestos
UNION ALL
SELECT 'Total Periodos 2024:' as tipo, COUNT(*) as cantidad FROM periodos_vacacionales WHERE anio_generacion = 2024
UNION ALL
SELECT 'Total Periodos 2025:' as tipo, COUNT(*) as cantidad FROM periodos_vacacionales WHERE anio_generacion = 2025;

COMMIT;

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- Password por defecto para todos: "Agrovet2025!"
-- Hash: $2b$10$r8C/vs.ur1RN7MfrGbhEnOLJ0OoeNodoHoeK8EaCS0nKA22mFxIPO
-- 
-- Usuarios creados:
-- - 21 usuarios con sus respectivos empleados
-- - Roles asignados según jerarquía
-- - Relaciones supervisor-empleado establecidas
--
-- Periodos vacacionales:
-- - 42 periodos totales (21 empleados × 2 años)
-- - Año 2024 y 2025: 30 días por año
-- - Jonathan Cerda (ID 20): 12 días en 2024 (proporcional desde Sep)
-- - Estado: todos 'activo'
-- ============================================
