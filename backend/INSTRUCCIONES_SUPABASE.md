# 🔧 INSTRUCCIONES PARA CONFIGURAR LA BASE DE DATOS EN SUPABASE

## ✅ Problema Resuelto
He corregido el bug en el código que impedía acceder a los datos. El código ahora usa `.rows` en lugar de `.data` para acceder a los resultados de las consultas.

## ⚠️ IMPORTANTE: Verificar que los datos existan en Supabase

Aunque el código ya está corregido, necesitas verificar que el script SQL se haya ejecutado correctamente en Supabase.

### Paso 1: Verificar si existen los datos

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/uakdewhjlgbxpyjllhqg
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Copia y pega esta consulta:

```sql
-- Verificar si existen períodos vacacionales
SELECT COUNT(*) as total_periodos FROM periodos_vacacionales;

-- Ver todos los períodos existentes
SELECT * FROM periodos_vacacionales ORDER BY empleado_id;

-- Verificar específicamente el empleado 4
SELECT * FROM periodos_vacacionales WHERE empleado_id = 4;
```

4. Haz clic en **"Run"** (▶️)

### Paso 2: Interpretar los resultados

**Si ves datos:**
- ✅ Todo está bien, el problema ya está resuelto con el fix del código

**Si NO ves datos o ves un error:**
- ❌ Necesitas ejecutar el script de configuración (ver Paso 3)

### Paso 3: Ejecutar el script de configuración (solo si NO hay datos)

1. En el **SQL Editor** de Supabase
2. Abre el archivo `backend/SUPABASE_EJECUTAR_ESTO.sql` en VS Code
3. **COPIA TODO EL CONTENIDO** del archivo (son 401 líneas)
4. Pega el contenido en el SQL Editor de Supabase
5. Haz clic en **"Run"** (▶️)
6. Espera a que termine (puede tomar unos segundos)

⚠️ **NOTA:** Este script elimina todas las tablas existentes y las recrea con datos de prueba.

### Paso 4: Verificar que funcionó

Después de ejecutar el script, vuelve a ejecutar la consulta del Paso 1. Deberías ver:

- **6 períodos vacacionales** en total
- Un período para el **empleado_id = 4** con **30 días disponibles**

```
empleado_id | dias_disponibles | dias_totales | anio_generacion | estado
------------|------------------|--------------|-----------------|--------
4           | 30               | 30           | 2024            | activo
```

### Paso 5: Probar la aplicación

1. Inicia sesión como empleado:
   - Email: `jperez@agrovet.com`
   - Password: `password123`
   
2. Ve a **"Vacaciones"**

3. Intenta crear una solicitud de vacaciones

**Resultado esperado:** 
- ✅ La solicitud se crea exitosamente
- ✅ Ya NO deberías ver el error "No hay períodos vacacionales configurados"

## 📊 Datos de Prueba Incluidos en el Script

El script crea estos usuarios de prueba:

| Email | Password | Rol | Empleado |
|-------|----------|-----|----------|
| admin@agrovet.com | admin123 | RRHH | Admin RRHH |
| jefe@agrovet.com | jefe123 | Jefe | María González |
| jperez@agrovet.com | password123 | Empleado | Juan Pérez |
| asanchez@agrovet.com | password123 | Empleado | Ana Sánchez |

Todos los empleados tienen períodos vacacionales activos con días disponibles.

## 🐛 ¿Qué se corrigió?

El problema era que el código usaba `result.data` para acceder a los resultados de las consultas, pero la función `query()` en `db.js` devuelve `{ rows: [...] }`.

**Antes (incorrecto):**
```javascript
const periodoResult = await dbQuery(periodoQuery, [empleado_id]);
if (!periodoResult.data || periodoResult.data.length === 0) {  // ❌ data es undefined
  throw new Error("No hay períodos...");
}
```

**Ahora (corregido):**
```javascript
const periodoResult = await dbQuery(periodoQuery, [empleado_id]);
if (!periodoResult.rows || periodoResult.rows.length === 0) {  // ✅ rows funciona
  throw new Error("No hay períodos...");
}
```

## ❓ ¿Necesitas ayuda?

Si después de seguir estos pasos sigues teniendo problemas:
1. Verifica que hayas copiado TODO el contenido del archivo SQL
2. Revisa la consola del navegador (F12) para ver errores
3. Revisa la terminal del backend para ver los logs
