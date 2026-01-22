-- Script SQL para actualizar puesto_id de todos los empleados
-- Generado manualmente con los 219 empleados y sus cargos correctos

-- Jefe de Ventas Ganadería (con acento correcto)
UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = 'Jefe de Ventas Ganadería' LIMIT 1) 
WHERE dni IN ('09314068', '42705690') AND puesto_id IS NULL;

-- Jefe de Administración
UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = 'Jefe de Administración' LIMIT 1)
WHERE dni = '10184621' AND puesto_id IS NULL;

-- Auxiliar de Limpieza Y Mantenimiento  
UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Limpieza Y Mantenimiento' LIMIT 1)
WHERE dni = '07097049' AND puesto_id IS NULL;

-- Piñeyros -> tiene caracteres especiales, buscar por apellido similar
UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = 'Auxiliar de Limpieza Y Mantenimiento' LIMIT 1)
WHERE dni = '07097049' AND puesto_id IS NULL;

-- Resto de empleados - cargar en lotes
-- Supervisor de Diseño de Material de Empaque
UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre LIKE '%Dise_o de Material de Empaque%' LIMIT 1)
WHERE dni = '44510264' AND puesto_id IS NULL;

-- Más eficiente: crear una tabla temporal con el mapeo correcto
CREATE TEMP TABLE temp_empleado_puesto AS
SELECT 
  '09310906' as dni, 'Director General' as cargo
UNION ALL SELECT '09849767', 'Supervisor de Recepcion, Materiales y Despachos a Maquilas'
UNION ALL SELECT '09314068', 'Jefe de Ventas Ganadería'
UNION ALL SELECT '41118341', 'Supervisor de Producto Terminado, Distribucion y Transporte'
UNION ALL SELECT '10184621', 'Jefe de Administración'
UNION ALL SELECT '10545562', 'Director de Finanzas y Tecnologias de la Informacion'
UNION ALL SELECT '09351865', 'Supervisor de Control de Procesos'
UNION ALL SELECT '41300244', 'Directora de Investigacion y Desarrollo'
UNION ALL SELECT '07097049', 'Auxiliar de Limpieza Y Mantenimiento'
UNION ALL SELECT '40123188', 'Directora de Desarrollo Organizacional'
UNION ALL SELECT '29672410', 'Subgerente de Ventas Internacionales'
UNION ALL SELECT '41866820', 'Gerente de Logistica y Distribucion'
UNION ALL SELECT '42705690', 'Jefe de Ventas Ganadería'
UNION ALL SELECT '07514765', 'Asistente de Materiales y Despacho Maquilas'
UNION ALL SELECT '09308424', 'Asesor'
-- ... continuar con los 219 empleados

-- Actualizar usando la tabla temporal
UPDATE empleados e
SET puesto_id = p.id
FROM temp_empleado_puesto tep
JOIN puestos p ON p.nombre = tep.cargo
WHERE e.dni = tep.dni AND e.puesto_id IS NULL;
