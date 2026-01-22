# Contexto del Proyecto: AgrovetConectAH - Sistema de Gestión de Vacaciones

## Visión General

AgrovetConectAH es una aplicación web empresarial diseñada para gestionar las solicitudes de vacaciones de los empleados de Agrovet Market. Proporciona una interfaz completa para que los empleados soliciten días libres, los supervisores gestionen sus equipos, y RRHH administre el sistema centralizadamente. Incluye funcionalidades de red social interna, directorio de empleados, calendario de eventos y gestión de aprobaciones multinivel.

## Tecnologías Clave

### Frontend
-   **React 19.2.0:** Librería principal para construcción de interfaces de usuario
-   **Material-UI v7:** Framework de componentes con Material Design
-   **Vite 7.1.9:** Build tool y desarrollo rápido
-   **React Router DOM:** Navegación y rutas
-   **React Big Calendar:** Visualización de calendarios con eventos
-   **Moment.js:** Manipulación y formato de fechas (localización español)
-   **Emotion:** CSS-in-JS para estilización
-   **React Hook Form:** Gestión de formularios
-   **@mui/x-date-pickers:** Selectores de fecha Material-UI
-   **@mui/x-data-grid:** Tablas avanzadas con paginación

### Backend (Integración)
-   **API REST:** Comunicación con backend en Node.js
-   **JWT:** Autenticación basada en tokens
-   **PostgreSQL/Supabase:** Base de datos relacional

## Características Principales

### 1. Sistema de Autenticación
-   **Login JWT:** Autenticación con tokens almacenados en localStorage
-   **Roles de Usuario:** Empleado, Supervisor, RRHH
-   **Rutas Protegidas:** Control de acceso basado en roles
-   **Información de Usuario:** Avatar, nombre completo, puesto, área

### 2. Portal Principal
-   **Dashboard Personalizado:** Vista según rol del usuario
-   **Navegación Lateral:** Sidebar con menús contextuales
-   **Mi Ficha:** Información personal del empleado
-   **Notificaciones:** Sistema de alertas en tiempo real
-   **Búsqueda Global:** Búsqueda de empleados y contenido

### 3. Gestión de Vacaciones

#### Solicitudes
-   **Formulario de Solicitud:** 
    - Selección de fechas con validación
    - Cálculo automático de días
    - Motivo obligatorio
    - Validación en tiempo real de reglas de negocio
    - **Detección de cruces:** Alerta si las fechas se solapan con solicitudes existentes
-   **Validaciones Implementadas:**
    - Días disponibles suficientes
    - Máximo 5 viernes por período
    - Si incluye viernes, debe incluir fin de semana completo
    - No cruces con otras solicitudes (pendientes o aprobadas)
    - Solicitud antes del día 20 del mes
-   **Estados:** Pendiente, Aprobada, Rechazada, Cancelada
-   **Resumen de Saldo:** Días disponibles, usados y pendientes

#### Calendario de Vacaciones
-   **Vista Mensual:** Calendario interactivo con react-big-calendar
-   **Tipos de Eventos:**
    - Mis vacaciones (verde)
    - Vacaciones del equipo (azul)
    - Feriados nacionales de Perú 2025 (rojo)
    - Días festivos (naranja)
-   **Contador de Eventos:** Badges con cantidad por tipo
-   **Navegación:** Cambio de mes y año
-   **Sin Duplicados:** Eventos únicos por ID

#### Aprobación de Solicitudes
-   **Flujo Multinivel:** Supervisor → RRHH
-   **Vista de Pendientes:** Lista de solicitudes por aprobar
-   **Acciones:** Aprobar o Rechazar con comentarios
-   **Historial:** Registro de todas las acciones

### 4. Gestión de Equipos

#### Mi Equipo (Supervisores)
-   **Dashboard de Equipo:**
    - Tarjeta de miembros del equipo (total)
    - Tarjeta de empleados de vacaciones HOY (con nombres en chips)
    - Cálculo automático de activos (total - de vacaciones)
-   **Tabla de Subordinados:**
    - Empleado con avatar y puesto
    - Email, área, puesto
    - Vista completa de 8 personas a cargo
-   **Solicitar Colaborador:** Formulario para petición de nuevo empleado
-   **Validación en Tiempo Real:** Verifica vacaciones activas comparando fecha actual

### 5. Directorio de Empleados
-   **Vista de Tarjetas:** Grid responsive (4 columnas en desktop, 1 en móvil)
-   **Información por Empleado:**
    - Avatar con iniciales
    - Nombre completo
    - Puesto
    - Área
    - Email
    - Ubicación (si aplica)
-   **Filtros en Español:**
    - Búsqueda por nombre (incluye email)
    - Filtro por título del puesto
    - Filtro por ubicación
-   **Tarjetas Uniformes:** Altura fija de 400px con overflow ellipsis
-   **Botones de Acción:** Reiniciar y Buscar (verde #5cb85c)

### 6. Red Social Interna (Boletines - RRHH)
-   **Restricción de Acceso:** Solo visible para usuarios con rol RRHH
-   **Publicaciones:** Sistema de comunicación interna
-   **Gestión de Contenido:** Crear, editar y eliminar boletines

### 7. Sistema de Notificaciones
-   **Tipos de Notificaciones:**
    - Aprobación de solicitudes
    - Rechazo de solicitudes
    - Nuevas solicitudes pendientes
-   **Indicadores Visuales:** Badge con contador
-   **Marcado de Leídas:** Control de estado

## Estructura del Proyecto

```
reac/
├── src/
│   ├── App.jsx                          # Router principal, sidebar, auth
│   ├── main.jsx                         # Entry point
│   ├── global.css                       # Estilos globales
│   ├── features/
│   │   └── vacations/
│   │       └── components/
│   │           ├── VacacionesPage.jsx          # Hub principal vacaciones
│   │           ├── RequestForm.jsx             # Formulario solicitud + validación cruces
│   │           ├── RequestsList.jsx            # Lista mis solicitudes
│   │           ├── VacationCalendar.jsx        # Calendario eventos (sin duplicados)
│   │           ├── ProcessRequestPage.jsx      # Aprobación solicitudes
│   │           ├── DirectorioPage.jsx          # Directorio empleados (tarjetas 400px)
│   │           ├── EquipoPage.jsx              # Gestión equipos (default: Mi Equipo)
│   │           ├── TeamDashboard.jsx           # Dashboard equipo + vacaciones activas
│   │           └── NewCollaboratorForm.jsx     # Solicitud colaborador
│   ├── services/
│   │   ├── api.js                       # Axios instance con interceptors
│   │   ├── auth.service.js              # Login, logout, getCurrentUser
│   │   ├── vacaciones.service.js        # API vacaciones (validación, CRUD)
│   │   ├── empleados.service.js         # API empleados
│   │   ├── aprobacion.service.js        # API aprobaciones
│   │   ├── notificaciones.service.js    # API notificaciones
│   │   └── publicaciones.service.js     # API boletines
│   └── index.html                       # HTML con favicon WiFi SVG
├── backend/
│   ├── src/
│   │   ├── server.js                    # Express server
│   │   ├── db.js                        # PostgreSQL connection
│   │   ├── controllers/                 # Lógica de negocio
│   │   ├── routes/                      # Endpoints API
│   │   ├── middleware/                  # Auth, validación
│   │   └── services/                    # Servicios backend
│   └── database/
│       └── migrations/                  # SQL migrations
├── docs/                                # Documentación HTML
├── public/img/                          # Assets estáticos
├── package.json                         # Dependencies frontend
├── vite.config.js                       # Vite config
└── render.yaml                          # Deploy config
```

## Reglas de Negocio Implementadas

### Validación de Solicitudes
1. **Días Disponibles:** Verificar saldo suficiente
2. **Viernes Limitados:** Máximo 5 viernes por período de 30 días
3. **Regla de Fin de Semana:** Si incluye viernes, debe tomar sábado y domingo
4. **Anticipación:** Solicitar antes del día 20 del mes
5. **Bloques Recomendados:** Al menos 2 bloques de 7 días continuos al año
6. **Cruce de Fechas:** No permitir solapamiento con solicitudes existentes (pendientes/aprobadas)

### Detección de Cruces (Frontend + Backend)
-   **Validación Frontend:** Compara fechas con solicitudes existentes antes de enviar
-   **Casos Detectados:**
    - Nueva solicitud empieza durante una existente
    - Nueva solicitud termina durante una existente
    - Nueva solicitud envuelve completamente una existente
    - Nueva solicitud está dentro de una existente
-   **Mensaje Claro:** Indica qué solicitud(es) está(n) en conflicto y su estado
-   **Ignorar Rechazadas:** Solo valida contra pendientes y aprobadas

### Flujo de Aprobación
1. Empleado solicita → Estado: Pendiente
2. Supervisor aprueba → RRHH revisa
3. RRHH aprueba → Estado: Aprobada
4. Cualquier rechazo → Estado: Rechazada (con motivo)

## Mejoras UX Recientes

### DirectorioPage
-   ✅ Tarjetas uniformes 400px altura fija
-   ✅ Grid 4 columnas desktop, 1 columna móvil
-   ✅ Filtros en español
-   ✅ Búsqueda incluye email
-   ✅ Overflow ellipsis para textos largos

### EquipoPage
-   ✅ Tab por defecto: "Mi Equipo" (dashboard)
-   ✅ Tarjeta "De Vacaciones" muestra contador y nombres
-   ✅ Validación en tiempo real de vacaciones activas HOY
-   ✅ Reducción de títulos duplicados (mejor jerarquía visual)

### VacationCalendar
-   ✅ Eliminación de eventos duplicados (propEvents)
-   ✅ IDs únicos por tipo: `usuario-`, `equipo-`, `feriado-`, `festivo-`
-   ✅ Combinación de 4 fuentes sin duplicar

### RequestForm
-   ✅ Validación de cruces de fechas en tiempo real
-   ✅ Mensajes claros de error con fechas conflictivas
-   ✅ Recarga automática de solicitudes después de crear
-   ✅ Import correcto de vacacionesService (default export)

### App.jsx
-   ✅ Boletines restringido a rol RRHH (`currentUser?.esRrhh`)
-   ✅ Favicon WiFi SVG en index.html

## Próximas Mejoras Potenciales
-   [ ] Notificaciones push en tiempo real
-   [ ] Exportación de reportes a PDF/Excel
-   [ ] Dashboard analytics para RRHH
-   [ ] Integración con calendario externo (Google Calendar)
-   [ ] Gestión de permisos y licencias médicas
-   [ ] Firma digital de aprobaciones
-   [ ] Historial de cambios de solicitudes

## Datos de Perú 2025
-   **Feriados Nacionales:** 13 días (incluye Fiestas Patrias, Navidad, Año Nuevo)
-   **Días Festivos:** 6 adicionales (San Valentín, Día de la Madre, Padre, etc.)
-   **Localización:** moment.js configurado en español peruano
