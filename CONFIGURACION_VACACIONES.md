# 🔧 Configuración del Sistema de Vacaciones

## ⚠️ Importante

El sistema de vacaciones requiere ejecutar una migración SQL en la base de datos de PostgreSQL en Render.

## 📋 Instrucciones para Ejecutar el Script SQL

### Opción 1: Desde el Dashboard de Render

1. **Ir a Render Dashboard**: https://dashboard.render.com
2. **Seleccionar tu base de datos PostgreSQL**
3. **Ir a la pestaña "Connect"**
4. **Hacer clic en "External Connection" o usar el Shell**
5. **Copiar el contenido del archivo**: `backend/database/migrations/06_fix_vacaciones.sql`
6. **Pegar y ejecutar el script**

### Opción 2: Desde tu Terminal Local

```bash
# 1. Copiar la connection string de Render
# Formato: postgresql://user:password@host:port/database

# 2. Conectarse con psql
psql "postgresql://user:password@host:port/database"

# 3. Ejecutar el script
\i backend/database/migrations/06_fix_vacaciones.sql

# O copiar y pegar el contenido directamente
```

### Opción 3: Usando DBeaver, pgAdmin o TablePlus

1. Conectarse a la base de datos de Render
2. Abrir el archivo `06_fix_vacaciones.sql`
3. Ejecutar el script completo

## ✅ Verificación

Después de ejecutar el script, verifica que se crearon las tablas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tipos_trabajador', 'periodos_vacacionales', 'feriados');
```

Deberías ver 3 tablas.

## 📊 ¿Qué hace el script?

El script `06_fix_vacaciones.sql` crea:

1. ✅ **Tabla `tipos_trabajador`**: Define tipos de empleados (Tiempo Completo=30 días, Part Time=7, Practicante=15)
2. ✅ **Tabla `periodos_vacacionales`**: Almacena los períodos de vacaciones de cada empleado
3. ✅ **Tabla `feriados`**: Contiene los 13 feriados oficiales de Perú 2025
4. ✅ **Vista `vista_resumen_vacaciones`**: Resume el estado de vacaciones por empleado
5. ✅ **Función `calcular_dias_calendario()`**: Calcula días entre fechas
6. ✅ **Datos de prueba**: Crea un período de 30 días para el primer empleado activo

## 🚀 Estado Actual del Sistema

### ✅ Funcionalidades que YA funcionan (sin BD):

- Formulario de solicitud con DatePickers en español
- Validación básica de fechas (fecha fin > fecha inicio)
- Cálculo de días calendario
- Popups bonitos (MUI Dialogs)
- Interfaz completa y responsive

### 🔄 Funcionalidades que requieren BD:

- Validación de todas las 14 reglas de negocio
- Mostrar saldo de días disponibles
- Consultar períodos activos
- Validar límite de viernes
- Verificar feriados
- Crear solicitudes en la base de datos
- Sistema de aprobaciones

## 📞 Soporte

Si tienes problemas ejecutando el script, contacta al administrador del sistema.

---

**Última actualización**: 6 de noviembre de 2025
