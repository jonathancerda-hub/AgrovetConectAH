# 🚨 ALERTA DE SEGURIDAD - ACCIÓN INMEDIATA REQUERIDA

## ✅ RESUELTO - 22 de enero de 2026

### Acciones Completadas
- ✅ Código actualizado para usar variables de entorno (commit d60d793)
- ✅ Nueva Secret Key generada en Supabase: `sb_secret_M_LcE...`
- ✅ Archivo backend/.env actualizado con nueva clave
- ✅ Script cargar-empleados-api.js verificado y funcionando
- ✅ Documentación actualizada con placeholders seguros

### 🔴 ACCIÓN FINAL PENDIENTE
**DESHABILITAR LAS LEGACY KEYS EN SUPABASE**

1. Ir a: https://supabase.com/dashboard/project/uakdewhjlgbxpyjllhqg/settings/api-keys/legacy
2. Clic en **"Disable JWT-based API keys"**
3. Confirmar la acción

⚠️ **IMPORTANTE**: Esto invalidará PERMANENTEMENTE la clave expuesta en GitHub (commit 1fc92d16).

---

## Problema Original Detectado
Se expuso la **SERVICE_ROLE_KEY** de Supabase en el commit `1fc92d16` en el archivo:
- `backend/scripts/cargar-empleados-api.js` línea 12

## ¿Qué significa esto?
Esta clave permite acceso TOTAL a tu base de datos, bypasseando todas las políticas de seguridad RLS. Cualquier persona con acceso a tu repositorio puede:
- Leer todos los datos (incluyendo passwords hasheados)
- Modificar/eliminar cualquier registro
- Crear/eliminar tablas
- Ejecutar cualquier operación administrativa

## PASOS INMEDIATOS (HACER YA) 🔥

### 1. Rotar la clave en Supabase (2 minutos)
1. Ir a: https://supabase.com/dashboard/project/uakdewhjlgbxpyjllhqg/settings/api
2. En la sección "Service Role Key" (secret)
3. Hacer clic en "Rotate" o "Generate New Key"
4. Guardar la nueva clave en un lugar SEGURO (gestor de contraseñas)
5. ✅ La clave vieja quedará inválida inmediatamente

### 2. Actualizar código para usar variables de entorno (5 minutos)

#### Crear archivo `.env` en `backend/`:
```env
SUPABASE_URL=https://uakdewhjlgbxpyjllhqg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<NUEVA_CLAVE_AQUI>
```

#### Actualizar `cargar-empleados-api.js`:
```javascript
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

#### Asegurar que `.env` está en `.gitignore`:
```
# .gitignore
.env
.env.local
.env.production
*.env
```

### 3. Remover secretos del código (3 minutos)
Ejecutar estos comandos en PowerShell desde `c:\Users\jcerda\Desktop\reac\`:

```powershell
# Editar el archivo problemático
code backend\scripts\cargar-empleados-api.js

# Reemplazar las líneas 10-12 con:
# const SUPABASE_URL = process.env.SUPABASE_URL;
# const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
# const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

# Commit y push
git add -A
git commit -m "fix: remover claves hardcodeadas, usar variables de entorno"
git push origin main
```

### 4. Verificar otros archivos (IMPORTANTE)
Buscar si hay más secretos expuestos:

```powershell
# Buscar patrones de claves de Supabase
git grep -i "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
git grep -i "service_role"
git grep -i "supabase.*key"
```

### 5. Considerar limpiar historial de Git (Opcional pero recomendado)
**ADVERTENCIA**: Esto reescribe el historial y requiere force push.

```powershell
# Instalar BFG Repo-Cleaner o usar git-filter-repo
# Esto es complejo, considera si vale la pena según el alcance del repositorio
```

## ¿Qué archivos revisar?
- ✅ `backend/scripts/cargar-empleados-api.js` (CONFIRMADO)
- ❓ `backend/src/db.js`
- ❓ `backend/.env` (si está commiteado)
- ❓ Cualquier archivo en `backend/scripts/`
- ❓ Archivos de configuración de Render/Railway

## Repositorio Actual
- Nombre: jonathancerda-hub/AgrovetConectAH
- ¿Es público?: Si es público, CUALQUIERA puede ver las claves
- Commit problemático: 1fc92d16

## Después de rotar la clave
1. Actualizar variables de entorno en Render.com
2. Redesplegar backend y frontend
3. Verificar que todo funciona con la nueva clave
4. Monitorear logs de Supabase por actividad sospechosa

## Recursos
- Documentación Supabase sobre seguridad: https://supabase.com/docs/guides/api/api-keys
- GitHub Secret Scanning: https://docs.github.com/en/code-security/secret-scanning

---

**TIEMPO ESTIMADO TOTAL**: 15-20 minutos  
**PRIORIDAD**: 🔥🔥🔥 CRÍTICA - Hacer ahora mismo antes de cualquier otra cosa
