# Contexto del Proyecto: Aplicación de Solicitud de Vacaciones

## Visión General

Este proyecto parece ser una aplicación web diseñada para gestionar las solicitudes de vacaciones de los empleados. Proporciona una interfaz de usuario para que los empleados puedan solicitar días libres y consultar información relevante como su estado actual de vacaciones y las políticas de la empresa.

## Tecnologías Clave

La aplicación utiliza un ecosistema moderno de React para su desarrollo frontend, aprovechando las siguientes librerías y herramientas:

-   **React:** Librería principal de JavaScript para la construcción de interfaces de usuario interactivas.
-   **React Hook Form:** Una librería para la gestión de formularios en React, conocida por su rendimiento y flexibilidad. Se utiliza para manejar el estado del formulario y la validación de los campos.
-   **Material-UI (MUI):** Un popular framework de UI para React que implementa el Material Design de Google. Se emplea para el diseño visual, proporcionando componentes preconstruidos como `TextField`, `Button`, `Box`, `Grid`, `Paper`, `Typography`, `Stack`, `Chip`, `Tooltip` e iconos.
-   **Emotion:** Una librería CSS-in-JS utilizada internamente por Material-UI para la estilización de componentes.
-   **Babel:** Un compilador de JavaScript que permite el uso de características modernas de JavaScript y sintaxis JSX, transpilándolas para una mayor compatibilidad con navegadores.

## Características Principales

### 1. Formulario de Solicitud de Vacaciones

-   **Entrada de Fechas:** Permite a los usuarios seleccionar una fecha de inicio y una fecha de fin para sus vacaciones.
-   **Información Predefinida:** Muestra automáticamente el tipo de vacaciones (ej. "Regulares") y el período vacacional (ej. "2025-2026"), que parecen ser campos de solo lectura.
-   **Comentarios Opcionales:** Incluye un campo de texto para que los usuarios puedan añadir un motivo o comentarios adicionales a su solicitud.
-   **Validación de Formulario:** Utiliza React Hook Form para validar campos obligatorios, como las fechas de inicio y fin.
-   **Acciones del Formulario:** Botones para "Enviar Solicitud", "Ver mis solicitudes" y "Regresar al Inicio".

### 2. Estado de Vacaciones del Empleado

-   **Resumen Visual:** Muestra un resumen claro del estado de las vacaciones del empleado, incluyendo:
    -   Días por Año.
    -   Días Tomados.
    -   Días Restantes.
    -   Días de Antigüedad.

### 3. Políticas y Reglas de Vacaciones

-   **Información Detallada:** Proporciona a los usuarios las políticas y recomendaciones de la empresa relacionadas con las solicitudes de vacaciones, tales como:
    -   La política principal de días anuales otorgados.
    -   Recomendaciones para incluir fines de semana.
    -   Flexibilidad en la elección de períodos.
    -   Tiempo mínimo de aviso previo para las solicitudes.
    -   Límite máximo de días consecutivos por solicitud.

### 4. Dashboard de Recursos Humanos (RRHH)

-   **Vista de Control:** Panel de control para el rol de RRHH que muestra información consolidada de todos los empleados.
-   **Información Mostrada:** 
    -   Empleado (con avatar e inicial)
    -   Puesto y área de trabajo
    -   Antigüedad en la empresa
    -   Días disponibles, tomados y restantes
    -   Solicitudes pendientes de aprobación
    -   Última solicitud realizada
    -   Alertas visuales con código de colores
-   **Estilo de Tabla:** Sigue el estándar de `GestionEmpleados.jsx` con encabezado gris claro (`grey.100`)
-   **Buscador:** Campo de búsqueda para filtrar empleados por nombre o puesto

### 5. Gestión de Empleados

-   **CRUD de Empleados:** Interfaz para crear, leer, actualizar y eliminar información de empleados.
-   **Campos Gestionados:** DNI, nombre, puesto, área, tipo de contrato, días de vacaciones, estado.
-   **Estilo de Referencia:** Componente `GestionEmpleados.jsx` que define el estándar visual de tablas.

## Estructura del Proyecto (Fragmentos Relevantes)

El archivo `src/features/vacations/components/RequestForm.jsx` sugiere una estructura de directorios basada en características, donde `vacations` es una característica modular y bien definida.

```
reac/
├── node_modules/
│   └── ... (dependencias como @emotion, @babel, @mui, react)
└── src/
    └── features/
        └── vacations/
            └── components/
                └── RequestForm.jsx
```

El componente `RequestForm.jsx` está dividido en dos columnas principales: una para el formulario de solicitud y otra para mostrar el estado de las vacaciones y las políticas.
