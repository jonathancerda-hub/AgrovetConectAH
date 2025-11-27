# 🔐 Usuarios y Contraseñas del Sistema

## Credenciales de Acceso

### 👨‍💼 Administrador
- **Email:** `admin@agrovet.com`
- **Contraseña:** `admin123`
- **Rol:** Administrador
- **Nombre:** Carlos Director
- **DNI:** 12345678
- **Puesto:** Director General
- **Permisos:** Acceso total al sistema

---

### 👥 Recursos Humanos (RRHH)
- **Email:** `ursula.huamancaja@agrovet.com`
- **Contraseña:** `rrhh123`
- **Rol:** RRHH
- **Nombre:** Ursula Huamancaja
- **DNI:** 23456789
- **Puesto:** Gerente de Talento Humano y SST
- **Permisos:**
  - Ver todas las solicitudes de vacaciones
  - Control de vacaciones de empleados
  - Dashboard RRHH
  - Historial de vacaciones
  - **NOTA:** Puede ver pero NO aprobar solicitudes

---

### 🎯 Jefes y Supervisores

#### Jefe de TI
- **Email:** `perci.mondragon@agrovet.com`
- **Contraseña:** `jefe123`
- **Rol:** Jefe
- **Nombre:** Perci Mondragon
- **DNI:** 34567890
- **Puesto:** Gerente de TI
- **Supervisor:** Carlos Director (ID: 1)
- **Permisos:**
  - Aprobar solicitudes de vacaciones de subordinados
  - Gestión de equipo

#### Coordinador de Proyectos
- **Email:** `jonathan.cerda@agrovet.com`
- **Contraseña:** `coord123`
- **Rol:** Jefe
- **Nombre:** Jorge Luis Jonathan Cerda Piaca
- **DNI:** 45678901
- **Puesto:** Coordinador de Proyectos de TI
- **Supervisor:** Perci Mondragon (ID: 3)
- **Permisos:**
  - Aprobar solicitudes de vacaciones de subordinados
  - Gestión de equipo

---

### 👷 Empleados

#### Empleado 1
- **Email:** `ana.garcia@agrovet.com`
- **Contraseña:** `emp123`
- **Rol:** Empleado
- **Nombre:** Ana García
- **DNI:** 56789012
- **Puesto:** Desarrollador Senior
- **Supervisor:** Jonathan Cerda (ID: 4)
- **Días de vacaciones:** 15
- **Permisos:**
  - Solicitar vacaciones
  - Ver su historial
  - Ver publicaciones

#### Empleado 2
- **Email:** `carlos.martinez@agrovet.com`
- **Contraseña:** `emp123`
- **Rol:** Empleado
- **Nombre:** Carlos Martínez
- **DNI:** 67890123
- **Puesto:** Desarrollador Senior
- **Supervisor:** Jonathan Cerda (ID: 4)
- **Días de vacaciones:** 12
- **Tipo contrato:** Plazo Fijo
- **Permisos:**
  - Solicitar vacaciones
  - Ver su historial
  - Ver publicaciones

#### Empleado 3
- **Email:** `laura.rodriguez@agrovet.com`
- **Contraseña:** `emp123`
- **Rol:** Empleado
- **Nombre:** Laura Rodríguez
- **DNI:** 78901234
- **Puesto:** Analista de RRHH
- **Supervisor:** Ursula Huamancaja (ID: 2)
- **Días de vacaciones:** 18
- **Permisos:**
  - Solicitar vacaciones
  - Ver su historial
  - Ver publicaciones

#### Empleado 4
- **Email:** `pedro.sanchez@agrovet.com`
- **Contraseña:** `emp123`
- **Rol:** Empleado
- **Nombre:** Pedro Sánchez
- **DNI:** 89012345
- **Puesto:** Asistente Administrativo
- **Supervisor:** Ursula Huamancaja (ID: 2)
- **Días de vacaciones:** 10
- **Tipo contrato:** Prácticas
- **Permisos:**
  - Solicitar vacaciones
  - Ver su historial
  - Ver publicaciones

---

## 📊 Jerarquía Organizacional

```
Carlos Director (Admin)
│
├─── Perci Mondragon (Jefe TI)
│    │
│    └─── Jonathan Cerda (Coordinador)
│         │
│         ├─── Ana García (Empleado)
│         └─── Carlos Martínez (Empleado)
│
└─── Ursula Huamancaja (RRHH)
     │
     ├─── Laura Rodríguez (Empleado)
     └─── Pedro Sánchez (Empleado)
```

---

## 🔒 Información de Seguridad

### Hash de Contraseñas
Todas las contraseñas están hasheadas con **bcrypt (10 rounds)**:
- Hash usado: `$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe`

### Contraseñas por Tipo
- **admin123** → Administrador
- **rrhh123** → RRHH
- **jefe123** → Jefes y Coordinadores
- **coord123** → Coordinador
- **emp123** → Empleados

---

## 🧪 Escenarios de Prueba

### Escenario 1: Aprobar Vacaciones (Flujo Completo)
1. **Login como empleado** (ana.garcia@agrovet.com / emp123)
2. Ir a **Vacaciones > Formulario de Solicitud**
3. Solicitar 5 días de vacaciones
4. **Logout**
5. **Login como supervisor** (jonathan.cerda@agrovet.com / coord123)
6. Ir a **Vacaciones > Aprobar Solicitudes**
7. Ver solicitud de Ana García
8. Aprobar con comentarios

### Escenario 2: Vista RRHH (Solo Lectura)
1. **Login como RRHH** (ursula.huamancaja@agrovet.com / rrhh123)
2. Ir a **Vacaciones > Aprobar Solicitudes**
3. Verificar que aparece: "Seguimiento de Solicitudes (RRHH)"
4. Ver TODAS las solicitudes de la empresa
5. **NO debe haber botones de Aprobar/Rechazar**

### Escenario 3: Asignar Rol RRHH
1. **Login como admin** (admin@agrovet.com / admin123)
2. Ir a **Gestión de Empleados**
3. Buscar a Ana García
4. Activar el **Switch RRHH**
5. **Logout y Login** como Ana García
6. Ir a **Vacaciones > Aprobar Solicitudes**
7. Ahora puede ver todas las solicitudes (pero no aprobar)

### Escenario 4: Rechazo con Comentarios Obligatorios
1. **Login como supervisor** (jonathan.cerda@agrovet.com / coord123)
2. Ir a **Vacaciones > Aprobar Solicitudes**
3. Seleccionar solicitud pendiente
4. Click en botón **Rechazar** (X rojo)
5. Intentar enviar sin comentarios → **Error**
6. Agregar comentarios: "Periodo muy ocupado"
7. Click en **Rechazar** → **Exitoso**

---

## 📝 Notas Importantes

1. **Cambiar Contraseñas en Producción**: Estas son contraseñas de desarrollo, **DEBEN** cambiarse antes de ir a producción

2. **Primera Configuración**: Si la base de datos está vacía, ejecutar:
   ```bash
   cd backend
   node -e "import('pg').then(pg => { import('dotenv').then(dotenv => { dotenv.default.config(); const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); client.connect().then(() => { import('fs').then(fs => { const sql = fs.default.readFileSync('database/seeds.sql', 'utf8'); client.query(sql).then(() => { console.log('Seeds ejecutados exitosamente'); client.end(); }); }); }); }); })"
   ```

3. **Permisos por Rol**:
   - **admin**: Acceso total
   - **rrhh**: Ver todas las solicitudes (no aprobar)
   - **jefe**: Aprobar solicitudes de subordinados directos
   - **empleado**: Solicitar vacaciones, ver su historial

4. **Columna es_rrhh**: Por defecto es `FALSE`. Se puede cambiar desde:
   - Gestión de Empleados (toggle switch)
   - API: `PUT /api/empleados/:id/rrhh` con body `{ es_rrhh: true }`

5. **Jerarquía**: La aprobación se basa en `supervisor_id` de la tabla `empleados`
