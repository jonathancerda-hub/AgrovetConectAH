-- ============================================
-- ACTUALIZAR FECHAS DE NACIMIENTO PARA PRUEBAS
-- ============================================

-- Actualizar fechas de nacimiento de empleados existentes
-- Algunos tendrán cumpleaños HOY para pruebas

UPDATE empleados 
SET fecha_nacimiento = '1990-11-07'  -- Cumpleaños hoy (noviembre 7)
WHERE dni = '12345678';

UPDATE empleados 
SET fecha_nacimiento = '1985-11-07'  -- Cumpleaños hoy (noviembre 7)
WHERE dni = '23456789';

UPDATE empleados 
SET fecha_nacimiento = '1988-11-07'  -- Cumpleaños hoy (noviembre 7)
WHERE dni = '34567890';

UPDATE empleados 
SET fecha_nacimiento = '1992-01-08'  -- Cumpleaños 8 de enero
WHERE dni = '45678901';

UPDATE empleados 
SET fecha_nacimiento = '1991-03-15'
WHERE dni = '56789012';

UPDATE empleados 
SET fecha_nacimiento = '1993-07-22'
WHERE dni = '67890123';

UPDATE empleados 
SET fecha_nacimiento = '1989-09-10'
WHERE dni = '78901234';

UPDATE empleados 
SET fecha_nacimiento = '1994-12-25'
WHERE dni = '89012345';

-- Verificar las actualizaciones
SELECT 
  e.id,
  e.nombres || ' ' || e.apellidos as nombre_completo,
  e.fecha_nacimiento,
  p.nombre as puesto,
  a.nombre as area,
  CASE 
    WHEN EXTRACT(MONTH FROM e.fecha_nacimiento) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(DAY FROM e.fecha_nacimiento) = EXTRACT(DAY FROM CURRENT_DATE)
    THEN 'SÍ - CUMPLEAÑOS HOY 🎂'
    ELSE 'No'
  END as cumple_hoy
FROM empleados e
LEFT JOIN puestos p ON e.puesto_id = p.id
LEFT JOIN areas a ON e.area_id = a.id
WHERE e.fecha_nacimiento IS NOT NULL
ORDER BY cumple_hoy DESC, e.fecha_nacimiento;
