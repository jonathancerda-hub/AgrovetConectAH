# Scripts de Mantenimiento

## Scripts Activos

### agregar-created-at.js / agregar-created-at-directo.js
- **Propósito**: Agregar columna created_at a tablas existentes
- **Uso**: `node agregar-created-at.js`

### arreglar-dias-calendario.js
- **Propósito**: Corregir cálculo de días en calendario
- **Uso**: `node arreglar-dias-calendario.js`

### ejecutar-fusion-empleados.js
- **Propósito**: Fusionar datos de empleados de diferentes fuentes
- **Uso**: `node ejecutar-fusion-empleados.js`

### ejecutar-migraciones.js
- **Propósito**: Ejecutar migraciones de base de datos
- **Uso**: `node ejecutar-migraciones.js`

### recalcular-saldos.js
- **Propósito**: Recalcular saldos de vacaciones de empleados
- **Uso**: `node recalcular-saldos.js`

## Notas
- Todos los scripts requieren variables de entorno configuradas en `.env`
- Hacer backup antes de ejecutar scripts de migración
- Estos scripts son para mantenimiento y debugging, NO para producción
