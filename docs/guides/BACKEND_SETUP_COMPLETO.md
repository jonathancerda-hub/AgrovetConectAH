# 🚀 BACKEND Y BASE DE DATOS CONFIGURADOS

## ✅ LO QUE YA ESTÁ FUNCIONANDO

### 1. **Base de Datos PostgreSQL en Render**
- ✅ 19 tablas creadas
- ✅ 8 usuarios de prueba insertados
- ✅ 3 publicaciones de ejemplo
- ✅ 3 solicitudes de vacaciones
- ✅ Relaciones y constraints configurados

**URL de Conexión:**
```
postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta
```

### 2. **Backend API REST (Node.js + Express)**
- ✅ Servidor corriendo en `http://localhost:3001`
- ✅ Conexión a PostgreSQL funcionando
- ✅ Autenticación JWT implementada
- ✅ CORS configurado para el frontend

**Endpoints Disponibles:**
- `GET /health` - Estado del servidor y BD
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `GET /api/empleados` - Listar todos los empleados (para Dashboard RRHH)
- `GET /api/publicaciones` - Listar publicaciones
- `POST /api/publicaciones` - Crear publicación
- `POST /api/publicaciones/:id/reaccionar` - Reaccionar
- `POST /api/publicaciones/:id/comentar` - Comentar
- `GET /api/notificaciones` - Listar notificaciones
- `PUT /api/notificaciones/:id/leer` - Marcar leída
- `DELETE /api/notificaciones/:id` - Eliminar

---

## 👤 USUARIOS DE PRUEBA

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| admin@agrovet.com | admin123 | admin | Administrador del sistema |
| ursula.huamancaja@agrovet.com | rrhh123 | rrhh | Gerente de RRHH |
| perci.mondragon@agrovet.com | jefe123 | jefe | Gerente de TI |
| jonathan.cerda@agrovet.com | coord123 | jefe | Coordinador de Proyectos |
| ana.garcia@agrovet.com | emp123 | empleado | Desarrolladora |
| carlos.martinez@agrovet.com | emp123 | empleado | Desarrollador |
| laura.rodriguez@agrovet.com | emp123 | empleado | Analista RRHH |
| pedro.sanchez@agrovet.com | emp123 | empleado | Asistente |

---

## 🧪 PROBAR LA API

### Prueba 1: Health Check
```bash
# En PowerShell
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-05T..."
}
```

### Prueba 2: Login
```bash
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@agrovet.com","password":"admin123"}'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@agrovet.com",
    "rol": "admin",
    "empleadoId": 1,
    "nombres": "Carlos",
    "apellidos": "Director"
  }
}
```

### Prueba 3: Obtener Publicaciones (requiere token)
```bash
# Primero guarda el token del login anterior
$token = "TU_TOKEN_AQUI"

curl -H "Authorization: Bearer $token" http://localhost:3001/api/publicaciones
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
reac/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── empleados.controller.js (nuevo - Dashboard RRHH)
│   │   │   ├── publicaciones.controller.js
│   │   │   └── notificaciones.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── empleados.routes.js (nuevo)
│   │   │   ├── publicaciones.routes.js
│   │   │   └── notificaciones.routes.js
│   │   ├── db.js
│   │   └── server.js
│   ├── .env (CORS_ORIGIN actualizado a localhost:5173)
│   └── package.json
├── database/
│   ├── migrations/
│   │   ├── 01_estructura_organizacional.sql
│   │   ├── 02_usuarios_empleados.sql
│   │   ├── 03_solicitudes_vacaciones.sql
│   │   ├── 04_publicaciones_social.sql
│   │   ├── 05_notificaciones_sistema.sql
│   │   └── 06_utilidades_auditoria.sql
│   ├── seeds.sql
│   └── migrate.js
├── src/
│   └── features/
│       └── vacations/
│           └── components/
│               ├── DashboardRRHH.jsx (nuevo - consume API empleados)
│               ├── GestionEmpleados.jsx (referencia de estilo)
│               └── ...
└── reglas.md (actualizado con estilo de tablas)
```

---

## 🔄 PRÓXIMOS PASOS PARA CONECTAR EL FRONTEND

### Paso 1: Instalar Axios en el Frontend
```bash
cd c:\Users\jcerda\Desktop\reac
npm install axios
```

### Paso 2: Crear Servicio API
Crear `src/services/api.js`:
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Paso 3: Crear Servicio de Auth
Crear `src/services/auth.service.js`:
```javascript
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
```

### Paso 4: Actualizar Login Component
En `src/features/vacations/components/Login.jsx`:
```javascript
import { authService } from '../../services/auth.service';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await authService.login(email, password);
    onLogin(data.user);
  } catch (error) {
    console.error('Error de login:', error);
    alert('Credenciales incorrectas');
  }
};
```

### Paso 5: Obtener Publicaciones Reales
En `Portal.jsx` o en `App.jsx`:
```javascript
import api from './services/api';

useEffect(() => {
  const fetchPublicaciones = async () => {
    try {
      const response = await api.get('/publicaciones');
      setPublicaciones(response.data);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  };
  
  fetchPublicaciones();
}, []);
```

### Paso 6: Obtener Notificaciones Reales
En `NotificationPanel.jsx`:
```javascript
import api from '../../services/api';

useEffect(() => {
  const fetchNotificaciones = async () => {
    try {
      const response = await api.get('/notificaciones/no-leidas');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };
  
  fetchNotificaciones();
}, []);

const handleMarkAsRead = async (id) => {
  try {
    await api.put(`/notificaciones/${id}/leer`);
    // Actualizar estado local
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, leido: true } : n
    ));
  } catch (error) {
    console.error('Error al marcar como leída:', error);
  }
};
```

---

## 🛠️ COMANDOS ÚTILES

### Iniciar Backend
```bash
cd c:\Users\jcerda\Desktop\reac\backend
npm start
```

### Iniciar Frontend (en otra terminal)
```bash
cd c:\Users\jcerda\Desktop\reac
npm run dev
```

### Re-ejecutar Migraciones (si necesitas resetear la BD)
```bash
cd c:\Users\jcerda\Desktop\reac
node database/migrate.js
```

### Ver Logs del Backend
El backend muestra logs en tiempo real de todas las peticiones en modo desarrollo.

---

## 🔐 SEGURIDAD

**IMPORTANTE:** Antes de subir a producción:

1. Cambiar `JWT_SECRET` en `.env`
2. Usar variables de entorno en Render para las credenciales
3. Habilitar rate limiting
4. Configurar HTTPS
5. Validar todos los inputs
6. Implementar refresh tokens

---

## 📊 ESTADO DE TABLAS EN LA BASE DE DATOS

| Tabla | Registros | Estado |
|-------|-----------|--------|
| empresas | 1 | ✅ |
| divisiones | 3 | ✅ |
| areas | 4 | ✅ |
| usuarios | 8 | ✅ |
| empleados | 8 | ✅ |
| puestos | 9 | ✅ |
| publicaciones | 3 | ✅ |
| solicitudes_vacaciones | 3 | ✅ |
| notificaciones | 3 | ✅ |
| beneficios | 4 | ✅ |
| empleado_beneficios | 18 | ✅ |

**Otras tablas vacías (listas para usar):**
- comentarios_publicaciones
- reacciones_publicaciones
- solicitudes_colaborador
- documentos_empleados
- boletas_pago
- calendario_eventos
- tareas_pendientes
- auditoria

---

## 🎯 ENDPOINTS PENDIENTES POR IMPLEMENTAR

### Vacaciones
- `GET /api/vacaciones` - Listar solicitudes
- `POST /api/vacaciones` - Crear solicitud
- `PUT /api/vacaciones/:id/aprobar` - Aprobar
- `PUT /api/vacaciones/:id/rechazar` - Rechazar
- `GET /api/vacaciones/pendientes` - Pendientes de aprobar

### Empleados
- `GET /api/empleados` - Listar empleados
- `GET /api/empleados/:id` - Ver empleado
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `GET /api/empleados/:id/subordinados` - Ver equipo

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/equipo` - Stats del equipo

---

## 📝 NOTAS

- El backend está usando **JWT** para autenticación
- Los tokens expiran en **24 horas**
- Las contraseñas están hasheadas con **bcrypt**
- La base de datos está en **Render (Oregon region)**
- El plan gratuito de Render tiene límite de conexiones y se suspende después de 15 min de inactividad

---

**Fecha de implementación:** 5 de noviembre de 2025
**Versión:** 1.0.0
