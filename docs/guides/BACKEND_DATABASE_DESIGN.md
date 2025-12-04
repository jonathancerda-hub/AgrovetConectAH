# 🗄️ DISEÑO DE BASE DE DATOS - AGROVET CONECTA

## 📋 ÍNDICE
1. [Diagrama Entidad-Relación](#diagrama-entidad-relación)
2. [Descripción de Tablas](#descripción-de-tablas)
3. [Relaciones](#relaciones)
4. [Scripts SQL](#scripts-sql)
5. [API Endpoints](#api-endpoints)
6. [Arquitectura Backend](#arquitectura-backend)

---

## 📊 DIAGRAMA ENTIDAD-RELACIÓN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SISTEMA AGROVET CONECTA                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│     EMPRESAS     │         │    DIVISIONES    │         │      AREAS       │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)          │◄────────│ id (PK)          │◄────────│ id (PK)          │
│ nombre           │    1:N  │ empresa_id (FK)  │    1:N  │ division_id (FK) │
│ ruc              │         │ nombre           │         │ nombre           │
│ direccion        │         │ descripcion      │         │ descripcion      │
│ telefono         │         │ fecha_creacion   │         │ centro_costos    │
│ activo           │         │ activo           │         │ activo           │
│ created_at       │         └──────────────────┘         │ created_at       │
│ updated_at       │                                      │ updated_at       │
└──────────────────┘                                      └──────────────────┘
                                                                    │
                                                                    │ 1:N
                                                                    ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│     USUARIOS     │◄────────│     PUESTOS      │         │   EMPLEADOS      │
├──────────────────┤    1:N  ├──────────────────┤    1:1  ├──────────────────┤
│ id (PK)          │         │ id (PK)          │◄────────│ id (PK)          │
│ email            │         │ nombre           │         │ usuario_id (FK)  │
│ password_hash    │         │ area_id (FK)     │         │ puesto_id (FK)   │
│ rol              │         │ nivel_jerarquia  │         │ supervisor_id FK │
│ activo           │         │ descripcion      │         │ area_id (FK)     │
│ ultimo_login     │         │ salario_base     │         │ dni              │
│ created_at       │         │ activo           │         │ nombres          │
│ updated_at       │         │ created_at       │         │ apellidos        │
└──────────────────┘         │ updated_at       │         │ fecha_nacimiento │
        │                    └──────────────────┘         │ telefono         │
        │                                                 │ direccion        │
        │ 1:N                                            │ tipo_contrato    │
        │                                                 │ fecha_ingreso    │
        │                                                 │ fecha_cese       │
        │                                                 │ dias_vacaciones  │
        │                                                 │ suplente_id (FK) │
        │                                                 │ foto_perfil      │
        │                                                 │ estado           │
        │                                                 │ created_at       │
        │                                                 │ updated_at       │
        │                                                 └──────────────────┘
        │                                                           │
        ├───────────────────────────────────────────────────────────┤
        │                           1:N                             │
        │                                                           │
        ▼                                                           ▼
┌──────────────────┐                                     ┌──────────────────┐
│  NOTIFICACIONES  │                                     │   SOLICITUDES    │
├──────────────────┤                                     │   VACACIONES     │
│ id (PK)          │                                     ├──────────────────┤
│ usuario_id (FK)  │                                     │ id (PK)          │
│ tipo             │                                     │ empleado_id (FK) │
│ titulo           │                                     │ aprobador_id FK  │
│ mensaje          │                                     │ fecha_inicio     │
│ url_referencia   │                                     │ fecha_fin        │
│ leido            │                                     │ dias_solicitados │
│ created_at       │                                     │ estado           │
└──────────────────┘                                     │ comentarios      │
                                                          │ motivo_rechazo   │
                                                          │ fecha_aprobacion │
        ┌─────────────────────────────────────────────►│ created_at       │
        │                                                │ updated_at       │
        │ 1:N                                           └──────────────────┘
        │
┌──────────────────┐         ┌──────────────────┐
│  PUBLICACIONES   │         │   COMENTARIOS    │
│   (BOLETINES)    │         │  PUBLICACIONES   │
├──────────────────┤    1:N  ├──────────────────┤
│ id (PK)          │◄────────│ id (PK)          │
│ autor_id (FK)    │         │ publicacion_id FK│
│ titulo           │         │ usuario_id (FK)  │
│ contenido        │         │ contenido        │
│ imagen_url       │         │ created_at       │
│ tipo             │         └──────────────────┘
│ prioridad        │
│ fecha_publicacion│         ┌──────────────────┐
│ fecha_expiracion │         │   REACCIONES     │
│ visible          │    1:N  │  PUBLICACIONES   │
│ created_at       │◄────────├──────────────────┤
│ updated_at       │         │ id (PK)          │
└──────────────────┘         │ publicacion_id FK│
                              │ usuario_id (FK)  │
                              │ tipo_reaccion    │
        ┌─────────────────────│ created_at       │
        │                     └──────────────────┘
        │ 1:N
        │
┌──────────────────┐         ┌──────────────────┐
│   SOLICITUDES    │         │   DOCUMENTOS     │
│  COLABORADOR     │    1:N  │   EMPLEADOS      │
├──────────────────┤◄────────├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ solicitante_id FK│         │ empleado_id (FK) │
│ area_solicitante │         │ tipo_documento   │
│ dni_colaborador  │         │ nombre_archivo   │
│ nombre           │         │ url_archivo      │
│ apellido         │         │ fecha_subida     │
│ puesto_solicitado│         │ subido_por (FK)  │
│ modalidad        │         │ created_at       │
│ fecha_inicio     │         └──────────────────┘
│ horario          │
│ sueldo_propuesto │         ┌──────────────────┐
│ descripcion_tarea│         │   BOLETAS_PAGO   │
│ estado           │         ├──────────────────┤
│ comentarios_rrhh │         │ id (PK)          │
│ created_at       │         │ empleado_id (FK) │
│ updated_at       │         │ periodo          │
│ aprobado_por (FK)│         │ año              │
│ fecha_aprobacion │         │ mes              │
└──────────────────┘         │ salario_bruto    │
                              │ deducciones      │
                              │ salario_neto     │
                              │ url_pdf          │
                              │ created_at       │
                              └──────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   CALENDARIO     │         │    TAREAS        │
│    EVENTOS       │         │   PENDIENTES     │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ empleado_id (FK) │         │ usuario_id (FK)  │
│ titulo           │         │ titulo           │
│ descripcion      │         │ descripcion      │
│ fecha_inicio     │         │ prioridad        │
│ fecha_fin        │         │ fecha_limite     │
│ tipo_evento      │         │ completada       │
│ color            │         │ created_at       │
│ created_at       │         │ updated_at       │
└──────────────────┘         └──────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   BENEFICIOS     │         │   EMPLEADO       │
├──────────────────┤    M:N  │   BENEFICIOS     │
│ id (PK)          │◄────────├──────────────────┤
│ nombre           │         │ empleado_id (FK) │
│ descripcion      │         │ beneficio_id (FK)│
│ tipo             │         │ fecha_asignacion │
│ valor            │         │ estado           │
│ vigencia_inicio  │         │ created_at       │
│ vigencia_fin     │         └──────────────────┘
│ activo           │
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐
│   AUDITORIA      │
│   (BITACORA)     │
├──────────────────┤
│ id (PK)          │
│ usuario_id (FK)  │
│ accion           │
│ tabla_afectada   │
│ registro_id      │
│ datos_anteriores │
│ datos_nuevos     │
│ ip_address       │
│ user_agent       │
│ created_at       │
└──────────────────┘
```

---

## 📝 DESCRIPCIÓN DE TABLAS

### 1. **EMPRESAS**
Almacena información de las empresas del grupo.
```sql
- id: Identificador único
- nombre: Nombre legal de la empresa
- ruc: Número RUC
- direccion: Dirección fiscal
- telefono: Teléfono de contacto
- activo: Estado (activa/inactiva)
```

### 2. **DIVISIONES**
Divisiones organizacionales de cada empresa.
```sql
- id: Identificador único
- empresa_id: Referencia a EMPRESAS
- nombre: Nombre de la división (Ej: "FINANZAS Y TI")
- descripcion: Descripción de la división
```

### 3. **AREAS**
Áreas funcionales dentro de cada división.
```sql
- id: Identificador único
- division_id: Referencia a DIVISIONES
- nombre: Nombre del área (Ej: "TI (SISTEMAS)")
- centro_costos: Código del centro de costos
```

### 4. **USUARIOS**
Credenciales de acceso al sistema.
```sql
- id: Identificador único
- email: Correo electrónico (único)
- password_hash: Contraseña encriptada (bcrypt)
- rol: admin | rrhh | jefe | empleado
- activo: Estado de la cuenta
- ultimo_login: Fecha del último acceso
```

### 5. **PUESTOS**
Catálogo de puestos de trabajo.
```sql
- id: Identificador único
- nombre: Nombre del puesto
- area_id: Área a la que pertenece
- nivel_jerarquia: 1-10 (1=Director, 10=Auxiliar)
- salario_base: Salario base del puesto
```

### 6. **EMPLEADOS**
Información personal y laboral de empleados.
```sql
- id: Identificador único
- usuario_id: Referencia a USUARIOS (1:1)
- puesto_id: Puesto actual
- supervisor_id: Jefe directo (auto-referencia)
- dni: DNI del empleado (8 dígitos)
- nombres: Nombres completos
- apellidos: Apellidos completos
- tipo_contrato: Indefinido | Plazo Fijo | Prácticas
- fecha_ingreso: Fecha de inicio
- dias_vacaciones: Días disponibles
- suplente_id: Suplente asignado
- estado: Activo | Vacaciones | Inactivo | Cesado
```

### 7. **SOLICITUDES_VACACIONES**
Registro de solicitudes de vacaciones.
```sql
- id: Identificador único
- empleado_id: Quien solicita
- aprobador_id: Quien debe aprobar
- fecha_inicio: Inicio de vacaciones
- fecha_fin: Fin de vacaciones
- dias_solicitados: Cantidad de días
- estado: Pendiente | Aprobado | Rechazado | Cancelado
- comentarios: Comentarios del empleado
- motivo_rechazo: Razón del rechazo
- fecha_aprobacion: Cuándo se aprobó/rechazó
```

### 8. **PUBLICACIONES (BOLETINES)**
Publicaciones en el portal interno.
```sql
- id: Identificador único
- autor_id: Usuario que publicó
- titulo: Título de la publicación
- contenido: Texto completo
- imagen_url: URL de la imagen
- tipo: Noticia | Comunicado | Evento
- prioridad: Alta | Media | Baja
- visible: Si está visible o no
```

### 9. **COMENTARIOS_PUBLICACIONES**
Comentarios en publicaciones.
```sql
- id: Identificador único
- publicacion_id: Publicación comentada
- usuario_id: Quien comentó
- contenido: Texto del comentario
```

### 10. **REACCIONES_PUBLICACIONES**
Reacciones (Me gusta, etc.) en publicaciones.
```sql
- id: Identificador único
- publicacion_id: Publicación
- usuario_id: Usuario
- tipo_reaccion: like | love | celebrate
```

### 11. **NOTIFICACIONES**
Sistema de notificaciones en tiempo real.
```sql
- id: Identificador único
- usuario_id: Destinatario
- tipo: success | warning | error | info
- titulo: Título de la notificación
- mensaje: Contenido
- url_referencia: Link relacionado
- leido: Si fue leída o no
```

### 12. **SOLICITUDES_COLABORADOR**
Solicitudes de nuevo personal.
```sql
- id: Identificador único
- solicitante_id: Jefe que solicita
- dni_colaborador: DNI del nuevo colaborador
- nombre, apellido: Datos personales
- puesto_solicitado: Puesto a ocupar
- modalidad: Tipo de contrato
- sueldo_propuesto: Salario propuesto
- estado: Pendiente | Aprobado | Rechazado
```

### 13. **DOCUMENTOS_EMPLEADOS**
Repositorio de documentos (contratos, certificados).
```sql
- id: Identificador único
- empleado_id: Dueño del documento
- tipo_documento: Contrato | Certificado | DNI | etc.
- url_archivo: URL del archivo en storage
- subido_por: Usuario que subió
```

### 14. **BOLETAS_PAGO**
Boletas de pago mensuales.
```sql
- id: Identificador único
- empleado_id: Empleado
- periodo: Ej: "2025-11"
- año, mes: Año y mes
- salario_bruto: Salario antes de descuentos
- deducciones: JSON con detalles
- salario_neto: Salario final
- url_pdf: URL del PDF generado
```

### 15. **CALENDARIO_EVENTOS**
Eventos del calendario (vacaciones, reuniones, etc.).
```sql
- id: Identificador único
- empleado_id: Empleado relacionado
- titulo: Título del evento
- fecha_inicio, fecha_fin: Rango de fechas
- tipo_evento: Vacaciones | Reunión | Feriado
- color: Color en el calendario
```

### 16. **TAREAS_PENDIENTES**
Lista de tareas pendientes.
```sql
- id: Identificador único
- usuario_id: Dueño de la tarea
- titulo, descripcion: Detalles
- prioridad: Alta | Media | Baja
- fecha_limite: Fecha límite
- completada: Si está completada
```

### 17. **BENEFICIOS**
Catálogo de beneficios corporativos.
```sql
- id: Identificador único
- nombre: Nombre del beneficio
- tipo: Seguro | Bono | Descuento | etc.
- valor: Valor monetario
- vigencia_inicio, vigencia_fin: Periodo de validez
```

### 18. **EMPLEADO_BENEFICIOS**
Relación M:N entre empleados y beneficios.
```sql
- empleado_id: Empleado
- beneficio_id: Beneficio
- fecha_asignacion: Cuándo se asignó
- estado: Activo | Inactivo
```

### 19. **AUDITORIA (BITÁCORA)**
Registro de todas las acciones del sistema.
```sql
- id: Identificador único
- usuario_id: Quien realizó la acción
- accion: CREATE | UPDATE | DELETE | LOGIN
- tabla_afectada: Tabla modificada
- registro_id: ID del registro
- datos_anteriores, datos_nuevos: JSON con cambios
- ip_address: IP del usuario
- user_agent: Navegador/dispositivo
```

---

## 🔗 RELACIONES PRINCIPALES

### **Jerarquía Organizacional**
```
EMPRESAS (1) → (N) DIVISIONES → (N) AREAS → (N) PUESTOS → (N) EMPLEADOS
```

### **Jerarquía de Usuarios**
```
EMPLEADOS.supervisor_id (auto-referencia)
Ej: Luis (nivel 8) → reporta a → Juan (nivel 6) → reporta a → Laura (nivel 5)
```

### **Flujo de Aprobación de Vacaciones**
```
EMPLEADOS → SOLICITUDES_VACACIONES → aprobador_id (EMPLEADOS)
Ej: Solicitud de Luis → Aprueba Juan (su supervisor directo)
```

### **Publicaciones y Social**
```
USUARIOS → PUBLICACIONES → COMENTARIOS
                         → REACCIONES
```

### **Notificaciones**
```
USUARIOS → NOTIFICACIONES (1:N)
Las notificaciones se generan automáticamente cuando:
- Se aprueba/rechaza una solicitud de vacaciones
- Nuevo boletín publicado
- Nueva solicitud asignada para aprobar
```

---

## 💾 SCRIPTS SQL

### **1. Crear Base de Datos**

```sql
-- PostgreSQL
CREATE DATABASE agrovet_conecta;

-- MySQL
CREATE DATABASE agrovet_conecta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### **2. Tablas Principales**

```sql
-- EMPRESAS
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DIVISIONES
CREATE TABLE divisiones (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AREAS
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    division_id INTEGER REFERENCES divisiones(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    centro_costos VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'rrhh', 'jefe', 'empleado')),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas por email
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- PUESTOS
CREATE TABLE puestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    nivel_jerarquia INTEGER CHECK (nivel_jerarquia BETWEEN 1 AND 10),
    descripcion TEXT,
    salario_base DECIMAL(10, 2),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EMPLEADOS
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    puesto_id INTEGER REFERENCES puestos(id) ON DELETE SET NULL,
    supervisor_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL,
    area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    direccion TEXT,
    tipo_contrato VARCHAR(50) CHECK (tipo_contrato IN ('Indefinido', 'Plazo Fijo', 'Prácticas')),
    fecha_ingreso DATE NOT NULL,
    fecha_cese DATE,
    dias_vacaciones INTEGER DEFAULT 30,
    suplente_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL,
    foto_perfil TEXT,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Vacaciones', 'Inactivo', 'Cesado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para empleados
CREATE INDEX idx_empleados_dni ON empleados(dni);
CREATE INDEX idx_empleados_supervisor ON empleados(supervisor_id);

-- SOLICITUDES DE VACACIONES
CREATE TABLE solicitudes_vacaciones (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    aprobador_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado', 'Cancelado')),
    comentarios TEXT,
    motivo_rechazo TEXT,
    fecha_aprobacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para solicitudes
CREATE INDEX idx_solicitudes_empleado ON solicitudes_vacaciones(empleado_id);
CREATE INDEX idx_solicitudes_aprobador ON solicitudes_vacaciones(aprobador_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes_vacaciones(estado);

-- PUBLICACIONES (BOLETINES)
CREATE TABLE publicaciones (
    id SERIAL PRIMARY KEY,
    autor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(500) NOT NULL,
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    tipo VARCHAR(50) DEFAULT 'Noticia' CHECK (tipo IN ('Noticia', 'Comunicado', 'Evento')),
    prioridad VARCHAR(20) DEFAULT 'Media' CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para publicaciones visibles ordenadas por fecha
CREATE INDEX idx_publicaciones_visible ON publicaciones(visible, fecha_publicacion DESC);

-- COMENTARIOS EN PUBLICACIONES
CREATE TABLE comentarios_publicaciones (
    id SERIAL PRIMARY KEY,
    publicacion_id INTEGER NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REACCIONES EN PUBLICACIONES
CREATE TABLE reacciones_publicaciones (
    id SERIAL PRIMARY KEY,
    publicacion_id INTEGER NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_reaccion VARCHAR(20) DEFAULT 'like' CHECK (tipo_reaccion IN ('like', 'love', 'celebrate')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(publicacion_id, usuario_id) -- Un usuario solo puede reaccionar una vez por publicación
);

-- NOTIFICACIONES
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('success', 'warning', 'error', 'info')),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    url_referencia TEXT,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para notificaciones no leídas
CREATE INDEX idx_notificaciones_leido ON notificaciones(usuario_id, leido);

-- SOLICITUDES DE NUEVO COLABORADOR
CREATE TABLE solicitudes_colaborador (
    id SERIAL PRIMARY KEY,
    solicitante_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    area_solicitante VARCHAR(255),
    dni_colaborador VARCHAR(8) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    puesto_solicitado VARCHAR(255) NOT NULL,
    modalidad VARCHAR(50),
    fecha_inicio DATE,
    horario VARCHAR(100),
    sueldo_propuesto DECIMAL(10, 2),
    descripcion_tarea TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado')),
    comentarios_rrhh TEXT,
    aprobado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_aprobacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOCUMENTOS DE EMPLEADOS
CREATE TABLE documentos_empleados (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(100) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo TEXT NOT NULL,
    fecha_subida DATE DEFAULT CURRENT_DATE,
    subido_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOLETAS DE PAGO
CREATE TABLE boletas_pago (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    periodo VARCHAR(7) NOT NULL, -- Formato: 2025-11
    año INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    salario_bruto DECIMAL(10, 2) NOT NULL,
    deducciones JSONB, -- JSON con detalle de descuentos
    salario_neto DECIMAL(10, 2) NOT NULL,
    url_pdf TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empleado_id, periodo)
);

-- CALENDARIO DE EVENTOS
CREATE TABLE calendario_eventos (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    tipo_evento VARCHAR(50) CHECK (tipo_evento IN ('Vacaciones', 'Reunión', 'Feriado', 'Capacitación')),
    color VARCHAR(7) DEFAULT '#1976d2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TAREAS PENDIENTES
CREATE TABLE tareas_pendientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) DEFAULT 'Media' CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    fecha_limite DATE,
    completada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BENEFICIOS
CREATE TABLE beneficios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(100),
    valor DECIMAL(10, 2),
    vigencia_inicio DATE,
    vigencia_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EMPLEADO_BENEFICIOS (Relación M:N)
CREATE TABLE empleado_beneficios (
    empleado_id INTEGER NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    beneficio_id INTEGER NOT NULL REFERENCES beneficios(id) ON DELETE CASCADE,
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(empleado_id, beneficio_id)
);

-- AUDITORIA (BITÁCORA)
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
    tabla_afectada VARCHAR(100),
    registro_id INTEGER,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsqueda de auditoría
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id, created_at DESC);
CREATE INDEX idx_auditoria_tabla ON auditoria(tabla_afectada, registro_id);
```

### **3. Datos Iniciales (Seeds)**

```sql
-- Insertar empresa principal
INSERT INTO empresas (nombre, ruc, direccion, telefono) VALUES
('AGROVET MARKET S.A.', '20123456789', 'Av. Principal 123, Lima', '01-1234567');

-- Insertar divisiones
INSERT INTO divisiones (empresa_id, nombre) VALUES
(1, 'FINANZAS Y TI'),
(1, 'RECURSOS HUMANOS'),
(1, 'OPERACIONES');

-- Insertar áreas
INSERT INTO areas (division_id, nombre, centro_costos) VALUES
(1, 'TI (SISTEMAS)', 'GOL-GOL01'),
(1, 'FINANZAS', 'GOL-FIN01'),
(2, 'TALENTO HUMANO', 'GOL-RH01'),
(3, 'LOGÍSTICA', 'GOL-LOG01');

-- Insertar puestos
INSERT INTO puestos (nombre, area_id, nivel_jerarquia, salario_base) VALUES
('Director General', 1, 1, 15000.00),
('Gerente de TI', 1, 2, 10000.00),
('Coordinador de Proyectos', 1, 6, 5000.00),
('Desarrollador Senior', 1, 7, 4500.00),
('Analista RRHH', 3, 7, 4000.00);

-- Insertar usuario administrador
INSERT INTO usuarios (email, password_hash, rol) VALUES
('admin@agrovet.com', '$2b$10$rX5YQsHB7XQnl4gXJPZz4uyZj8cQ0Bb1a.bKpF3jKNvW8xHx8vZTe', 'admin'); -- password: admin123

-- Insertar empleado admin
INSERT INTO empleados (usuario_id, puesto_id, dni, nombres, apellidos, tipo_contrato, fecha_ingreso) VALUES
(1, 1, '12345678', 'Administrador', 'Sistema', 'Indefinido', '2020-01-01');

-- Insertar publicación de ejemplo
INSERT INTO publicaciones (autor_id, titulo, contenido, tipo) VALUES
(1, '¡Bienvenido a Agrovet Conecta!', 'Sistema de gestión de recursos humanos ahora disponible.', 'Comunicado');
```

### **4. Triggers para Auditoría**

```sql
-- Función para registrar cambios
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores)
        VALUES (current_setting('app.current_user_id', true)::INTEGER, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos)
        VALUES (current_setting('app.current_user_id', true)::INTEGER, 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_nuevos)
        VALUES (current_setting('app.current_user_id', true)::INTEGER, 'CREATE', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas críticas
CREATE TRIGGER trigger_auditoria_empleados
AFTER INSERT OR UPDATE OR DELETE ON empleados
FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trigger_auditoria_solicitudes
AFTER INSERT OR UPDATE OR DELETE ON solicitudes_vacaciones
FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trigger_auditoria_usuarios
AFTER INSERT OR UPDATE OR DELETE ON usuarios
FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();
```

### **5. Función para Crear Notificación Automática**

```sql
CREATE OR REPLACE FUNCTION crear_notificacion_solicitud()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando se crea una solicitud, notificar al aprobador
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, url_referencia)
        SELECT u.id, 'info', 'Nueva solicitud de vacaciones',
               'Tienes una nueva solicitud pendiente de aprobación',
               '/solicitudes/' || NEW.id
        FROM empleados e
        JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.id = NEW.aprobador_id;
    
    -- Cuando se aprueba/rechaza, notificar al solicitante
    ELSIF TG_OP = 'UPDATE' AND OLD.estado = 'Pendiente' AND NEW.estado IN ('Aprobado', 'Rechazado') THEN
        INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
        SELECT u.id,
               CASE WHEN NEW.estado = 'Aprobado' THEN 'success' ELSE 'error' END,
               'Solicitud ' || NEW.estado,
               'Tu solicitud de vacaciones ha sido ' || LOWER(NEW.estado)
        FROM empleados e
        JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.id = NEW.empleado_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificacion_solicitud
AFTER INSERT OR UPDATE ON solicitudes_vacaciones
FOR EACH ROW EXECUTE FUNCTION crear_notificacion_solicitud();
```

---

## 🚀 API ENDPOINTS

### **Autenticación**
```
POST   /api/auth/login                 # Login
POST   /api/auth/logout                # Logout
POST   /api/auth/refresh               # Refresh token
GET    /api/auth/me                    # Usuario actual
POST   /api/auth/change-password       # Cambiar contraseña
```

### **Usuarios**
```
GET    /api/usuarios                   # Listar usuarios
GET    /api/usuarios/:id               # Obtener usuario
POST   /api/usuarios                   # Crear usuario
PUT    /api/usuarios/:id               # Actualizar usuario
DELETE /api/usuarios/:id               # Eliminar usuario
```

### **Empleados**
```
GET    /api/empleados                  # Listar empleados
GET    /api/empleados/:id              # Obtener empleado
POST   /api/empleados                  # Crear empleado
PUT    /api/empleados/:id              # Actualizar empleado
DELETE /api/empleados/:id              # Eliminar empleado
GET    /api/empleados/:id/subordinados # Obtener equipo
GET    /api/empleados/:id/supervisor   # Obtener jefe
GET    /api/empleados/search?q=query   # Buscar empleados
```

### **Solicitudes de Vacaciones**
```
GET    /api/vacaciones                 # Listar solicitudes
GET    /api/vacaciones/:id             # Obtener solicitud
POST   /api/vacaciones                 # Crear solicitud
PUT    /api/vacaciones/:id             # Actualizar solicitud
DELETE /api/vacaciones/:id             # Cancelar solicitud
POST   /api/vacaciones/:id/aprobar     # Aprobar solicitud
POST   /api/vacaciones/:id/rechazar    # Rechazar solicitud
GET    /api/vacaciones/pendientes      # Solicitudes pendientes
GET    /api/vacaciones/equipo          # Solicitudes del equipo
```

### **Publicaciones (Boletines)**
```
GET    /api/publicaciones              # Listar publicaciones
GET    /api/publicaciones/:id          # Obtener publicación
POST   /api/publicaciones              # Crear publicación
PUT    /api/publicaciones/:id          # Actualizar publicación
DELETE /api/publicaciones/:id          # Eliminar publicación
POST   /api/publicaciones/:id/comentar # Agregar comentario
POST   /api/publicaciones/:id/reaccionar # Agregar reacción
GET    /api/publicaciones/:id/comentarios # Listar comentarios
```

### **Notificaciones**
```
GET    /api/notificaciones             # Listar notificaciones
GET    /api/notificaciones/no-leidas   # No leídas
PUT    /api/notificaciones/:id/leer    # Marcar como leída
PUT    /api/notificaciones/leer-todas  # Marcar todas como leídas
DELETE /api/notificaciones/:id         # Eliminar notificación
```

### **Solicitudes de Colaborador**
```
GET    /api/colaboradores              # Listar solicitudes
POST   /api/colaboradores              # Crear solicitud
PUT    /api/colaboradores/:id          # Actualizar solicitud
POST   /api/colaboradores/:id/aprobar  # Aprobar solicitud
POST   /api/colaboradores/:id/rechazar # Rechazar solicitud
```

### **Documentos**
```
GET    /api/documentos/empleado/:id    # Documentos del empleado
POST   /api/documentos                 # Subir documento
DELETE /api/documentos/:id             # Eliminar documento
GET    /api/documentos/:id/download    # Descargar documento
```

### **Boletas de Pago**
```
GET    /api/boletas/empleado/:id       # Boletas del empleado
GET    /api/boletas/:id                # Obtener boleta
GET    /api/boletas/:id/pdf            # Descargar PDF
POST   /api/boletas                    # Generar boleta (admin)
```

### **Dashboard y Estadísticas**
```
GET    /api/dashboard/resumen          # Resumen general
GET    /api/dashboard/estadisticas     # Estadísticas RRHH
GET    /api/dashboard/equipo           # Estadísticas del equipo
```

---

## 🏗️ ARQUITECTURA BACKEND

### **Stack Tecnológico Recomendado**

```
Backend:   Node.js + Express.js / NestJS
Database:  PostgreSQL 14+
ORM:       Prisma / TypeORM
Auth:      JWT (jsonwebtoken) + bcrypt
Storage:   AWS S3 / Cloudinary (imágenes y PDFs)
Cache:     Redis (opcional, para sessions y cache)
Real-time: Socket.io (notificaciones en tiempo real)
```

### **Estructura de Carpetas**

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── storage.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── empleados.controller.js
│   │   ├── vacaciones.controller.js
│   │   ├── publicaciones.controller.js
│   │   └── notificaciones.controller.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Empleado.js
│   │   ├── SolicitudVacacion.js
│   │   └── Publicacion.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── empleados.routes.js
│   │   ├── vacaciones.routes.js
│   │   └── publicaciones.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   └── audit.middleware.js
│   ├── services/
│   │   ├── email.service.js
│   │   ├── notification.service.js
│   │   └── pdf.service.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── errors.js
│   │   └── validators.js
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── .env
├── package.json
└── README.md
```

### **Ejemplo: Schema Prisma**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  rol           Rol
  activo        Boolean   @default(true)
  ultimoLogin   DateTime? @map("ultimo_login")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  empleado      Empleado?
  notificaciones Notificacion[]
  publicaciones Publicacion[]

  @@map("usuarios")
}

model Empleado {
  id              Int       @id @default(autoincrement())
  usuarioId       Int       @unique @map("usuario_id")
  puestoId        Int?      @map("puesto_id")
  supervisorId    Int?      @map("supervisor_id")
  dni             String    @unique
  nombres         String
  apellidos       String
  tipoContrato    String    @map("tipo_contrato")
  fechaIngreso    DateTime  @map("fecha_ingreso")
  diasVacaciones  Int       @default(30) @map("dias_vacaciones")
  estado          String    @default("Activo")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  usuario         Usuario   @relation(fields: [usuarioId], references: [id])
  supervisor      Empleado? @relation("Jerarquia", fields: [supervisorId], references: [id])
  subordinados    Empleado[] @relation("Jerarquia")

  solicitudesVacaciones SolicitudVacacion[] @relation("Solicitante")
  aprobaciones          SolicitudVacacion[] @relation("Aprobador")

  @@map("empleados")
}

model SolicitudVacacion {
  id                Int       @id @default(autoincrement())
  empleadoId        Int       @map("empleado_id")
  aprobadorId       Int?      @map("aprobador_id")
  fechaInicio       DateTime  @map("fecha_inicio")
  fechaFin          DateTime  @map("fecha_fin")
  diasSolicitados   Int       @map("dias_solicitados")
  estado            EstadoSolicitud @default(Pendiente)
  comentarios       String?
  motivoRechazo     String?   @map("motivo_rechazo")
  fechaAprobacion   DateTime? @map("fecha_aprobacion")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  empleado          Empleado  @relation("Solicitante", fields: [empleadoId], references: [id])
  aprobador         Empleado? @relation("Aprobador", fields: [aprobadorId], references: [id])

  @@map("solicitudes_vacaciones")
}

enum Rol {
  admin
  rrhh
  jefe
  empleado
}

enum EstadoSolicitud {
  Pendiente
  Aprobado
  Rechazado
  Cancelado
}
```

### **Ejemplo: Controller de Vacaciones**

```javascript
// src/controllers/vacaciones.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class VacacionesController {
  
  // Crear solicitud de vacaciones
  async crearSolicitud(req, res) {
    try {
      const { fechaInicio, fechaFin, comentarios } = req.body;
      const empleadoId = req.user.empleadoId;

      // Calcular días
      const dias = calcularDiasHabiles(fechaInicio, fechaFin);

      // Obtener supervisor
      const empleado = await prisma.empleado.findUnique({
        where: { id: empleadoId },
        select: { supervisorId: true, diasVacaciones: true }
      });

      if (dias > empleado.diasVacaciones) {
        return res.status(400).json({ error: 'Días insuficientes' });
      }

      const solicitud = await prisma.solicitudVacacion.create({
        data: {
          empleadoId,
          aprobadorId: empleado.supervisorId,
          fechaInicio,
          fechaFin,
          diasSolicitados: dias,
          comentarios
        }
      });

      // Crear notificación para el aprobador
      await crearNotificacion(empleado.supervisorId, {
        tipo: 'info',
        titulo: 'Nueva solicitud de vacaciones',
        mensaje: `Tienes una nueva solicitud pendiente`
      });

      res.status(201).json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aprobar solicitud
  async aprobarSolicitud(req, res) {
    try {
      const { id } = req.params;
      const aprobadorId = req.user.empleadoId;

      const solicitud = await prisma.solicitudVacacion.update({
        where: { id: parseInt(id) },
        data: {
          estado: 'Aprobado',
          fechaAprobacion: new Date()
        },
        include: { empleado: true }
      });

      // Descontar días de vacaciones
      await prisma.empleado.update({
        where: { id: solicitud.empleadoId },
        data: {
          diasVacaciones: {
            decrement: solicitud.diasSolicitados
          }
        }
      });

      // Notificar al solicitante
      await crearNotificacion(solicitud.empleado.usuarioId, {
        tipo: 'success',
        titulo: 'Solicitud aprobada',
        mensaje: 'Tu solicitud de vacaciones ha sido aprobada'
      });

      res.json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Listar solicitudes pendientes (para jefes)
  async listarPendientes(req, res) {
    try {
      const aprobadorId = req.user.empleadoId;

      const solicitudes = await prisma.solicitudVacacion.findMany({
        where: {
          aprobadorId,
          estado: 'Pendiente'
        },
        include: {
          empleado: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VacacionesController();
```

### **Middleware de Autenticación**

```javascript
// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: { empleado: true }
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario inválido' });
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empleadoId: usuario.empleado?.id
    };

    // Para auditoría
    await prisma.$executeRaw`SET app.current_user_id = ${usuario.id}`;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { authMiddleware };
```

---

## 📦 PASOS PARA IMPLEMENTACIÓN

### **Fase 1: Setup Inicial (Semana 1)**
1. Crear base de datos PostgreSQL
2. Ejecutar scripts SQL de creación de tablas
3. Insertar datos iniciales (seeds)
4. Configurar proyecto Node.js + Express
5. Configurar Prisma ORM

### **Fase 2: Autenticación (Semana 2)**
1. Implementar registro de usuarios
2. Implementar login con JWT
3. Implementar middleware de autenticación
4. Crear endpoints de gestión de usuarios

### **Fase 3: Módulo de Empleados (Semana 3)**
1. CRUD de empleados
2. Gestión de jerarquía (supervisor/subordinados)
3. Búsqueda de empleados
4. Perfil de empleado (Mi Ficha)

### **Fase 4: Módulo de Vacaciones (Semana 4)**
1. Crear solicitud de vacaciones
2. Aprobar/rechazar solicitudes
3. Cálculo automático de días
4. Calendario de vacaciones

### **Fase 5: Portal y Publicaciones (Semana 5)**
1. CRUD de publicaciones
2. Sistema de comentarios
3. Sistema de reacciones
4. Upload de imágenes (AWS S3/Cloudinary)

### **Fase 6: Notificaciones (Semana 6)**
1. Sistema de notificaciones en DB
2. Notificaciones en tiempo real (Socket.io)
3. Triggers automáticos

### **Fase 7: Módulos Adicionales (Semana 7-8)**
1. Solicitudes de nuevo colaborador
2. Documentos y boletas de pago
3. Tareas pendientes
4. Beneficios

### **Fase 8: Testing y Deploy (Semana 9-10)**
1. Testing de endpoints
2. Optimización de consultas
3. Deploy en servidor (AWS/Heroku/DigitalOcean)
4. Configuración de CI/CD

---

## 🔐 SEGURIDAD

1. **Contraseñas**: bcrypt con salt rounds 10+
2. **JWT**: Token expiración 1 hora, refresh token 7 días
3. **SQL Injection**: Usar ORM (Prisma) con queries parametrizadas
4. **XSS**: Sanitizar inputs, Content Security Policy
5. **CORS**: Configurar whitelist de dominios
6. **Rate Limiting**: Limitar requests por IP
7. **HTTPS**: SSL/TLS en producción
8. **Auditoría**: Log de todas las acciones críticas

---

## 📈 OPTIMIZACIONES

1. **Índices**: Crear índices en columnas frecuentemente consultadas
2. **Cache**: Redis para sesiones y datos frecuentes
3. **Pagination**: Paginar listados grandes (10-50 items por página)
4. **Lazy Loading**: Cargar relaciones solo cuando se necesitan
5. **Compression**: Gzip para responses
6. **CDN**: Cloudflare para archivos estáticos

---

## 📞 CONTACTO Y SOPORTE

Para dudas sobre la implementación del backend:
- Revisar documentación de Prisma: https://www.prisma.io/docs
- Consultar buenas prácticas de Express: https://expressjs.com/en/advanced/best-practice-security.html
- PostgreSQL docs: https://www.postgresql.org/docs/

---

**Última actualización:** 5 de noviembre de 2025
**Versión:** 1.0.0
