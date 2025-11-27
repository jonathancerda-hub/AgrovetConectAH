# Guía de Pruebas - Sistema de Aprobación de Vacaciones

## Funcionalidades Implementadas

### Backend
✅ Columna `es_rrhh` agregada a tabla `empleados`
✅ Endpoints de aprobación en `/api/aprobacion`
✅ Lógica de permisos por jerarquía (supervisor_id)
✅ Protección: RRHH no puede aprobar (solo visualizar)

### Frontend
✅ Componente AprobacionSolicitudes creado
✅ Toggle RRHH en GestionEmpleados
✅ Servicios aprobacionService y empleadosService actualizados
✅ Integración en menú de Vacaciones

## Pasos para Probar

### 1. Asignar Rol RRHH a un Empleado

1. Ir a **Gestión de Empleados** (menú principal)
2. En la tabla de empleados, encontrar columna **RRHH**
3. Activar el switch para un empleado de prueba (ej: Maria Gómez)
4. El empleado ahora tiene permisos para ver todas las solicitudes

### 2. Crear Solicitud de Vacaciones como Empleado

1. Iniciar sesión como un empleado subordinado (no RRHH, no supervisor)
2. Ir a **Vacaciones > Formulario de Solicitud**
3. Completar datos:
   - Fecha inicio
   - Fecha fin
   - Motivo (opcional)
4. Enviar solicitud
5. Estado inicial: **Pendiente**

### 3. Verificar Visibilidad RRHH (Solo Lectura)

1. Cerrar sesión y entrar como usuario RRHH (el que activaste en paso 1)
2. Ir a **Vacaciones > Aprobar Solicitudes**
3. Verificar que aparece título: "Seguimiento de Solicitudes (RRHH)"
4. Verificar mensaje: "Como usuario de RRHH, puedes ver todas las solicitudes pero no aprobarlas"
5. **Importante**: Verificar que NO hay botones de Aprobar/Rechazar
6. Solo debe aparecer icono de "Ver" (deshabilitado para pendientes)

### 4. Aprobar/Rechazar como Supervisor

1. Cerrar sesión y entrar como supervisor del empleado (buscar en campo `supervisor_id`)
2. Ir a **Vacaciones > Aprobar Solicitudes**
3. Verificar que aparece título: "Aprobación de Solicitudes"
4. Verificar mensaje: "Como supervisor, puedes aprobar o rechazar..."
5. Encontrar solicitud del subordinado con estado **Pendiente**
6. Ver datos: Empleado, Puesto, Área, Fechas, Días

**Para Aprobar:**
- Click en icono verde ✓ (CheckCircle)
- Agregar comentarios (opcional)
- Click en "Aprobar"
- Verificar que días de vacaciones se deducen del empleado

**Para Rechazar:**
- Click en icono rojo ✕ (Cancel)
- Agregar comentarios (OBLIGATORIO)
- Click en "Rechazar"
- Verificar que estado cambia a "Rechazado"

### 5. Verificar Restricciones de Permisos

**Caso 1: RRHH intenta aprobar (debe fallar)**
1. Como usuario RRHH, intentar hacer petición manual desde DevTools:
```javascript
fetch('http://localhost:3001/api/aprobacion/solicitudes/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <token>' },
  body: JSON.stringify({ accion: 'aprobar' })
})
```
2. Debe recibir error 403: "Los usuarios de RRHH no pueden aprobar solicitudes"

**Caso 2: Supervisor intenta aprobar solicitud de otro equipo (debe fallar)**
1. Como supervisor A, intentar aprobar solicitud de subordinado de supervisor B
2. Debe recibir error 403: "No tienes permiso para aprobar esta solicitud"

**Caso 3: Supervisor sin subordinados**
1. Como supervisor sin empleados a cargo
2. Ir a "Aprobar Solicitudes"
3. Debe ver mensaje: "No hay solicitudes de tus subordinados"

### 6. Verificar Deducción de Días

1. Antes de aprobar, ir a **Gestión de Empleados**
2. Buscar empleado solicitante, anotar días de vacaciones (ej: 15)
3. Como supervisor, aprobar solicitud de 5 días
4. Volver a **Gestión de Empleados**
5. Verificar que ahora tiene 10 días disponibles (15 - 5)

## Endpoints para Pruebas Manuales

### Listar Solicitudes (GET)
```bash
GET http://localhost:3001/api/aprobacion/solicitudes
Headers: Authorization: Bearer <token>
```

**Respuesta esperada (Supervisor):**
```json
{
  "solicitudes": [
    {
      "id": 1,
      "empleado_id": 5,
      "nombre_empleado": "Juan Pérez",
      "dni": "12345678",
      "puesto": "Analista",
      "area": "IT",
      "fecha_inicio": "2025-02-01",
      "fecha_fin": "2025-02-05",
      "dias_solicitados": 5,
      "estado": "Pendiente",
      "motivo": "Descanso familiar"
    }
  ],
  "esRRHH": false
}
```

**Respuesta esperada (RRHH):**
```json
{
  "solicitudes": [
    // TODAS las solicitudes de la empresa
  ],
  "esRRHH": true
}
```

### Aprobar Solicitud (PUT)
```bash
PUT http://localhost:3001/api/aprobacion/solicitudes/1
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "accion": "aprobar",
  "comentarios": "Aprobado por desempeño"
}
```

### Rechazar Solicitud (PUT)
```bash
PUT http://localhost:3001/api/aprobacion/solicitudes/1
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "accion": "rechazar",
  "comentarios": "Periodo muy ocupado" // OBLIGATORIO
}
```

### Asignar Rol RRHH (PUT)
```bash
PUT http://localhost:3001/api/empleados/5/rrhh
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "es_rrhh": true
}
```

## Casos de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 403: Los usuarios de RRHH no pueden aprobar | Usuario con `es_rrhh=true` intenta aprobar | Solo supervisores directos pueden aprobar |
| 403: No tienes permiso para aprobar esta solicitud | Supervisor no es el `supervisor_id` del empleado | Revisar jerarquía en tabla empleados |
| 400: Los comentarios son obligatorios al rechazar | Falta campo `comentarios` en rechazo | Agregar comentarios no vacíos |
| 404: Solicitud no encontrada | `solicitudId` no existe | Verificar ID en tabla solicitudes_vacaciones |
| 400: Solo puedes aprobar o rechazar solicitudes pendientes | Solicitud ya procesada | Estado debe ser 'Pendiente' |
| 400: No tienes suficientes días de vacaciones | Empleado sin días disponibles | Revisar `dias_vacaciones` en empleados |

## Estructura de la Base de Datos

### Tabla empleados (Columnas relevantes)
```sql
- id (int)
- supervisor_id (int, nullable) -- ID del supervisor directo
- es_rrhh (boolean) -- true si puede ver todas las solicitudes
- dias_vacaciones (int) -- Días disponibles
```

### Tabla solicitudes_vacaciones
```sql
- id (int)
- empleado_id (int) -- Quien solicita
- fecha_inicio (date)
- fecha_fin (date)
- dias_solicitados (int)
- estado (varchar) -- 'Pendiente', 'Aprobado', 'Rechazado'
- aprobador_id (int, nullable) -- Quien aprobó/rechazó
- comentarios_aprobador (text)
- motivo (text) -- Motivo del empleado
```

## Checklist Final

- [ ] Migración ejecutada sin errores
- [ ] Backend iniciado en puerto 3001
- [ ] Frontend iniciado en puerto 5173
- [ ] Toggle RRHH visible en Gestión de Empleados
- [ ] Empleado RRHH puede ver todas las solicitudes
- [ ] Empleado RRHH NO puede aprobar (botones ocultos)
- [ ] Supervisor puede aprobar solicitudes de subordinados
- [ ] Supervisor NO puede aprobar solicitudes de otros equipos
- [ ] Días de vacaciones se deducen correctamente al aprobar
- [ ] Comentarios obligatorios al rechazar
- [ ] Estados se actualizan correctamente en la tabla

## Notas Adicionales

- **Jerarquía**: El sistema usa `supervisor_id` para determinar quién puede aprobar
- **RRHH vs Supervisor**: RRHH es un rol de **monitoreo**, no de **aprobación**
- **Seguridad**: Todas las validaciones se hacen en backend, frontend es solo UI
- **Transacciones**: La aprobación usa transacciones SQL para garantizar consistencia
- **Auditoría**: Cada aprobación/rechazo registra `aprobador_id` y `comentarios_aprobador`
