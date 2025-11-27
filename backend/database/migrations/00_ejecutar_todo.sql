-- ============================================
-- SCRIPT COMPLETO DE MIGRACIÓN A SUPABASE
-- Ejecuta TODAS las migraciones en orden
-- ============================================

-- Este script combina todas las migraciones en el orden correcto
-- para crear la base de datos completa desde cero

\echo '🚀 Iniciando migración completa a Supabase...'
\echo ''

-- MIGRACIÓN 01: Estructura base
\echo '📦 Ejecutando migración 01: Estructura base...'
\i 01_estructura_base.sql

-- MIGRACIÓN 02: Sistema de usuarios
\echo '👥 Ejecutando migración 02: Sistema de usuarios...'
\i 02_sistema_usuarios.sql

-- MIGRACIÓN 03: Gestión de empleados
\echo '👤 Ejecutando migración 03: Gestión de empleados...'
\i 03_gestion_empleados.sql

-- MIGRACIÓN 04: Comunicaciones
\echo '📢 Ejecutando migración 04: Comunicaciones...'
\i 04_comunicaciones.sql

-- MIGRACIÓN 05: Sistema de vacaciones
\echo '🏖️ Ejecutando migración 05: Sistema de vacaciones...'
\i 05_sistema_vacaciones.sql

-- MIGRACIÓN 06: Gestión de documentos
\echo '📄 Ejecutando migración 06: Gestión de documentos...'
\i 06_gestion_documentos.sql

-- MIGRACIÓN 07: Tablas adicionales
\echo '📊 Ejecutando migración 07: Tablas adicionales...'
\i 07_tablas_adicionales.sql

-- MIGRACIÓN 08: Columna es_rrhh
\echo '🔐 Ejecutando migración 08: Columna es_rrhh...'
\i 08_agregar_es_rrhh.sql

-- MIGRACIÓN 09: Columnas de auditoría
\echo '📝 Ejecutando migración 09: Columnas de auditoría...'
\i 09_agregar_columnas_auditoria.sql

\echo ''
\echo '✅ Migración completa exitosa!'
\echo ''
\echo 'Próximo paso: Ejecutar seeds.sql para insertar datos de prueba'
