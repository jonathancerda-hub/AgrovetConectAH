# 🚀 Guía de Despliegue en Render.com

## 📋 Requisitos Previos

- ✅ Cuenta en GitHub (ya tienes)
- ✅ Repositorio: https://github.com/jonathancerda-hub/AgrovetConectAH.git
- ✅ Cuenta en Supabase (ya configurada)
- ✅ Cuenta en Render.com (crear si no tienes)

---

## 🎯 PASO 1: Preparar el Repositorio en GitHub

### 1.1 Subir los cambios recientes
```bash
cd C:\Users\jcerda\Desktop\reac
git add .
git commit -m "Preparar proyecto para producción en Render"
git push origin main
```

### 1.2 Verificar que `.env` esté en `.gitignore`
El archivo `.env` NO debe subirse a GitHub (ya está ignorado).

---

## 🎯 PASO 2: Configurar Supabase (Base de Datos)

### 2.1 Verificar RPC Functions en Supabase
1. Ve a **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto: `uakdewhjlgbxpyjllhqg`
3. Ve a **SQL Editor**
4. Ejecuta el archivo `backend/CREAR_FUNCIONES_RPC.sql` (si no lo has hecho)

### 2.2 Obtener credenciales de Supabase
**Necesitarás estos valores para Render:**

#### URL y API Key:
- **SUPABASE_URL**: `https://uakdewhjlgbxpyjllhqg.supabase.co`
- **SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2Rld2hqbGdieHB5amxsaHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjk5NDQsImV4cCI6MjA3OTc0NTk0NH0.D7OIEJ5xltJk2eefh0wBbEU-V2D2K_Wy8SSoWgK54vM`

#### PostgreSQL Connection (Session Pooler):
- **PGHOST**: `aws-1-sa-east-1.pooler.supabase.com`
- **PGPORT**: `5432`
- **PGDATABASE**: `postgres`
- **PGUSER**: `postgres.uakdewhjlgbxpyjilhqg`
- **PGPASSWORD**: `Agrovet2025-`

---

## 🎯 PASO 3: Desplegar Backend en Render

### 3.1 Crear cuenta en Render
1. Ve a https://render.com
2. Haz clic en **"Get Started"**
3. Conecta con tu cuenta de GitHub

### 3.2 Crear Web Service para Backend
1. En el Dashboard de Render, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio: `jonathancerda-hub/AgrovetConectAH`
3. Configura el servicio:

**Configuración Básica:**
- **Name**: `agrovet-api`
- **Region**: `Oregon (US West)` (más cercano a Supabase)
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Runtime**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

**Plan:**
- Selecciona: **Free** (para empezar)

### 3.3 Configurar Variables de Entorno del Backend
Haz clic en **"Advanced"** y agrega estas variables:

```
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://uakdewhjlgbxpyjllhqg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2Rld2hqbGdieHB5amxsaHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjk5NDQsImV4cCI6MjA3OTc0NTk0NH0.D7OIEJ5xltJk2eefh0wBbEU-V2D2K_Wy8SSoWgK54vM
PGHOST=aws-1-sa-east-1.pooler.supabase.com
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres.uakdewhjlgbxpyjilhqg
PGPASSWORD=Agrovet2025-
JWT_SECRET=agrovet_production_secret_2025_change_this_RANDOM
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://agrovet-frontend.onrender.com
```

⚠️ **IMPORTANTE**: 
- Cambia `JWT_SECRET` por un valor aleatorio seguro
- `CORS_ORIGIN` se actualizará después de crear el frontend

### 3.4 Crear el servicio
1. Haz clic en **"Create Web Service"**
2. Espera a que termine el despliegue (5-10 minutos)
3. Copia la URL de tu backend (ejemplo: `https://agrovet-api.onrender.com`)

### 3.5 Probar el Backend
Visita: `https://agrovet-api.onrender.com/health`

Deberías ver:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-27T..."
}
```

---

## 🎯 PASO 4: Desplegar Frontend en Render

### 4.1 Crear el archivo de configuración de producción
Antes de continuar, necesitamos crear un archivo `.env.production` en el frontend.

### 4.2 Crear Static Site para Frontend
1. En Render Dashboard, haz clic en **"New +"** → **"Static Site"**
2. Conecta el mismo repositorio: `jonathancerda-hub/AgrovetConectAH`
3. Configura el servicio:

**Configuración Básica:**
- **Name**: `agrovet-frontend`
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 4.3 Configurar Variables de Entorno del Frontend
Agrega esta variable:

```
VITE_API_URL=https://agrovet-api.onrender.com
```

⚠️ **Reemplaza** `agrovet-api` con el nombre real de tu servicio backend.

### 4.4 Configurar Rewrites para SPA
En **"Redirects/Rewrites"**, agrega:

- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: `Rewrite`

### 4.5 Crear el servicio
1. Haz clic en **"Create Static Site"**
2. Espera a que termine el despliegue (3-5 minutos)
3. Copia la URL (ejemplo: `https://agrovet-frontend.onrender.com`)

---

## 🎯 PASO 5: Actualizar CORS del Backend

### 5.1 Actualizar variable CORS_ORIGIN
1. Ve al servicio **agrovet-api** en Render
2. Ve a **"Environment"**
3. Edita la variable `CORS_ORIGIN`
4. Cambia a: `https://agrovet-frontend.onrender.com`
5. Guarda (el servicio se reiniciará automáticamente)

---

## 🎯 PASO 6: Verificaciones Finales

### 6.1 Probar el sistema completo
1. Visita tu frontend: `https://agrovet-frontend.onrender.com`
2. Intenta hacer login con:
   - **Email**: `ursula.huamancaja@agrovet.com`
   - **Password**: `rrhh123`
3. Verifica que el Dashboard RRHH cargue correctamente

### 6.2 Verificar logs si hay errores
- **Backend logs**: Render Dashboard → agrovet-api → Logs
- **Frontend logs**: Render Dashboard → agrovet-frontend → Logs

---

## 📊 Resumen de URLs

| Servicio | URL Local | URL Producción |
|----------|-----------|----------------|
| Frontend | http://localhost:5173 | https://agrovet-frontend.onrender.com |
| Backend | http://localhost:3001 | https://agrovet-api.onrender.com |
| Database | - | Supabase (aws-1-sa-east-1) |

---

## ⚙️ Variables de Entorno - Resumen

### Backend (agrovet-api)
```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://uakdewhjlgbxpyjllhqg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PGHOST=aws-1-sa-east-1.pooler.supabase.com
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres.uakdewhjlgbxpyjilhqg
PGPASSWORD=Agrovet2025-
JWT_SECRET=TU_SECRET_ALEATORIO_AQUI
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://agrovet-frontend.onrender.com
```

### Frontend (agrovet-frontend)
```env
VITE_API_URL=https://agrovet-api.onrender.com
```

---

## 🔧 Solución de Problemas Comunes

### Problema 1: Error 500 en el backend
**Solución**: Verifica los logs y asegúrate de que las credenciales de Supabase sean correctas.

### Problema 2: CORS error
**Solución**: Verifica que `CORS_ORIGIN` en el backend tenga la URL exacta del frontend.

### Problema 3: El frontend no se conecta al backend
**Solución**: Verifica que `VITE_API_URL` esté correctamente configurado.

### Problema 4: "Database disconnected"
**Solución**: Verifica que las RPC functions estén creadas en Supabase.

### Problema 5: El servicio se duerme (Free tier)
**Nota**: En el plan gratuito, los servicios se duermen después de 15 minutos de inactividad. Se reactivan automáticamente con la primera petición (puede tardar 30-60 segundos).

---

## 🚀 Mejoras Futuras (Opcional)

1. **Dominio Personalizado**: Configurar un dominio propio en lugar de `.onrender.com`
2. **SSL**: Render proporciona SSL gratuito automáticamente
3. **Plan Paid**: Considerar upgrade para evitar que los servicios se duerman
4. **CI/CD**: Ya configurado automáticamente con GitHub
5. **Monitoreo**: Configurar alertas en Render para downtime

---

## 📝 Notas Importantes

1. **Plan Gratuito**: Los servicios gratuitos en Render se suspenden después de 15 minutos de inactividad
2. **Auto-Deploy**: Cada push a `main` en GitHub desplegará automáticamente
3. **Logs**: Revisa los logs en tiempo real desde el dashboard de Render
4. **Backup**: Supabase hace backups automáticos de tu base de datos
5. **Seguridad**: Las variables de entorno están encriptadas en Render

---

## ✅ Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] RPC Functions creadas en Supabase
- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas en Backend
- [ ] Health check funcionando (`/health`)
- [ ] Frontend desplegado en Render
- [ ] Variables de entorno configuradas en Frontend
- [ ] CORS actualizado en Backend
- [ ] Login funcionando en producción
- [ ] Dashboard RRHH cargando datos correctamente

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en Render Dashboard
2. Verifica las variables de entorno
3. Comprueba que Supabase esté funcionando
4. Verifica la conexión entre servicios

---

**¡Listo para producción! 🎉**
