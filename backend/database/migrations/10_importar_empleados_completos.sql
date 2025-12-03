-- =====================================================
-- IMPORTACIÓN Y FUSIÓN DE EMPLEADOS CON USUARIOS
-- =====================================================
-- Este script importa los empleados del JSON y los fusiona con usuarios

-- 1. CREAR ÁREAS SI NO EXISTEN
INSERT INTO areas (nombre, descripcion, centro_costos) VALUES
('Finanzas', 'Área de Finanzas y Contabilidad', 'CC-FIN'),
('Tranformacion Digital', 'Área de Tecnología e Innovación', 'CC-TI'),
('Administracion', 'Área Administrativa', 'CC-ADM'),
('Recursos Humanos', 'Área de Talento Humano', 'CC-RH')
ON CONFLICT (nombre) DO UPDATE SET 
    descripcion = EXCLUDED.descripcion,
    centro_costos = EXCLUDED.centro_costos;

-- 2. CREAR DIVISIONES SI NO EXISTEN
INSERT INTO divisiones (nombre, descripcion) VALUES
('Gerencia de Administración y Finanzas', 'División de Administración y Finanzas'),
('Gerencia de Desarrollo Organizacional', 'División de Recursos Humanos y SST')
ON CONFLICT (nombre) DO NOTHING;

-- 3. CREAR PUESTOS SI NO EXISTEN
INSERT INTO puestos (nombre, nivel_jerarquico, salario_base, area_id) 
SELECT puesto, jerarquia, 3000, 
    (SELECT id FROM areas WHERE nombre = 
        CASE 
            WHEN puesto LIKE '%Ti%' OR puesto LIKE '%TI%' OR puesto LIKE '%Digital%' OR puesto LIKE '%Infraestructura%' 
                OR puesto LIKE '%Aplicaciones%' OR puesto LIKE '%Seguridad%' OR puesto LIKE '%Developer%' THEN 'Tranformacion Digital'
            WHEN puesto LIKE '%Finanzas%' OR puesto LIKE '%Contable%' OR puesto LIKE '%Costos%' 
                OR puesto LIKE '%Créditos%' OR puesto LIKE '%Legal%' THEN 'Finanzas'
            WHEN puesto LIKE '%Admin%' THEN 'Administracion'
            WHEN puesto LIKE '%Humano%' OR puesto LIKE '%RRHH%' OR puesto LIKE '%SST%' THEN 'Recursos Humanos'
            ELSE 'Administracion'
        END
        LIMIT 1
    )
FROM (VALUES
    ('DIRECTOR FINANZAS Y T.I', 'director'),
    ('Gerente Transformación Digital', 'gerente'),
    ('Jefe de Proyectos Ti', 'jefe'),
    ('Jefe de Aplicaciones', 'jefe'),
    ('Jefe Finanzas', 'jefe'),
    ('Jefe Planeamiento Financiero', 'jefe'),
    ('Jefe Admin.', 'jefe'),
    ('Asesor Legal', 'asesor'),
    ('Supervisor de Infraestructura y Operaciones Ti', 'supervisor'),
    ('Supervisor de Seguridad de la Información', 'supervisor'),
    ('Asistente de Aplicaciones', 'auxiliar'),
    ('Asistente Infraestructura y Soporte Ti', 'auxiliar'),
    ('Asistente Infraestructura y Soporte TI', 'auxiliar'),
    ('Practicante Ti', 'auxiliar'),
    ('Supervisor Finanzas', 'supervisor'),
    ('Supervisor Créditos y Cobranzas', 'supervisor'),
    ('Supervisor Contable', 'supervisor'),
    ('Supervisor Costos', 'supervisor'),
    ('Developer', 'coordinador'),
    ('Gerente de Talento Humano y SST I HHR', 'gerente')
) AS puestos_nuevos(puesto, jerarquia)
ON CONFLICT (nombre) DO NOTHING;

-- 4. INSERTAR/ACTUALIZAR USUARIOS
-- Usuario 1: José Garcia (Director)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('jose.garcia@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'director', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 2: Ena Fernández (Gerente)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('ena.fernandez@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'gerente', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 3: Teodoro Balarezo (Jefe)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('teodoro.balarezo@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'jefe', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 4: Juana Lovaton (Jefe)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('juana.lovaton@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'jefe', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 5: José Pariasca (Jefe)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('jose.pariasca@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'jefe', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 6: Pamela Torres (Jefe)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('pamela.torres@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'jefe', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 7: Ricardo Calderón (Jefe)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('ricardo.calderon@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'jefe', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 8: Kevin Marroquin (Asesor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('evin.marrokin@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'empleado', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 9: Cesar Garcia (Supervisor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('carlos.garcia@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'supervisor', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 10: Mariano Polo (Supervisor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('mariano.polo@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'supervisor', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 11: Juan Portal (Asistente)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('juan.portal@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'empleado', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 12: Miguel Maguiña (Asistente)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('miguel.maguina@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'empleado', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 13: Denis Huamán (Asistente)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('denis.huaman@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'empleado', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 14: José Guerrero (Practicante)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('jose.guerrero@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'empleado', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 15: Luis Ortega (Practicante)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('luis.ortega@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'empleado', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 16: Marilia Tinoco (Supervisor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('marilia.tinoco@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'supervisor', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 17: Katia Barcena (Supervisor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('katia.barcena@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'supervisor', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 18: Ana Flores (Supervisor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('ana.flores@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'supervisor', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 19: Blanca Loayza (Supervisor)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('blanca.loayza@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'supervisor', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 20: Jonathan Cerda (Developer)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('jonathan.cerda@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'coordinador', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- Usuario 21: Ursula Huamancaja (Gerente RRHH)
INSERT INTO usuarios (email, password, rol, activo) VALUES
('ursula.huamancaja@agrovetmarket.com', '$2b$10$rKZMw8qLqF3YvH.7eOB0qeYGqxqJxLzF3oPqF0qF0qF0qF0qF0qF0q', 'rrhh', true)
ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol, activo = true;

-- 5. INSERTAR/ACTUALIZAR EMPLEADOS
-- Empleado 1: José Garcia
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, es_rrhh)
VALUES (
    '00000001', 'José', 'Garcia', '999999001', '2001-10-02', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'DIRECTOR FINANZAS Y T.I' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'jose.garcia@agrovetmarket.com' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    estado = 'Activo';

-- Empleado 2: Ena Fernández
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000002', 'Ena', 'Fernández', '999999002', '2001-10-03', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Gerente Transformación Digital' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'ena.fernandez@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000001' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 3: Teodoro Balarezo
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000004', 'Teodoro', 'Balarezo', '999999003', '2001-10-05', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Jefe de Proyectos Ti' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'teodoro.balarezo@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 4: Juana Lovaton
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000005', 'Juana', 'Lovaton', '999999004', '2001-10-06', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Jefe de Aplicaciones' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'juana.lovaton@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 5: José Pariasca
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000006', 'José', 'Pariasca', '999999005', '2001-10-07', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Jefe Finanzas' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'jose.pariasca@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000001' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 6: Pamela Torres
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000007', 'Pamela', 'Torres', '999999006', '2001-10-08', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Jefe Planeamiento Financiero' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'pamela.torres@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000001' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 7: Ricardo Calderón
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000008', 'Ricardo', 'Calderón', '999999007', '2001-10-09', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Jefe Admin.' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Administracion' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'ricardo.calderon@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000001' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 8: Kevin Marroquin
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000009', 'Kevin', 'Marroquin', '999999008', '2001-10-10', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Asesor Legal' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'evin.marrokin@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000001' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 9: Cesar Garcia
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000010', 'Cesar', 'Garcia', '999999009', '2001-10-11', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Supervisor de Infraestructura y Operaciones Ti' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'carlos.garcia@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 10: Mariano Polo
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000011', 'Mariano', 'Polo', '999999010', '2001-10-12', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Supervisor de Seguridad de la Información' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'mariano.polo@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 11: Juan Portal
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000012', 'Juan', 'Portal', '999999011', '2001-10-13', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Asistente de Aplicaciones' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'juan.portal@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000005' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 12: Miguel Maguiña
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000013', 'Miguel', 'Maguiña', '999999012', '2001-10-14', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Asistente Infraestructura y Soporte Ti' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'miguel.maguina@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 13: Denis Huamán
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000014', 'Denis', 'Huamán', '999999013', '2001-10-15', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Asistente Infraestructura y Soporte TI' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'denis.huaman@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 14: José Guerrero
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000015', 'José', 'Guerrero', '999999014', '2001-10-16', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Practicante Ti' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'jose.guerrero@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 15: Luis Ortega
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000016', 'Luis', 'Ortega', '999999015', '2001-10-17', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Practicante Ti' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'luis.ortega@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000002' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 16: Marilia Tinoco
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000017', 'Marilia', 'Tinoco', '999999016', '2001-10-18', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Supervisor Finanzas' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'marilia.tinoco@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000007' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 17: Katia Barcena
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000018', 'Katia', 'Barcena', '999999017', '2001-10-19', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Supervisor Créditos y Cobranzas' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'katia.barcena@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000006' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 18: Ana Flores
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000019', 'Ana', 'Flores', '999999018', '2001-10-20', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Supervisor Contable' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'ana.flores@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000007' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 19: Blanca Loayza
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000020', 'Blanca', 'Loayza', '999999019', '2001-10-21', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Supervisor Costos' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Finanzas' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'blanca.loayza@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000007' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 20: Jonathan Cerda
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, supervisor_id, es_rrhh)
VALUES (
    '00000021', 'Jonathan', 'Cerda', '999999020', '2025-09-17', 30, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Developer' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Tranformacion Digital' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'jonathan.cerda@agrovetmarket.com' LIMIT 1),
    (SELECT id FROM empleados WHERE dni = '00000004' LIMIT 1),
    false
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    supervisor_id = EXCLUDED.supervisor_id,
    estado = 'Activo';

-- Empleado 21: Ursula Huamancaja (RRHH)
INSERT INTO empleados (dni, nombres, apellidos, telefono, fecha_ingreso, dias_vacaciones, tipo_contrato, estado, puesto_id, area_id, usuario_id, es_rrhh)
VALUES (
    '00000035', 'Ursula', 'Huamancaja', '999999021', '2020-05-15', 42, 'Tiempo Completo', 'Activo',
    (SELECT id FROM puestos WHERE nombre = 'Gerente de Talento Humano y SST I HHR' LIMIT 1),
    (SELECT id FROM areas WHERE nombre = 'Recursos Humanos' LIMIT 1),
    (SELECT id FROM usuarios WHERE email = 'ursula.huamancaja@agrovetmarket.com' LIMIT 1),
    true
)
ON CONFLICT (dni) DO UPDATE SET
    nombres = EXCLUDED.nombres,
    apellidos = EXCLUDED.apellidos,
    fecha_ingreso = EXCLUDED.fecha_ingreso,
    dias_vacaciones = EXCLUDED.dias_vacaciones,
    puesto_id = EXCLUDED.puesto_id,
    area_id = EXCLUDED.area_id,
    usuario_id = EXCLUDED.usuario_id,
    es_rrhh = true,
    estado = 'Activo';

-- 6. VERIFICACIÓN Y RESUMEN
SELECT 
    'Migración completada' as mensaje,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM empleados) as total_empleados,
    (SELECT COUNT(*) FROM puestos) as total_puestos,
    (SELECT COUNT(*) FROM areas) as total_areas;
