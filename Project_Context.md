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
-   **API REST:** Comunicación con backend en Node.js (Express)
-   **JWT:** Autenticación basada en tokens
-   **PostgreSQL/Supabase:** Base de datos relacional (Render)
-   **Node.js:** Runtime de backend (puerto 3001)

## Características Principales

### 1. Sistema de Autenticación
-   **Login JWT:** Autenticación con tokens almacenados en localStorage
-   **Roles de Usuario:** Empleado, Supervisor, RRHH
-   **Rutas Protegidas:** Control de acceso basado en roles
-   **Información de Usuario:** Avatar, nombre completo, puesto, área

### 2. Portal Principal
-   **Dashboard Personalizado:** Vista según rol del usuario
-   **Navegación Lateral:** Sidebar con menús contextuales
-   **Mi Ficha:** Información personal del empleado (nombre completo, código, DNI, email)
-   **Notificaciones:** Sistema de alertas en tiempo real
-   **TopBar Simplificado:** Notificaciones y perfil de usuario (búsqueda eliminada)

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
    - Feriados nacionales/regionales (rojo) - **DINÁMICOS desde API**
    - Días festivos (naranja) - **DINÁMICOS desde API**
-   **Feriados 2026:** 13 feriados nacionales de Perú cargados
-   **Gestión de Feriados:** CRUD completo desde Dashboard RRHH
-   **Contador de Eventos:** Badges con cantidad por tipo
-   **Navegación:** Cambio de mes y año
-   **Sin Duplicados:** Eventos únicos por ID
-   **Próximos Feriados:** Lista de los 6 próximos feriados oficiales

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

### 7. Dashboard RRHH
-   **Control de Vacaciones:**
    - Tabla completa de empleados con días disponibles/programados/pendientes
    - **Sistema de Alertas Inteligente:** Basado en días sin programar + proximidad a aniversario
    - **Contador de Alertas:** Chips con totales por estado (Crítico, Pendiente, Acumulado, OK)
    - **Filtros con Emojis:** 🔴 Crítico, 🟡 Moderado, 🟢 Disponible, ⚫ Agotado, ⚪ Sin período
    - **Exportación Excel:** Reporte con 2 hojas (Control + Historial)
-   **Gestión de Feriados:**
    - CRUD completo de feriados nacionales, regionales y festivos
    - Filtro por año
    - Validación de fechas duplicadas
-   **Gestión de Empleados:**
    - Visualización completa de plantilla
    - Toggle RRHH por empleado
    - Botón "Nuevo Empleado" deshabilitado (control de acceso)
-   **Historial de Vacaciones:**
    - Registro completo de todas las solicitudes
    - Filtros por empleado, estado, fechas

### 8. Sistema de Notificaciones
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
│   │           ├── VacationCalendar.jsx        # Calendario eventos dinámicos (API feriados)
│   │           ├── ProcessRequestPage.jsx      # Aprobación solicitudes
│   │           ├── DirectorioPage.jsx          # Directorio empleados (tarjetas 400px)
│   │           ├── EquipoPage.jsx              # Gestión equipos (default: Mi Equipo)
│   │           ├── TeamDashboard.jsx           # Dashboard equipo + vacaciones activas
│   │           ├── NewCollaboratorForm.jsx     # Solicitud colaborador
│   │           ├── DashboardRRHH.jsx           # Dashboard RRHH con alertas inteligentes
│   │           ├── ControlVacacionesEmpleado.jsx # Control RRHH con filtros emoji
│   │           ├── HistorialVacaciones.jsx     # Historial completo
│   │           ├── GestionEmpleados.jsx        # CRUD empleados (Nuevo deshabilitado)
│   │           ├── GestionFeriados.jsx         # CRUD feriados (nuevo)
│   │           ├── MiFicha.jsx                 # Ficha personal simplificada
│   │           ├── TopBar.jsx                  # Barra superior sin búsqueda
│   │           └── RRHHPage.jsx                # Container pestañas RRHH
│   ├── services/
│   │   ├── api.js                       # Axios instance con interceptors
│   │   ├── auth.service.js              # Login, logout, getCurrentUser
│   │   ├── vacaciones.service.js        # API vacaciones (validación, CRUD)
│   │   ├── empleados.service.js         # API empleados
│   │   ├── aprobacion.service.js        # API aprobaciones
│   │   ├── notificaciones.service.js    # API notificaciones
│   │   ├── publicaciones.service.js     # API boletines
│   │   └── feriados.service.js          # API feriados (nuevo - CRUD completo)
│   └── index.html                       # HTML con favicon WiFi SVG
├── backend/
│   ├── src/
│   │   ├── server.js                    # Express server (puerto 3001)
│   │   ├── db.js                        # PostgreSQL connection (Supabase)
│   │   ├── controllers/                 # Lógica de negocio
│   │   │   ├── vacaciones.controller.js # Incluye cálculo de fines de semana
│   │   │   ├── feriados.controller.js   # CRUD feriados (nuevo)
│   │   │   └── ...                      # Otros controladores
│   │   ├── routes/                      # Endpoints API
│   │   │   ├── feriados.routes.js       # Rutas feriados (nuevo)
│   │   │   └── ...                      # Otras rutas
│   │   ├── middleware/                  # Auth, validación
│   │   └── services/                    # Servicios backend
│   └── database/
│       └── migrations/                  # SQL migrations
│           ├── 12_feriados_2026.sql     # Feriados Perú 2026 (nuevo)
│           └── ...                      # Otras migraciones
├── docs/                                # Documentación HTML
│   ├── manual-desarrollador.html       # Manual técnico v1.2.0 (actualizado)
│   ├── manual-usuario.html             # Manual de usuario
│   └── guides/                         # Guías adicionales
├── public/img/                          # Assets estáticos
├── package.json                         # Dependencies frontend
├── vite.config.js                       # Vite config
└── render.yaml                          # Deploy config
```

## Reglas de Negocio Implementadas

### Sistema de Alertas Inteligente (Nuevo - Enero 2026)

**Objetivo:** Garantizar que empleados programen vacaciones ANTES de cumplir otro año laboral y ganar 30 días adicionales.

**Estados de Alerta:**

1. **🔴 Crítico:**
   - Condición: ≥15 días sin programar Y ≤60 días hasta aniversario
   - Significado: Urgente - debe programar INMEDIATAMENTE o acumulará más días

2. **🟡 Pendiente:**
   - Condición: ≥10 días sin programar Y ≤120 días hasta aniversario
   - Significado: Advertencia - tiene 2-4 meses para programar

3. **🟡 Acumulado:**
   - Condición: ≥20 días sin programar (independiente del tiempo)
   - Significado: Acumulación alta - riesgo de perder días

4. **🟢 OK/Disponible:**
   - Condición: <10 días sin programar o todo bien gestionado
   - Significado: Normal - está gestionando correctamente sus vacaciones

5. **⚫ Agotado:**
   - Condición: 0 días disponibles
   - Significado: Ya usó todos sus días del período

6. **⚪ Sin período:**
   - Condición: No tiene período vacacional activo
   - Significado: Empleado nuevo (<1 año)

**Cálculos:**
```javascript
diasSinProgramar = dias_disponibles - dias_programados
diasHastaAniversario = Math.ceil((proximoAniversario - hoy) / (1000*60*60*24))
```

**Implementación:**
- Backend: Query SQL incluye `fecha_ingreso` para cálculo de aniversario
- Frontend: Funciones `getAlertaChip()` y `getEstadoEmpleado()` aplican lógica
- Dashboard RRHH: Contador de alertas con chips de resumen

### Cálculo de Fines de Semana (Corregido - Enero 2026)

**Regla Empresarial:** Un fin de semana = Sábado + Domingo juntos (NO por separado)

**Implementación:**
```javascript
// backend/src/controllers/vacaciones.controller.js
const finesDeSemana = Math.min(sabados, domingos);
```

**Ejemplo:**
- Solicitud: 4/2/2026 (viernes) - 7/2/2026 (domingo)
- Resultado: 1 fin de semana (NO 2)
- Lógica: Si hay 1 sábado y 1 domingo = 1 fin de semana completo

### Sistema de Feriados Dinámicos (Nuevo - Enero 2026)

**Gestión desde UI:**
- Tabla `feriados` con campos: id, fecha (unique), nombre, tipo, pais, anio
- Tipos: nacional, regional, festivo
- Endpoints: GET/POST/PUT/DELETE /api/feriados
- Calendario carga feriados desde API (no hardcodeados)

**Validaciones:**
- Fecha única (constraint en BD)
- Año extraído automáticamente de fecha
- Anti-puenteo: ≤7 días entre solicitudes con feriados intermedios debe incluirlos

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

### Enero 2026 - Sistema de Alertas y Gestión Mejorada ✅

**Dashboard RRHH:**
- ✅ Sistema de alertas inteligente basado en aniversario laboral
- ✅ Contador de alertas con chips (Crítico, Pendiente, Acumulado, OK)
- ✅ Cambio de firma de función: `getAlertaChip(empleado)` en vez de `(diasRestantes, diasTomados)`
- ✅ Tooltips explicativos en columnas Programados/Pendientes

**Control de Vacaciones:**
- ✅ Filtros reordenados con emojis: 🔴🟡🟢⚫⚪
- ✅ Estados priorizados: Crítico → Moderado → Disponible → Agotado → Sin período
- ✅ Lógica de estados mejorada con cálculo de aniversario

**Sistema de Feriados:**
- ✅ CRUD completo de feriados desde UI (GestionFeriados.jsx)
- ✅ Calendario carga feriados dinámicamente desde API
- ✅ Migración 2026: 13 feriados nacionales de Perú
- ✅ Filtro por año en gestión
- ✅ Validación de fechas duplicadas

**Mi Ficha:**
- ✅ Nombre completo en un solo campo (`${nombres} ${apellidos}`)
- ✅ Eliminados: fecha_nacimiento y genero
- ✅ Solo 4 campos esenciales: Nombre Completo, Código, DNI, Email

**TopBar:**
- ✅ Eliminada funcionalidad de búsqueda (no implementada)
- ✅ Removidos: searchOpen, searchValue, handleSearchToggle, Ctrl+K
- ✅ Interfaz más limpia: solo notificaciones + menú de usuario

**Gestión de Empleados:**
- ✅ Botón "NUEVO EMPLEADO" deshabilitado (control de acceso)

**Backend:**
- ✅ Cálculo correcto de fines de semana: `Math.min(sabados, domingos)`
- ✅ Query SQL incluye `fecha_ingreso` para alertas
- ✅ Controlador y rutas de feriados implementados
- ✅ Servicio de feriados con CRUD completo

**Documentación:**
- ✅ Manual de desarrollador actualizado con lógica completa de reglas
- ✅ Sección detallada: Sistema de Alertas, Estados, Fines de Semana
- ✅ Tabla de estados con criterios exactos
- ✅ Código de ejemplo de algoritmos
- ✅ Versión actualizada: v1.2.0 (2026.01.23)

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

## Seguridad

### Alerta de Seguridad GitHub - 22 de enero de 2026 ✅ RESUELTA

**Problema Detectado:**
- GitHub Secret Scanning detectó `SUPABASE_SERVICE_ROLE_KEY` expuesta en commit `1fc92d16`
- Archivo: `backend/scripts/cargar-empleados-api.js` línea 12
- Riesgo: Acceso total a base de datos bypasseando RLS

**Acciones Tomadas:**
1. ✅ Código refactorizado para usar variables de entorno (commit `d60d793`)
2. ✅ Nueva Secret Key generada en Supabase: `sb_secret_M_LcE...`
3. ✅ Script `cargar-empleados-api.js` actualizado con `dotenv`
4. ✅ Validación de variables de entorno implementada
5. ✅ Legacy JWT keys deshabilitadas en Supabase Dashboard
6. ✅ Documentación actualizada con placeholders seguros (commit `3ce47fa`)

**Lecciones Aprendidas:**
- ❌ Nunca hardcodear secrets en código
- ✅ Usar siempre `process.env` y archivos `.env`
- ✅ Verificar `.gitignore` incluye archivos sensibles
- ✅ Migrar a nuevas Secret Keys de Supabase (formato `sb_secret_...`)
- ✅ Deshabilitar claves comprometidas inmediatamente

## Próximas Mejoras Potenciales
-   [ ] Notificaciones push en tiempo real
-   [ ] Exportación de reportes a PDF
-   [ ] Dashboard analytics para RRHH con gráficos
-   [ ] Integración con calendario externo (Google Calendar)
-   [ ] Gestión de permisos y licencias médicas
-   [ ] Firma digital de aprobaciones
-   [ ] Historial de cambios de solicitudes con log de auditoría
-   [ ] Cálculo automático de días proporcionales para nuevos empleados
-   [ ] Alertas automáticas por email para estados críticos
-   [ ] Reporte de acumulación de vacaciones por área

## Datos de Perú 2026
-   **Feriados Nacionales:** 13 días (Año Nuevo, Semana Santa, Trabajo, San Pedro, Fiestas Patrias x2, Santa Rosa, Angamos, Santos, Inmaculada, Navidad)
-   **Feriados Cargados:** Migración 12_feriados_2026.sql aplicada
-   **Gestión Dinámica:** CRUD completo desde Dashboard RRHH
-   **Tipos:** Nacional, Regional, Festivo
-   **Localización:** moment.js configurado en español peruano

## Estado Actual del Proyecto - 26 de enero de 2026

### Versión: 1.2.0

**Componentes Funcionales:**
- ✅ Sistema de autenticación JWT
- ✅ Gestión completa de vacaciones
- ✅ Sistema de alertas inteligente
- ✅ Dashboard RRHH con métricas en tiempo real
- ✅ Gestión de feriados dinámicos
- ✅ Calendario interactivo con eventos múltiples
- ✅ Aprobación multinivel de solicitudes
- ✅ Directorio de empleados
- ✅ Gestión de equipos
- ✅ Boletines internos (RRHH)
- ✅ Sistema de notificaciones

**Backend:**
- ✅ API REST completa en Express
- ✅ Base de datos PostgreSQL/Supabase
- ✅ Autenticación y autorización
- ✅ Controladores de feriados
- ✅ Lógica de alertas y validaciones
- ✅ Puerto 3001 en producción

**Seguridad:**
- ✅ Secrets de Supabase migradas a variables de entorno
- ✅ JWT tokens con expiración
- ✅ Middleware de autenticación en todas las rutas protegidas
- ✅ Roles y permisos implementados
- ✅ Legacy keys deshabilitadas

**Documentación:**
- ✅ Manual de desarrollador completo (v1.2.0)
- ✅ Lógica de reglas documentada
- ✅ Algoritmos de cálculo explicados
- ✅ Guías de setup y deployment
- ✅ Contexto de proyecto actualizado

**Última Actualización:** 26 de enero de 2026
