# 🔄 Actualizar Datos de Prueba

## Problema Detectado
Las solicitudes de vacaciones en la base de datos no estaban correctamente configuradas para que los jefes puedan ver las solicitudes de sus subordinados.

## Solución Aplicada

### Cambios Realizados:

1. **Corregido controlador de aprobación** (`backend/src/controllers/aprobacion.controller.js`):
   - Cambiado `empleadoId` → `empleado_id` (consistente con middleware)
   - Agregados logs de debugging

2. **Actualizado seeds.sql**:
   - Estados en minúsculas: `'pendiente'`, `'aprobada'` (no `'Pendiente'`, `'Aprobado'`)
   - Agregado campo obligatorio `dias_calendario`
   - Agregados campos obligatorios `mes_solicitud` y `anio_solicitud`
   - Creadas 3 solicitudes de prueba:
     - Ana García → Jonathan Cerda (pendiente)
     - Carlos Martínez → Jonathan Cerda (pendiente)
     - Laura Rodríguez → Ursula Huamancaja (aprobada)

## 🚀 Ejecutar Actualización

### Opción 1: Reinsertar solo las solicitudes (recomendado)

```powershell
cd backend
node -e "import('pg').then(pg => { import('dotenv').then(dotenv => { dotenv.default.config(); const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); client.connect().then(() => { const sql = 'DELETE FROM solicitudes_vacaciones; INSERT INTO solicitudes_vacaciones (empleado_id, fecha_inicio, fecha_fin, dias_solicitados, dias_calendario, mes_solicitud, anio_solicitud, estado, comentarios) VALUES (5, ''2025-12-22'', ''2025-12-26'', 5, 5, 12, 2025, ''pendiente'', ''Vacaciones de fin de año''), (6, ''2025-12-15'', ''2025-12-20'', 5, 6, 12, 2025, ''pendiente'', ''Viaje familiar''), (7, ''2025-10-10'', ''2025-10-15'', 5, 6, 10, 2025, ''aprobada'', ''Descanso programado'');'; client.query(sql).then(() => { console.log('✅ Solicitudes actualizadas'); client.end(); }).catch(err => { console.error('❌ Error:', err.message); client.end(); }); }); }); })"
```

### Opción 2: Ejecutar seeds completo

```powershell
cd backend
node -e "import('pg').then(pg => { import('dotenv').then(dotenv => { dotenv.default.config(); const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); client.connect().then(() => { import('fs').then(fs => { const sql = fs.default.readFileSync('database/seeds.sql', 'utf8'); client.query(sql).then(() => { console.log('✅ Seeds ejecutados exitosamente'); client.end(); }).catch(err => { console.error('❌ Error:', err.message); client.end(); }); }); }); }); })"
```

## ✅ Verificación

Después de ejecutar el comando:

1. **Reiniciar el backend** si está corriendo
2. **Login como Jonathan** (`jonathan.cerda@agrovet.com` / `coord123`)
3. Ir a **Vacaciones > Aprobar Solicitudes**
4. Deberías ver 2 solicitudes pendientes:
   - Ana García: 22-26 Dic (5 días)
   - Carlos Martínez: 15-20 Dic (5 días)

## 🔍 Debugging

Si no ves las solicitudes, revisa los logs del backend:
- `👤 Usuario solicitante:` debe mostrar tu `empleado_id`
- `📊 Query params:` debe mostrar `[4]` (ID de Jonathan)
- `📋 Solicitudes encontradas:` debe mostrar `2`

## 📊 Estructura de Datos Esperada

```
Empleados:
- ID 4: Jonathan Cerda (Coordinador)
- ID 5: Ana García (subordinada de Jonathan)
- ID 6: Carlos Martínez (subordinado de Jonathan)
- ID 7: Laura Rodríguez (subordinada de Ursula)

Solicitudes:
- Sol. 1: Ana (empleado_id=5) → supervisor=Jonathan (4) → PENDIENTE
- Sol. 2: Carlos (empleado_id=6) → supervisor=Jonathan (4) → PENDIENTE  
- Sol. 3: Laura (empleado_id=7) → supervisor=Ursula (2) → APROBADA
```

## ⚠️ Nota Importante

Si ya tienes solicitudes existentes que quieres conservar, NO uses la Opción 1 (que borra todas las solicitudes). En su lugar:
1. Edita manualmente las solicitudes existentes en la base de datos
2. Asegúrate de que tengan los campos obligatorios: `dias_calendario`, `mes_solicitud`, `anio_solicitud`
3. Verifica que el estado esté en minúsculas: `'pendiente'`, `'aprobada'`, `'rechazada'`
