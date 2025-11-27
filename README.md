# 🏢 AgrovetConectAH - Sistema de Gestión de Recursos Humanos

Sistema integral de gestión de recursos humanos con módulo de vacaciones, desarrollado con React, Node.js y PostgreSQL (Supabase).

## 🚀 Características Principales

- ✅ **Autenticación JWT** con roles (Admin, RRHH, Jefe, Empleado)
- 📅 **Gestión de Vacaciones** con aprobación jerárquica
- 👥 **Dashboard RRHH** con métricas y estadísticas
- 📊 **Calendario de vacaciones** compartido
- 🔔 **Sistema de notificaciones** (en desarrollo)
- 📱 **Interfaz responsive** con Material-UI

## 🛠️ Stack Tecnológico

### Frontend
- React 19
- Material-UI (MUI)
- Vite
- Axios
- React Big Calendar
- Zustand

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- bcrypt

### Base de Datos
- Supabase (PostgreSQL)
- RPC Functions para INSERT RETURNING
- Session Pooler para conexiones

## 📦 Instalación Local

### Requisitos
- Node.js 18+
- Cuenta en Supabase

### 1. Clonar repositorio
```bash
git clone https://github.com/jonathancerda-hub/AgrovetConectAH.git
cd AgrovetConectAH
```

### 2. Instalar dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=3001
SUPABASE_URL=tu-supabase-url
SUPABASE_ANON_KEY=tu-supabase-key
PGHOST=tu-supabase-host
PGPORT=5432
PGDATABASE=postgres
PGUSER=tu-usuario
PGPASSWORD=tu-password
JWT_SECRET=tu-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`.env.development`):
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Configurar base de datos en Supabase

1. Ejecutar el script SQL: `backend/SUPABASE_EJECUTAR_ESTO.sql`
2. Crear RPC Functions: `backend/CREAR_FUNCIONES_RPC.sql`

### 5. Iniciar servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Accede a: http://localhost:5173

## 👤 Usuarios de Prueba

Ver archivo: `USUARIOS_Y_CONTRASEÑAS.md`

**Acceso RRHH:**
- Email: `ursula.huamancaja@agrovet.com`
- Password: `rrhh123`

**Acceso Admin:**
- Email: `admin@agrovet.com`
- Password: `admin123`

## 🌐 Despliegue en Producción

### Render.com + Supabase

**Guía completa**: `GUIA_DESPLIEGUE_RENDER.md`

**Comandos rápidos**: `COMANDOS_DESPLIEGUE.md`

### URLs de Producción
- Frontend: https://agrovet-frontend.onrender.com
- Backend: https://agrovet-api.onrender.com

## 📁 Estructura del Proyecto

```
AgrovetConectAH/
├── src/                          # Frontend React
│   ├── components/               # Componentes comunes
│   ├── features/                 # Módulos por funcionalidad
│   │   └── vacations/            # Módulo de vacaciones
│   │       ├── VacationsPage.jsx
│   │       └── components/
│   │           ├── AprobacionSolicitudes.jsx
│   │           ├── AvailableDays.jsx
│   │           ├── DashboardRRHH.jsx
│   │           ├── RequestForm.jsx
│   │           ├── RequestsList.jsx
│   │           ├── TeamDashboard.jsx
│   │           └── VacationCalendar.jsx
│   ├── services/                 # API services
│   └── App.jsx                   # Componente principal
├── backend/
│   ├── src/
│   │   ├── controllers/          # Controladores API
│   │   ├── routes/               # Rutas Express
│   │   ├── middleware/           # Middlewares (auth)
│   │   ├── db.js                 # Conexión Supabase
│   │   └── server.js             # Servidor principal
│   ├── SUPABASE_EJECUTAR_ESTO.sql
│   └── CREAR_FUNCIONES_RPC.sql
├── .env.development              # Variables desarrollo
├── .env.production               # Variables producción
└── render.yaml                   # Configuración Render

```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Autenticación JWT con expiración de 24h
- CORS configurado por dominio
- Variables de entorno para datos sensibles
- RLS (Row Level Security) en Supabase

## 📝 Documentación

- `GUIA_DESPLIEGUE_RENDER.md` - Guía completa de despliegue
- `COMANDOS_DESPLIEGUE.md` - Comandos rápidos
- `USUARIOS_Y_CONTRASEÑAS.md` - Credenciales de prueba
- `MANUAL_DESARROLLADOR.md` - Documentación técnica

## 🐛 Solución de Problemas

### Error: "column e.dni does not exist"
✅ **Resuelto**: La tabla `empleados` usa `codigo_empleado`, no `dni`

### Error: CORS
✅ Verificar que `CORS_ORIGIN` en backend coincida con la URL del frontend

### Base de datos no conecta
✅ Verificar credenciales de Supabase y RPC functions

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE

## 👨‍💻 Autor

**Jonathan Cerda**
- GitHub: [@jonathancerda-hub](https://github.com/jonathancerda-hub)
- Proyecto: AgrovetConectAH

## 🙏 Agradecimientos

- Agrovet Market
- Supabase
- Render.com
- Material-UI Team

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
