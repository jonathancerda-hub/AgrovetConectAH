# 🛠️ Manual de Desarrollador - AgroVet Conecta

## Índice

1. [Introducción](#introducción)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Software](#arquitectura-del-software)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Configuración del Entorno](#configuración-del-entorno)
6. [Base de Datos](#base-de-datos)
7. [API Backend](#api-backend)
8. [Frontend React](#frontend-react)
9. [Guía de Desarrollo](#guía-de-desarrollo)
10. [Despliegue](#despliegue)
11. [Mantenimiento](#mantenimiento)

---

## Introducción

**AgroVet Conecta** es una aplicación web full-stack para la gestión de recursos humanos. Este manual está dirigido a desarrolladores que necesiten entender, mantener o extender el sistema.

### Propósito del Sistema

- Gestión integral de empleados
- Sistema de solicitud y aprobación de vacaciones
- Portal de comunicaciones internas
- Dashboard de métricas y estadísticas

### Audiencia

- Desarrolladores Full Stack
- Desarrolladores Backend (Node.js)
- Desarrolladores Frontend (React)
- DevOps y Administradores de Sistema

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | Framework de UI |
| **Vite** | 7.1.9 | Build tool y dev server |
| **Material-UI (MUI)** | 7.0.0 | Biblioteca de componentes UI |
| **React Router** | 7.1.1 | Enrutamiento SPA |
| **Axios** | 1.7.9 | Cliente HTTP |
| **Moment.js** | 2.30.1 | Manejo de fechas |
| **Recharts** | 2.15.0 | Gráficos y visualizaciones |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 4.21.2 | Framework web |
| **PostgreSQL** | 15+ | Base de datos relacional |
| **pg** | 8.13.1 | Driver de PostgreSQL |
| **bcryptjs** | 2.4.3 | Hash de contraseñas |
| **jsonwebtoken** | 9.0.2 | Autenticación JWT |
| **dotenv** | 16.4.7 | Variables de entorno |
| **cors** | 2.8.5 | Control de acceso HTTP |

### Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **Git** | Control de versiones |
| **VS Code** | Editor de código |
| **Postman** | Testing de APIs |
| **pgAdmin** | Administración de PostgreSQL |
| **ESLint** | Linting de código |

### Infraestructura

| Servicio | Uso |
|----------|-----|
| **Render** | Hosting de base de datos PostgreSQL |
| **Local** | Desarrollo (backend en puerto 3001, frontend en 5173) |

---

## Arquitectura del Software

### Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         React Frontend (Port 5173)             │    │
│  │  - Components (UI)                             │    │
│  │  - Services (API Clients)                      │    │
│  │  - State Management (Local)                    │    │
│  └───────────────────┬────────────────────────────┘    │
└────────────────────────┼───────────────────────────────┘
                         │ HTTP/HTTPS
                         │ (Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js Backend (Port 3001)                 │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Express Server                     │    │
│  │  - Routes (API Endpoints)                      │    │
│  │  - Controllers (Business Logic)                │    │
│  │  - Services (Data Processing)                  │    │
│  │  - Middleware (Auth, CORS, Error Handling)     │    │
│  └───────────────────┬────────────────────────────┘    │
└────────────────────────┼───────────────────────────────┘
                         │ SQL Queries
                         │ (pg Pool)
                         ▼
┌─────────────────────────────────────────────────────────┐
│            PostgreSQL Database (Render)                  │
│                                                          │
│  - empleados                                            │
│  - usuarios                                             │
│  - solicitudes_vacaciones                               │
│  - publicaciones                                        │
│  - notificaciones                                       │
│  - areas, puestos, divisiones                           │
└─────────────────────────────────────────────────────────┘
```

### Patrón de Arquitectura

**Patrón**: MVC (Model-View-Controller) Adaptado

- **Model**: PostgreSQL + Servicios de datos
- **View**: React Components
- **Controller**: Express Controllers
- **Service Layer**: Lógica de negocio

### Flujo de Datos

```
User Action → React Component → Service → Axios → 
Backend Route → Controller → Database → 
Response → Frontend → Update UI
```

### Autenticación y Autorización

**Estrategia**: JWT (JSON Web Tokens)

```
1. Login → Validación → Generar JWT → Enviar Token
2. Request → Header Authorization → Validar JWT → Permitir/Denegar
3. Token expira en 24 horas
```

**Middleware de Autenticación**:
```javascript
// backend/src/middleware/auth.js
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};
```

---

## Estructura del Proyecto

### Frontend (`/reac`)

```
reac/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   └── Login.jsx              # Componente de login
│   │   ├── employees/
│   │   │   └── GestionEmpleados.jsx   # CRUD de empleados
│   │   └── vacations/
│   │       ├── VacationsPage.jsx      # Página principal
│   │       └── components/
│   │           ├── ApprovalDashboard.jsx
│   │           ├── AvailableDays.jsx
│   │           ├── RequestForm.jsx    # Formulario de solicitud
│   │           ├── RequestsList.jsx
│   │           ├── VacationCalendar.jsx
│   │           ├── TeamDashboard.jsx
│   │           ├── DashboardRRHH.jsx  # Dashboard de RRHH
│   │           ├── ControlVacacionesEmpleado.jsx
│   │           ├── HistorialVacaciones.jsx
│   │           ├── Portal.jsx         # Portal de empleados
│   │           └── NewBulletinForm.jsx
│   ├── services/
│   │   ├── api.js                     # Configuración de Axios
│   │   ├── auth.service.js
│   │   ├── empleados.service.js
│   │   ├── publicaciones.service.js
│   │   └── notificaciones.service.js
│   ├── App.jsx                        # Componente principal
│   ├── main.jsx                       # Entry point
│   └── index.css
├── public/
├── .env                               # Variables de entorno
├── vite.config.js                     # Configuración de Vite
└── package.json
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js         # Login, registro
│   │   ├── empleados.controller.js    # CRUD empleados
│   │   ├── vacaciones.controller.js   # Gestión de vacaciones
│   │   ├── publicaciones.controller.js
│   │   └── notificaciones.controller.js
│   ├── services/
│   │   └── vacaciones.service.js      # Lógica de negocio
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── empleados.routes.js
│   │   ├── vacaciones.routes.js
│   │   ├── publicaciones.routes.js
│   │   └── notificaciones.routes.js
│   ├── middleware/
│   │   └── auth.js                    # Verificación JWT
│   ├── db.js                          # Pool de PostgreSQL
│   └── server.js                      # Servidor Express
├── database/
│   └── migrations/
│       ├── 01_schema_base.sql
│       ├── 02_usuarios_empleados.sql
│       ├── 03_areas_puestos.sql
│       ├── 04_datos_empleados.sql
│       └── 05_sistema_vacaciones.sql
├── .env                               # Variables de entorno
└── package.json
```

---

## Configuración del Entorno

### Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **PostgreSQL**: v15 o superior
- **Git**: Para control de versiones

### Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/jonathancerda-hub/AgrovetConectAH.git
cd AgrovetConectAH
```

#### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
# Configuración del Backend
NODE_ENV=development
PORT=3001

# Base de Datos PostgreSQL
DATABASE_URL=postgresql://usuario:password@host:5432/database

# JWT Secret
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# CORS Origin
CORS_ORIGIN=http://localhost:5173
```

#### 3. Configurar Base de Datos

```bash
# Ejecutar migraciones en orden
psql -U usuario -d database -f database/migrations/01_schema_base.sql
psql -U usuario -d database -f database/migrations/02_usuarios_empleados.sql
psql -U usuario -d database -f database/migrations/03_areas_puestos.sql
psql -U usuario -d database -f database/migrations/04_datos_empleados.sql
psql -U usuario -d database -f database/migrations/05_sistema_vacaciones.sql
```

#### 4. Configurar Frontend

```bash
cd ../reac
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3001
```

### Ejecutar en Desarrollo

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd reac
npm run dev
```

Acceder a: `http://localhost:5173`

---

## Base de Datos

### Diagrama ER (Entidad-Relación)

```
┌─────────────────┐       ┌─────────────────┐
│    usuarios     │       │    empleados    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ email           │   │   │ dni             │
│ password        │   └───│ usuario_id (FK) │
│ rol             │       │ nombres         │
│ created_at      │       │ apellidos       │
└─────────────────┘       │ puesto_id (FK)  │
                          │ area_id (FK)    │
                          │ supervisor_id   │
                          │ dias_vacaciones │
                          └─────────────────┘
                                  │
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │  solicitudes_vacaciones     │
                    ├─────────────────────────────┤
                    │ id (PK)                     │
                    │ empleado_id (FK)            │
                    │ fecha_inicio                │
                    │ fecha_fin                   │
                    │ dias_solicitados            │
                    │ estado                      │
                    │ aprobador_id (FK)           │
                    │ motivo                      │
                    └─────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    areas        │       │    puestos      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ nombre          │       │ nombre          │
│ centro_costos   │       │ salario_base    │
│ division_id     │       │ area_id (FK)    │
└─────────────────┘       └─────────────────┘
```

### Tablas Principales

#### `empleados`
```sql
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    fecha_ingreso DATE NOT NULL,
    fecha_cese DATE,
    dias_vacaciones INTEGER DEFAULT 30,
    tipo_contrato VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'Activo',
    puesto_id INTEGER REFERENCES puestos(id),
    area_id INTEGER REFERENCES areas(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    supervisor_id INTEGER REFERENCES empleados(id)
);
```

#### `solicitudes_vacaciones`
```sql
CREATE TABLE solicitudes_vacaciones (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES empleados(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    motivo TEXT,
    aprobador_id INTEGER REFERENCES empleados(id),
    fecha_aprobacion TIMESTAMP,
    comentarios_aprobador TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Índices

```sql
-- Índices para mejor performance
CREATE INDEX idx_empleados_dni ON empleados(dni);
CREATE INDEX idx_empleados_estado ON empleados(estado);
CREATE INDEX idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes_vacaciones(estado);
CREATE INDEX idx_solicitudes_fechas ON solicitudes_vacaciones(fecha_inicio, fecha_fin);
```

### Políticas de Seguridad

- **Contraseñas**: Hash con bcrypt (10 rounds)
- **SQL Injection**: Uso de consultas parametrizadas
- **Backup**: Diario automático en Render
- **Encriptación**: SSL/TLS en conexiones

---

## API Backend

### Estructura de Endpoints

#### Autenticación

```
POST   /api/auth/login              # Iniciar sesión
POST   /api/auth/register           # Registrar usuario
GET    /api/auth/me                 # Obtener usuario actual
```

#### Empleados

```
GET    /api/empleados               # Listar todos
GET    /api/empleados/:id           # Obtener por ID
POST   /api/empleados               # Crear empleado
PUT    /api/empleados/:id           # Actualizar empleado
DELETE /api/empleados/:id           # Eliminar empleado
PATCH  /api/empleados/:id/vacaciones # Actualizar días
```

#### Vacaciones

```
GET    /api/vacaciones/control-rrhh      # Dashboard RRHH
GET    /api/vacaciones/historial          # Historial completo
POST   /api/vacaciones/solicitud          # Nueva solicitud
GET    /api/vacaciones/empleado/:id       # Solicitudes de empleado
PUT    /api/vacaciones/:id/aprobar        # Aprobar solicitud
PUT    /api/vacaciones/:id/rechazar       # Rechazar solicitud
```

#### Publicaciones

```
GET    /api/publicaciones           # Listar publicaciones
POST   /api/publicaciones           # Crear publicación
PUT    /api/publicaciones/:id       # Actualizar publicación
DELETE /api/publicaciones/:id       # Eliminar publicación
```

#### Notificaciones

```
GET    /api/notificaciones          # Listar notificaciones
POST   /api/notificaciones          # Crear notificación
PATCH  /api/notificaciones/:id/leer # Marcar como leída
```

### Ejemplo de Request/Response

#### POST /api/auth/login

**Request**:
```json
{
  "email": "usuario@agrovet.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@agrovet.com",
    "rol": "empleado",
    "empleadoId": 4,
    "nombres": "Juan",
    "apellidos": "Pérez"
  }
}
```

**Response Error (401)**:
```json
{
  "error": "Credenciales inválidas"
}
```

#### GET /api/empleados

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "dni": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "juan.perez@agrovet.com",
    "puesto": "Gerente de Ventas",
    "area": "Comercial",
    "dias_vacaciones": 25,
    "estado": "Activo"
  }
]
```

### Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | No autorizado |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## Frontend React

### Arquitectura de Componentes

```
App
├── Login (Autenticación)
├── Portal (Dashboard Principal)
│   ├── AvailableDays (Resumen de vacaciones)
│   ├── Publicaciones (Comunicados)
│   └── Notificaciones
├── VacationsPage
│   ├── RequestForm (Solicitar vacaciones)
│   ├── RequestsList (Mis solicitudes)
│   └── VacationCalendar
├── GestionEmpleados (CRUD)
│   ├── EmpleadoForm
│   └── EmpleadosTable
├── DashboardRRHH (Métricas)
│   ├── StatsCards
│   └── EmpleadosTable
└── HistorialVacaciones
    ├── Filters
    └── HistorialTable
```

### Servicios (API Clients)

#### `/src/services/api.js`
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

#### `/src/services/empleados.service.js`
```javascript
import api from './api';

export const empleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },
  
  create: async (empleadoData) => {
    const response = await api.post('/empleados', empleadoData);
    return response.data;
  },
  
  update: async (id, empleadoData) => {
    const response = await api.put(`/empleados/${id}`, empleadoData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  }
};
```

### Rutas

```javascript
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Portal />} />
        <Route path="/vacaciones" element={<VacationsPage />} />
        <Route path="/empleados" element={<GestionEmpleados />} />
        <Route path="/dashboard-rrhh" element={<DashboardRRHH />} />
        <Route path="/historial" element={<HistorialVacaciones />} />
      </Routes>
    </Router>
  );
}
```

### State Management

Actualmente se usa **Estado Local** con hooks:

```javascript
const [empleados, setEmpleados] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await empleadosService.getAll();
      setEmpleados(data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

**Futuro**: Migrar a **Context API** o **Redux** para estado global.

---

## Guía de Desarrollo

### Convenciones de Código

#### JavaScript/React

- **Nombres de archivos**: PascalCase para componentes (`DashboardRRHH.jsx`)
- **Nombres de funciones**: camelCase (`fetchData`, `handleSubmit`)
- **Nombres de componentes**: PascalCase (`function EmpleadoForm()`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)

#### SQL

- **Nombres de tablas**: snake_case plural (`empleados`, `solicitudes_vacaciones`)
- **Nombres de columnas**: snake_case (`fecha_inicio`, `dias_vacaciones`)
- **Primary Keys**: `id`
- **Foreign Keys**: `tabla_id` (ej: `empleado_id`)

### Git Workflow

```bash
# Crear nueva rama para feature
git checkout -b feature/nombre-feature

# Hacer commits descriptivos
git commit -m "feat: agregar validación de fechas en solicitud"
git commit -m "fix: corregir cálculo de días de antigüedad"
git commit -m "docs: actualizar README con nuevas rutas"

# Push a remoto
git push origin feature/nombre-feature

# Crear Pull Request en GitHub
```

**Prefijos de commit**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

### Testing

**Futuro**: Implementar testing con:
- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Cypress

Ejemplo de test:
```javascript
// empleados.service.test.js
describe('Empleados Service', () => {
  it('debe obtener todos los empleados', async () => {
    const empleados = await empleadosService.getAll();
    expect(empleados).toBeInstanceOf(Array);
    expect(empleados.length).toBeGreaterThan(0);
  });
});
```

### Debugging

**Frontend**:
```javascript
// Usar React DevTools
console.log('Estado actual:', empleados);
console.error('Error:', error);
```

**Backend**:
```javascript
// Logging en controladores
console.log('Request body:', req.body);
console.error('Database error:', err);
```

**Base de Datos**:
```sql
-- Consultas de debug
SELECT * FROM empleados WHERE id = 4;
SELECT * FROM solicitudes_vacaciones WHERE estado = 'Pendiente';
```

---

## Despliegue

### Producción

#### Backend

1. **Preparar Build**:
```bash
cd backend
npm install --production
```

2. **Variables de Entorno**:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=clave_super_segura_produccion
CORS_ORIGIN=https://tudominio.com
```

3. **Iniciar Servidor**:
```bash
node src/server.js
```

#### Frontend

1. **Build**:
```bash
cd reac
npm run build
```

2. **Variables de Entorno**:
```env
VITE_API_URL=https://api.tudominio.com
```

3. **Desplegar**: Subir carpeta `dist/` a servidor web (Nginx, Apache, Vercel, Netlify)

### Docker (Opcional)

**Dockerfile Backend**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "src/server.js"]
```

**Dockerfile Frontend**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
  
  frontend:
    build: ./reac
    ports:
      - "80:80"
    depends_on:
      - backend
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=agrovet
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## Mantenimiento

### Monitoreo

- **Logs**: Revisar logs del servidor regularmente
- **Performance**: Monitorear tiempos de respuesta
- **Errores**: Configurar alertas para errores 500

### Backup

**Base de Datos**:
```bash
# Backup manual
pg_dump -U usuario -d database > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U usuario -d database < backup_20251117.sql
```

**Automatizar Backups** (cron):
```bash
# Backup diario a las 2 AM
0 2 * * * pg_dump -U usuario -d database > /backups/db_$(date +\%Y\%m\%d).sql
```

### Actualización de Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (con cuidado)
npm install react@latest
```

### Solución de Problemas Comunes

#### Error: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

#### Error: "Database connection failed"
```bash
# Verificar conexión
psql -U usuario -d database -h host

# Verificar variables de entorno
echo $DATABASE_URL
```

#### Error: "CORS policy"
```javascript
// Verificar CORS_ORIGIN en backend .env
CORS_ORIGIN=http://localhost:5173
```

---

## Apéndices

### A. Glosario de Términos Técnicos

- **JWT**: JSON Web Token, método de autenticación
- **MVC**: Model-View-Controller, patrón de arquitectura
- **ORM**: Object-Relational Mapping
- **REST**: Representational State Transfer
- **SPA**: Single Page Application
- **CRUD**: Create, Read, Update, Delete

### B. Referencias

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Material-UI Components](https://mui.com/)
- [JWT.io](https://jwt.io/)

### C. Contacto del Equipo

**Desarrollador Principal**:
- Email: dev@agrovet.com
- GitHub: jonathancerda-hub

**Repositorio**:
- GitHub: https://github.com/jonathancerda-hub/AgrovetConectAH

---

**Versión del Manual**: 1.0  
**Fecha de Actualización**: Noviembre 2025  
**Última Revisión**: 17/11/2025

---

*Este manual es un documento vivo y debe actualizarse con cada cambio significativo en la arquitectura o tecnologías del sistema.*
