# 📸 Guía Visual - Configuración en Render.com

## 🎯 PASO 1: Crear Web Service (Backend)

### 1.1 Nuevo Servicio
```
Dashboard → New + → Web Service
```

### 1.2 Conectar Repositorio
- Buscar: `jonathancerda-hub/AgrovetConectAH`
- Click en **Connect**

### 1.3 Configuración del Servicio

**Pestaña: Settings**

| Campo | Valor |
|-------|-------|
| Name | `agrovet-api` |
| Region | `Oregon (US West)` |
| Branch | `main` |
| Root Directory | *(dejar vacío)* |
| Runtime | `Node` |
| Build Command | `cd backend && npm install` |
| Start Command | `cd backend && npm start` |
| Instance Type | `Free` |

### 1.4 Variables de Entorno

**Pestaña: Environment**

Click en **Add Environment Variable** para cada una:

```
Variable                  | Value
--------------------------|------------------------------------------
NODE_ENV                  | production
PORT                      | 10000
SUPABASE_URL              | https://uakdewhjlgbxpyjllhqg.supabase.co
SUPABASE_ANON_KEY         | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2Rld2hqbGdieHB5amxsaHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjk5NDQsImV4cCI6MjA3OTc0NTk0NH0.D7OIEJ5xltJk2eefh0wBbEU-V2D2K_Wy8SSoWgK54vM
PGHOST                    | aws-1-sa-east-1.pooler.supabase.com
PGPORT                    | 5432
PGDATABASE                | postgres
PGUSER                    | postgres.uakdewhjlgbxpyjilhqg
PGPASSWORD                | Agrovet2025-
JWT_SECRET                | agrovet_prod_secret_2025_CAMBIAR_POR_ALGO_ALEATORIO
JWT_EXPIRES_IN            | 24h
CORS_ORIGIN               | https://agrovet-frontend.onrender.com
```

⚠️ **IMPORTANTE**: 
- `JWT_SECRET`: Cambia por un valor aleatorio largo y complejo
- `CORS_ORIGIN`: Actualiza después de crear el frontend (Paso 2)

### 1.5 Crear y Desplegar

1. Click en **Create Web Service**
2. Espera 5-10 minutos mientras despliega
3. Verás logs en tiempo real
4. Cuando termine, el estado será: **Live** 🟢

### 1.6 Verificar Despliegue

Copia la URL del servicio (ejemplo: `https://agrovet-api.onrender.com`)

Prueba en el navegador:
```
https://agrovet-api.onrender.com/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-27T..."
}
```

✅ **Backend funcionando!**

---

## 🎯 PASO 2: Crear Static Site (Frontend)

### 2.1 Nuevo Servicio
```
Dashboard → New + → Static Site
```

### 2.2 Conectar Repositorio
- Mismo repositorio: `jonathancerda-hub/AgrovetConectAH`
- Click en **Connect**

### 2.3 Configuración del Servicio

**Pestaña: Settings**

| Campo | Valor |
|-------|-------|
| Name | `agrovet-frontend` |
| Branch | `main` |
| Root Directory | *(dejar vacío)* |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### 2.4 Variables de Entorno

**Pestaña: Environment**

```
Variable        | Value
----------------|------------------------------------------
VITE_API_URL    | https://agrovet-api.onrender.com/api
```

⚠️ **Reemplaza** `agrovet-api` con el nombre real de tu backend.

### 2.5 Configurar Redirects (SPA)

**Pestaña: Redirects/Rewrites**

Click en **Add Rewrite Rule**:

```
Source      : /*
Destination : /index.html
Action      : Rewrite
```

Esto es necesario para que React Router funcione correctamente.

### 2.6 Crear y Desplegar

1. Click en **Create Static Site**
2. Espera 3-5 minutos mientras despliega
3. Cuando termine, el estado será: **Live** 🟢

### 2.7 Copiar URL del Frontend

Ejemplo: `https://agrovet-frontend.onrender.com`

---

## 🎯 PASO 3: Actualizar CORS del Backend

### 3.1 Editar Variable de Entorno

1. Ve al servicio **agrovet-api** en Render
2. Click en **Environment** (menú izquierdo)
3. Busca la variable: `CORS_ORIGIN`
4. Click en **Edit**
5. Cambia el valor a: `https://agrovet-frontend.onrender.com`
   *(Usa TU URL del frontend)*
6. Click en **Save Changes**

### 3.2 El servicio se reiniciará automáticamente

Espera 1-2 minutos para que el backend se reinicie.

---

## 🎯 PASO 4: Probar la Aplicación

### 4.1 Acceder al Frontend

Visita: `https://agrovet-frontend.onrender.com`

### 4.2 Login de Prueba

**Usuario RRHH:**
- Email: `ursula.huamancaja@agrovet.com`
- Password: `rrhh123`

**Usuario Admin:**
- Email: `admin@agrovet.com`
- Password: `admin123`

### 4.3 Verificar Funcionalidades

1. ✅ Login exitoso
2. ✅ Dashboard carga correctamente
3. ✅ Dashboard RRHH muestra empleados
4. ✅ Calendario carga eventos
5. ✅ Solicitudes de vacaciones funcionan

---

## 🔧 Características de Render (Plan Gratuito)

### ✅ Incluido
- SSL/HTTPS automático
- Auto-deploy desde GitHub
- Logs en tiempo real
- Environment variables encriptadas
- 750 horas/mes de ejecución

### ⚠️ Limitaciones
- El servicio se **duerme** después de 15 minutos de inactividad
- Primera petición después de dormir tarda 30-60 segundos
- 512MB de RAM
- Recursos compartidos

### 💡 Solución: Upgrade a Plan Starter ($7/mes)
- Servicios siempre activos
- Más recursos
- Sin limitaciones de inactividad

---

## 📊 Monitoreo y Logs

### Ver Logs del Backend
```
Dashboard → agrovet-api → Logs
```

Verás logs en tiempo real de todas las peticiones y errores.

### Ver Logs del Frontend
```
Dashboard → agrovet-frontend → Logs
```

Verás el proceso de build y deploy.

### Métricas
```
Dashboard → agrovet-api → Metrics
```

Gráficas de:
- CPU usage
- Memory usage
- Request count
- Response time

---

## 🔄 Auto-Deploy desde GitHub

### Cómo funciona

1. Haces `git push` a `main`
2. Render detecta el cambio automáticamente
3. Inicia un nuevo deploy
4. Reemplaza la versión anterior cuando termina

### Desactivar Auto-Deploy

```
Dashboard → Servicio → Settings → Auto-Deploy
```

Cambia a: **No, I'll deploy manually**

### Deploy Manual

```
Dashboard → Servicio → Manual Deploy → Deploy latest commit
```

---

## 🆘 Solución de Problemas Visuales

### Problema: Build Failed

**Ver logs:**
```
Dashboard → Servicio → Logs
```

**Causas comunes:**
- Error en `package.json`
- Comando de build incorrecto
- Variables de entorno faltantes

**Solución:**
1. Corregir el error en el código
2. Hacer `git push`
3. Render auto-deploys

### Problema: Service Unavailable

**Causa:** El servicio se está iniciando (plan gratuito)

**Solución:** Espera 30-60 segundos y recarga

### Problema: CORS Error

**Causa:** `CORS_ORIGIN` mal configurado

**Solución:**
1. Ve a Backend → Environment
2. Verifica que `CORS_ORIGIN` tenga la URL exacta del frontend
3. Incluye `https://` sin `/` al final

### Problema: 404 en rutas del Frontend

**Causa:** Falta configurar Rewrites

**Solución:**
1. Ve a Frontend → Redirects/Rewrites
2. Agrega regla: `/*` → `/index.html` → Rewrite

---

## 🎉 ¡Listo para Producción!

Tu aplicación ya está en línea y accesible desde cualquier lugar del mundo.

### URLs Finales

- **Frontend**: https://agrovet-frontend.onrender.com
- **Backend**: https://agrovet-api.onrender.com
- **Health Check**: https://agrovet-api.onrender.com/health

### Compartir con el Equipo

Envía la URL del frontend a tu equipo y las credenciales de acceso.

---

## 📱 Dominio Personalizado (Opcional)

### Configurar tu propio dominio

1. Ve a Frontend → Settings → Custom Domains
2. Click en **Add Custom Domain**
3. Ingresa: `www.tudominio.com`
4. Sigue las instrucciones DNS
5. Render configura SSL automáticamente

**Costo:** Gratis (solo pagas el dominio)

---

## 🔐 Seguridad en Producción

### ✅ Checklist de Seguridad

- [ ] Cambiar `JWT_SECRET` por valor aleatorio
- [ ] Verificar que `.env` no esté en GitHub
- [ ] Configurar `CORS_ORIGIN` correctamente
- [ ] Activar 2FA en Render
- [ ] Revisar permisos de Supabase
- [ ] Configurar políticas RLS en Supabase

---

**¿Dudas?** Consulta `GUIA_DESPLIEGUE_RENDER.md` para detalles técnicos.
