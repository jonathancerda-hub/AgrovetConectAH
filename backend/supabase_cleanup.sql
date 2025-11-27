-- ==========================================
-- LIMPIEZA COMPLETA DE DATOS
-- Sistema AgroVet Conecta
-- ==========================================

-- Eliminar todos los datos en orden inverso de dependencias
DELETE FROM solicitudes_vacaciones;
DELETE FROM periodos_vacacionales;
DELETE FROM usuarios;
DELETE FROM empleados;
DELETE FROM puestos;
DELETE FROM areas;
DELETE FROM tipos_trabajador;

-- Reiniciar secuencias (opcional, para IDs desde 1)
ALTER SEQUENCE IF EXISTS solicitudes_vacaciones_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS periodos_vacacionales_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS empleados_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS puestos_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS areas_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tipos_trabajador_id_seq RESTART WITH 1;

-- Confirmación
SELECT 'Limpieza completada' as mensaje;
