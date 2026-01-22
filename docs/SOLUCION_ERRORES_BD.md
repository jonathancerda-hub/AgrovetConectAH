# Soluciones a Errores de Base de Datos

## 📋 Histórico de Problemas y Soluciones

### ✅ Error de Conexión Supabase - 22 enero 2026

#### **Problema:**
```
Failed to load resource: the server responded with a status of 500 ()
Error de API
Error de login
No se pudieron cargar los empleados
```

#### **Causa Raíz:**
- GitHub Secret Scanning detectó `SUPABASE_SERVICE_ROLE_KEY` expuesta en commit `1fc92d16`
- Se deshabilitaron las **Legacy JWT API keys** (formato `eyJhbG...`) en Supabase Dashboard
- El backend y frontend seguían usando las claves legacy deshabilitadas
- Supabase migró a nuevo sistema de claves: **Publishable** y **Secret** keys (formato `sb_publishable_...` y `sb_secret_...`)

#### **Síntomas:**
1. Backend en Render.com devolviendo 500 en todas las peticiones
2. Frontend no puede autenticar usuarios
3. Login falla con "Error del servidor"
4. Gestión de Empleados muestra error pero los datos sí cargan
5. URL hardcodeada `localhost:3001` en producción

#### **Solución Paso a Paso:**

##### 1. **Generar nuevas claves en Supabase**
```
URL: https://supabase.com/dashboard/project/TU_PROYECTO/settings/api-keys
```
- **Pestaña "Publishable and secret API keys"**
  - Publishable key (default): `sb_publishable_...` → Reemplaza `SUPABASE_ANON_KEY`
  - Secret key (default): `sb_secret_...` → Reemplaza `SUPABASE_SERVICE_ROLE_KEY`

##### 2. **Actualizar código para usar variables de entorno**

**Antes (❌ INSEGURO):**
```javascript
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Hardcodeado
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Después (✅ SEGURO):**
```javascript
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que existan
if (!SUPABASE_URL || !SUPABASE_KEY || !SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: Faltan variables de entorno');
  process.exit(1);
}
```

##### 3. **Actualizar backend/.env local**
```env
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_ANON_KEY=sb_publishable_XXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=sb_secret_XXXXXXXX
```

##### 4. **Actualizar variables de entorno en Render.com**
```
Dashboard → Service (agrovet-api) → Environment → Environment Variables
```
Agregar/actualizar:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` = Publishable key
- Clic en "Save, rebuild, and deploy"

##### 5. **Deshabilitar claves legacy comprometidas**
```
URL: https://supabase.com/dashboard/project/TU_PROYECTO/settings/api-keys/legacy
```
- Pestaña "Legacy anon, service_role API keys"
- Clic en "Disable JWT-based API keys"
- Confirmar acción

##### 6. **Arreglar URLs hardcodeadas en frontend**

**Antes (❌):**
```javascript
const tiposResponse = await fetch('http://localhost:3001/api/vacaciones/tipos-trabajador', {
```

**Después (✅):**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const tiposResponse = await fetch(`${API_URL}/vacaciones/tipos-trabajador`, {
```

##### 7. **Verificar funcionamiento**
```powershell
# Probar backend local
cd backend
node scripts/cargar-empleados-api.js

# Si funciona, las claves están correctas
```

#### **Commits Relacionados:**
- `d60d793` - Remover claves hardcodeadas, usar variables de entorno
- `3ce47fa` - Documentar resolución de alerta de seguridad
- `1f9e907` - Agregar sección de seguridad al Project Context
- `43414c8` - Usar variable de entorno para API en GestionEmpleados

#### **Archivos Modificados:**
- `backend/scripts/cargar-empleados-api.js` - Usar dotenv
- `backend/.env` - Nuevas claves
- `src/features/vacations/components/GestionEmpleados.jsx` - URL dinámica
- `docs/guides/RESUMEN_DEPLOY.md` - Placeholders seguros
- `docs/guides/RENDER_VISUAL_GUIDE.md` - Placeholders seguros

---

## 🔍 Diagnóstico Rápido de Errores Comunes

### Error: "Failed to load resource: 500"
**Posibles causas:**
1. ✅ Claves de Supabase deshabilitadas o incorrectas
2. ✅ Variables de entorno no configuradas en Render
3. ✅ Backend no se redesployó después de cambiar variables
4. ⚠️ RLS policies bloqueando acceso
5. ⚠️ Tabla o columna no existe en BD

**Cómo verificar:**
```bash
# Ver logs del backend en Render
Dashboard → Service → Logs (últimas 100 líneas)

# Buscar líneas con:
- "Error connecting to Supabase"
- "Missing environment variables"
- "401 Unauthorized"
- "403 Forbidden"
```

### Error: "No se pudieron cargar los empleados"
**Posibles causas:**
1. ✅ URL hardcodeada a localhost en producción
2. ✅ Token JWT expirado o inválido
3. ⚠️ CORS bloqueando peticiones
4. ⚠️ Backend dormido (plan Free de Render)

**Solución:**
```javascript
// Siempre usar variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Error: "duplicate key value violates unique constraint"
**Causa:** Intentando insertar datos que ya existen (DNI, email, código empleado)

**Solución:**
```sql
-- Verificar antes de insertar
SELECT * FROM empleados WHERE dni = 'XXXXXXXX';

-- O usar UPSERT
INSERT INTO empleados (...) VALUES (...)
ON CONFLICT (dni) DO UPDATE SET ...;
```

---

## 📚 Referencias Útiles

### Documentación Supabase
- API Keys: https://supabase.com/docs/guides/api/api-keys
- Migración a nuevas claves: https://supabase.com/docs/guides/api/migrating-to-api-keys
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security

### Herramientas de Diagnóstico
- Supabase Dashboard → Logs (Database, API, Auth)
- Render Dashboard → Logs (Build, Deploy, Runtime)
- Browser DevTools → Network tab (ver peticiones fallidas)

### Comandos Útiles
```powershell
# Ver logs de backend local
cd backend
npm run dev

# Probar conexión a Supabase
node -e "console.log(process.env.SUPABASE_URL)"

# Verificar que .env no esté en Git
git ls-files | grep .env

# Ver historial de commits de seguridad
git log --grep="security\|fix\|secret" --oneline
```

---

## ⚠️ Prevención de Problemas Futuros

### ✅ Checklist antes de commitear:
- [ ] No hay secretos hardcodeados en código
- [ ] `.env` está en `.gitignore`
- [ ] URLs usan variables de entorno (`VITE_API_URL`, etc.)
- [ ] Verificar que no se commitean claves accidentalmente:
  ```bash
  git diff --staged | grep -i "key\|secret\|password"
  ```

### ✅ Checklist antes de desplegar:
- [ ] Variables de entorno actualizadas en Render
- [ ] Backend y frontend redesployados
- [ ] Claves comprometidas deshabilitadas en Supabase
- [ ] Probar login en producción
- [ ] Verificar que todas las páginas cargan correctamente

### ✅ Rotación de claves periódica:
- Cada 3-6 meses rotar claves de producción
- Siempre que haya una brecha de seguridad
- Al cambiar miembros del equipo con acceso

---

## 📝 Notas Adicionales

### Diferencias entre tipos de claves Supabase:

| Tipo | Formato | Uso | Respeta RLS |
|------|---------|-----|-------------|
| Publishable Key | `sb_publishable_...` | Frontend, backend normal | ✅ Sí |
| Secret Key | `sb_secret_...` | Scripts admin, backend privilegiado | ❌ No (bypass) |
| Legacy anon | `eyJhbG...` (JWT) | **DEPRECATED** | ✅ Sí |
| Legacy service_role | `eyJhbG...` (JWT) | **DEPRECATED** | ❌ No |

### Cuándo usar cada clave:
- **Publishable**: Autenticación de usuarios, CRUD normal, frontend
- **Secret**: Importación masiva de datos, operaciones administrativas, scripts de mantenimiento

**IMPORTANTE:** Nunca exponer Secret Key en frontend o repositorio público.
