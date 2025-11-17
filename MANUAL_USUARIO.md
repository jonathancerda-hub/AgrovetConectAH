# 📘 Manual de Usuario - AgroVet Conecta

## Índice
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Reglas de Vacaciones](#reglas-de-vacaciones)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [Próximos Pasos y Funcionalidades Pendientes](#próximos-pasos-y-funcionalidades-pendientes)
6. [Preguntas Frecuentes](#preguntas-frecuentes)
7. [Soporte Técnico](#soporte-técnico)

---

## Introducción

**AgroVet Conecta** es un sistema integral de gestión de recursos humanos diseñado específicamente para AgroVet. El sistema permite gestionar empleados, solicitudes de vacaciones, publicaciones internas y notificaciones de manera eficiente y centralizada.

### Características Principales
- ✅ Gestión completa de empleados
- ✅ Sistema de solicitud y aprobación de vacaciones
- ✅ Portal de comunicaciones internas
- ✅ Dashboard de RRHH con estadísticas en tiempo real
- ✅ Control de vacaciones por empleado
- ✅ Historial de solicitudes

---

## Acceso al Sistema

### Inicio de Sesión

1. **URL de acceso**: `http://localhost:5173`
2. **Credenciales**: Utilice el email y contraseña proporcionados por RRHH
3. **Pantalla de Login**:
   - Email: Ingrese su correo corporativo
   - Contraseña: Ingrese su contraseña personal
   - Click en "Iniciar Sesión"

### Recuperación de Contraseña
Si olvidó su contraseña, contacte al departamento de RRHH para restablecerla.

### Roles de Usuario

El sistema cuenta con tres roles principales:

1. **Empleado**: Acceso a solicitudes de vacaciones y portal de empleados
2. **Supervisor**: Aprobación de solicitudes del equipo
3. **Administrador**: Acceso completo al sistema, gestión de empleados y configuración

---

## Reglas de Vacaciones

### 📋 Política General de Vacaciones

#### 1. Días de Vacaciones por Año
- **Empleados regulares**: 30 días calendario por año
- Los días se acumulan desde la fecha de ingreso
- Se pueden tomar de forma fraccionada o continua

#### 2. Requisitos para Solicitar Vacaciones

**Días Mínimos**:
- Mínimo: 5 días consecutivos (para descanso efectivo)
- Máximo: 30 días consecutivos

**Anticipación**:
- Solicitudes con al menos **15 días de anticipación**
- Para períodos vacacionales (verano, fin de año): **30 días de anticipación**

**Días Laborables**:
- Las vacaciones se cuentan en días calendario
- Se recomienda incluir fines de semana para optimizar el descanso

#### 3. Restricciones y Validaciones

**Bloque Continuo**:
- No se pueden solicitar más de 2 bloques continuos de vacaciones sin periodo de trabajo intermedio
- Debe haber al menos 30 días entre bloques de vacaciones

**Días Disponibles**:
- Debe tener días disponibles suficientes
- El sistema valida automáticamente el saldo

**Solapamiento**:
- No puede tener solicitudes con fechas solapadas
- Las solicitudes pendientes bloquean temporalmente esos días

#### 4. Estados de Solicitud

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | Solicitud enviada, esperando aprobación del supervisor |
| **Aprobado** | Solicitud aprobada, días descontados del saldo |
| **Rechazado** | Solicitud rechazada, días devueltos al saldo |
| **En Revisión** | Solicitud bajo revisión por RRHH |

#### 5. Proceso de Aprobación

```
Empleado → Solicitud → Supervisor → RRHH → Aprobación Final
   (1)        (2)         (3)         (4)        (5)
```

1. **Empleado**: Completa formulario de solicitud
2. **Solicitud**: Sistema valida reglas automáticamente
3. **Supervisor**: Revisa y aprueba/rechaza
4. **RRHH**: Validación final de disponibilidad
5. **Aprobación**: Notificación al empleado

#### 6. Días de Antigüedad

- Se otorgan días adicionales por antigüedad
- Cálculo automático basado en fecha de ingreso
- Máximo: 5 días adicionales (después de 5 años)

#### 7. Cálculo de Vacaciones

**Ejemplo de cálculo**:
```
Fecha de ingreso: 01/01/2020
Días por año: 30 días
Antigüedad: 5 años
Días adicionales: 5 días
Total disponible: 35 días

Días tomados en 2025: 10 días
Días restantes: 25 días
```

#### 8. Recomendaciones

✅ **Planifique con anticipación**: Reserve sus vacaciones con tiempo
✅ **Incluya fines de semana**: Optimice su descanso
✅ **Coordine con su equipo**: Evite ausencias simultáneas
✅ **Revise su saldo**: Verifique días disponibles antes de solicitar
✅ **Complete la información**: Incluya motivo y comentarios relevantes

---

## Módulos del Sistema

### 1. 🏠 Portal de Empleados

**Acceso**: Menú principal → Portal

**Funcionalidades**:
- Ver días de vacaciones disponibles
- Consultar publicaciones y comunicados
- Ver notificaciones importantes
- Acceso rápido a solicitudes

**Información Mostrada**:
- Días por Año
- Días Tomados
- Días Restantes
- Días de Antigüedad
- Últimas publicaciones
- Notificaciones pendientes

### 2. 📝 Solicitud de Vacaciones

**Acceso**: Menú principal → Solicitar Vacaciones

**Cómo solicitar vacaciones**:

1. Click en "Solicitar Vacaciones"
2. Seleccione **Fecha de Inicio**
3. Seleccione **Fecha de Fin**
4. El sistema calcula automáticamente los días
5. Agregue un **Motivo/Comentario** (opcional)
6. Revise el resumen de la solicitud
7. Click en "Enviar Solicitud"

**Validaciones Automáticas**:
- ✅ Días disponibles suficientes
- ✅ Fechas válidas
- ✅ Anticipación mínima
- ✅ Sin solapamiento con otras solicitudes
- ✅ Bloque continuo válido

### 3. 📋 Mis Solicitudes

**Acceso**: Menú principal → Mis Solicitudes

**Información Disponible**:
- Estado de cada solicitud
- Fechas solicitadas
- Días solicitados
- Comentarios del supervisor
- Historial completo

**Acciones Disponibles**:
- Ver detalles de solicitud
- Cancelar solicitud pendiente
- Descargar comprobante (próximamente)

### 4. 📊 Dashboard RRHH

**Acceso**: Menú principal → Dashboard RRHH (Solo administradores)

**Estadísticas Mostradas**:
- Total de empleados activos
- Empleados sin vacaciones
- Empleados en vacaciones actualmente
- Días promedio disponibles

**Funcionalidades**:
- Búsqueda de empleados
- Ver días de vacaciones por empleado
- Enviar recordatorios
- Filtros avanzados

### 5. 🔍 Control de Vacaciones

**Acceso**: Menú principal → Control de Vacaciones (Solo administradores)

**Funcionalidades**:
- Vista general de todos los empleados
- Estado de vacaciones por empleado
- Alertas de empleados urgentes (sin vacaciones)
- Progreso de uso de vacaciones
- Envío de notificaciones masivas

**Indicadores de Alerta**:
- 🔴 **Urgente**: 0 días restantes o más de 12 meses sin vacaciones
- 🟡 **Pendiente**: Menos de 5 días restantes
- 🟢 **OK**: Estado normal

### 6. 📜 Historial de Vacaciones

**Acceso**: Menú principal → Historial

**Funcionalidades**:
- Ver todas las solicitudes históricas
- Filtros por empleado, estado, fechas
- Paginación de resultados
- Exportación de datos (próximamente)

**Filtros Disponibles**:
- Por empleado
- Por estado (Aprobado/Rechazado/Pendiente)
- Por rango de fechas
- Por período

### 7. 👥 Gestión de Empleados

**Acceso**: Menú principal → Gestión de Empleados (Solo administradores)

**Funcionalidades**:
- Crear nuevo empleado
- Editar información de empleado
- Actualizar días de vacaciones
- Cambiar estado (Activo/Cesado/Vacaciones)
- Asignar puesto y área

**Información del Empleado**:
- Datos personales (DNI, nombres, apellidos)
- Información de contacto (teléfono, email)
- Datos laborales (puesto, área, supervisor)
- Información de vacaciones
- Fechas importantes (ingreso, cese)

### 8. 📢 Portal de Comunicaciones

**Acceso**: Menú principal → Portal

**Funcionalidades**:
- Ver publicaciones de la empresa
- Leer boletines informativos
- Ver anuncios importantes
- Comunicados de RRHH

**Tipos de Publicaciones**:
- Comunicados generales
- Políticas actualizadas
- Eventos de empresa
- Avisos importantes

---

## Próximos Pasos y Funcionalidades Pendientes

### 🚀 Fase 1: Completar Funcionalidades Básicas (1-2 meses)

#### Prioridad Alta
1. **Sistema de Aprobación de Vacaciones**
   - [ ] Módulo de aprobador/supervisor
   - [ ] Flujo completo de aprobación/rechazo
   - [ ] Notificaciones automáticas por email
   - [ ] Dashboard de solicitudes pendientes para supervisores

2. **Cálculo Automático de Días**
   - [ ] Cálculo de días de antigüedad automático
   - [ ] Actualización periódica de saldos
   - [ ] Generación automática de períodos vacacionales
   - [ ] Reportes de vencimiento de vacaciones

3. **Notificaciones en Tiempo Real**
   - [ ] Sistema de notificaciones push
   - [ ] Alertas de solicitudes pendientes
   - [ ] Recordatorios de vacaciones próximas a vencer
   - [ ] Notificaciones de cambios de estado

#### Prioridad Media
4. **Reportes y Exportación**
   - [ ] Exportar historial a Excel/PDF
   - [ ] Reportes de vacaciones por departamento
   - [ ] Gráficos de tendencias de vacaciones
   - [ ] Informe de auditoría

5. **Calendario de Vacaciones**
   - [ ] Vista de calendario mensual/anual
   - [ ] Visualización de ausencias del equipo
   - [ ] Planificador de vacaciones
   - [ ] Detección de conflictos de equipo

6. **Mejoras en Portal de Empleados**
   - [ ] Perfil de usuario editable
   - [ ] Cambio de contraseña
   - [ ] Foto de perfil
   - [ ] Historial de notificaciones

### 🌟 Fase 2: Funcionalidades Avanzadas (3-6 meses)

7. **Gestión de Permisos y Licencias**
   - [ ] Solicitud de permisos médicos
   - [ ] Licencias por maternidad/paternidad
   - [ ] Permisos especiales
   - [ ] Tracking de horas compensatorias

8. **Sistema de Evaluación de Desempeño**
   - [ ] Evaluaciones periódicas
   - [ ] Objetivos y KPIs
   - [ ] Feedback 360°
   - [ ] Planes de desarrollo

9. **Gestión de Nómina (Básica)**
   - [ ] Cálculo de salarios
   - [ ] Descuentos y bonificaciones
   - [ ] Boletas de pago digitales
   - [ ] Historial de pagos

10. **Control de Asistencia**
    - [ ] Registro de entrada/salida
    - [ ] Reporte de tardanzas
    - [ ] Control de horas extras
    - [ ] Integración con sistema de marcación

### 🎯 Fase 3: Optimización y Escalabilidad (6-12 meses)

11. **Aplicación Móvil**
    - [ ] App para iOS/Android
    - [ ] Notificaciones push móviles
    - [ ] Aprobaciones desde móvil
    - [ ] Consulta de información

12. **Inteligencia Artificial y Automatización**
    - [ ] Sugerencias de fechas óptimas para vacaciones
    - [ ] Predicción de necesidades de personal
    - [ ] Chatbot de RRHH
    - [ ] Análisis predictivo de rotación

13. **Integración con Otros Sistemas**
    - [ ] Integración con ERP
    - [ ] Sincronización con Active Directory
    - [ ] APIs públicas para terceros
    - [ ] Webhooks para eventos

14. **Analytics y Business Intelligence**
    - [ ] Dashboard ejecutivo
    - [ ] Análisis de tendencias
    - [ ] Predicciones de carga laboral
    - [ ] Reportes personalizados

### 🔧 Mejoras Técnicas Continuas

15. **Seguridad**
    - [ ] Autenticación de dos factores (2FA)
    - [ ] Auditoría de cambios
    - [ ] Encriptación de datos sensibles
    - [ ] Políticas de seguridad avanzadas

16. **Performance**
    - [ ] Optimización de consultas
    - [ ] Caché de datos frecuentes
    - [ ] Lazy loading de componentes
    - [ ] CDN para recursos estáticos

17. **UX/UI**
    - [ ] Modo oscuro
    - [ ] Temas personalizables
    - [ ] Accesibilidad (WCAG)
    - [ ] Internacionalización (i18n)

---

## Preguntas Frecuentes

### ❓ Sobre Vacaciones

**P: ¿Cuántos días de vacaciones tengo al año?**
R: Los empleados regulares tienen 30 días calendario por año, más días adicionales por antigüedad.

**P: ¿Puedo tomar mis vacaciones en varios bloques?**
R: Sí, puede dividir sus vacaciones, pero cada bloque debe tener un mínimo de 5 días.

**P: ¿Con cuánta anticipación debo solicitar vacaciones?**
R: Mínimo 15 días de anticipación. Para períodos vacacionales, 30 días.

**P: ¿Qué pasa si mi solicitud es rechazada?**
R: Los días se devuelven automáticamente a su saldo. Puede coordinar con su supervisor para nuevas fechas.

**P: ¿Puedo cancelar una solicitud aprobada?**
R: Debe contactar a RRHH para cancelaciones de solicitudes ya aprobadas.

### ❓ Sobre el Sistema

**P: ¿Cómo recupero mi contraseña?**
R: Contacte al departamento de RRHH para restablecer su contraseña.

**P: ¿Puedo usar el sistema desde mi celular?**
R: Actualmente el sistema es responsive y funciona en navegadores móviles. Una app nativa está en desarrollo.

**P: ¿Cómo actualizo mi información personal?**
R: Contacte a RRHH para actualizar datos personales. Próximamente podrá editarlos desde su perfil.

### ❓ Sobre Aprobaciones

**P: ¿Quién aprueba mis vacaciones?**
R: Su supervisor directo revisa primero, luego RRHH hace la aprobación final.

**P: ¿Cuánto tiempo tarda la aprobación?**
R: Generalmente 3-5 días hábiles. Recibirá notificación por email.

**P: ¿Puedo ver el estado de mi solicitud?**
R: Sí, en el módulo "Mis Solicitudes" puede ver el estado en tiempo real.

---

## Soporte Técnico

### 📞 Contacto

**Departamento de RRHH**
- Email: rrhh@agrovet.com
- Teléfono: (01) 123-4567
- Horario: Lunes a Viernes, 8:00 AM - 6:00 PM

**Soporte Técnico**
- Email: soporte@agrovet.com
- Teléfono: (01) 123-4568
- Horario: Lunes a Viernes, 8:00 AM - 8:00 PM

### 🐛 Reporte de Errores

Si encuentra algún error en el sistema:

1. Tome una captura de pantalla del error
2. Anote los pasos para reproducir el problema
3. Envíe la información a soporte@agrovet.com
4. Incluya su nombre de usuario y hora del incidente

### 💡 Sugerencias

Sus ideas son importantes. Envíe sugerencias de mejora a:
- Email: sugerencias@agrovet.com
- Formulario interno (próximamente)

---

## Glosario de Términos

| Término | Definición |
|---------|------------|
| **Días Calendario** | Incluye todos los días, incluyendo fines de semana y feriados |
| **Días Laborables** | Solo días de trabajo, excluyendo fines de semana |
| **Bloque Continuo** | Período de vacaciones sin interrupciones |
| **Antigüedad** | Tiempo transcurrido desde la fecha de ingreso |
| **Saldo Disponible** | Días de vacaciones que puede solicitar actualmente |
| **Período Vacacional** | Temporadas de alta demanda (verano, fin de año) |
| **RRHH** | Recursos Humanos |

---

## Anexos

### Anexo A: Tabla de Días Adicionales por Antigüedad

| Años de Servicio | Días Adicionales |
|------------------|------------------|
| 0-1 años | 0 días |
| 1-2 años | 1 día |
| 2-3 años | 2 días |
| 3-4 años | 3 días |
| 4-5 años | 4 días |
| 5+ años | 5 días |

### Anexo B: Períodos Vacacionales Especiales

| Período | Fechas | Días de Anticipación |
|---------|--------|---------------------|
| Verano | Enero - Febrero | 30 días |
| Semana Santa | Variable | 30 días |
| Fiestas Patrias | Julio | 30 días |
| Navidad/Año Nuevo | Diciembre | 45 días |

---

**Versión del Manual**: 1.0  
**Fecha de Actualización**: Noviembre 2025  
**Próxima Revisión**: Enero 2026

---

*Este manual está sujeto a cambios. Consulte regularmente la versión más reciente en el portal interno.*
