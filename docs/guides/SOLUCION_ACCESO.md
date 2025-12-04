# 🔧 Solución: Usuarios no pueden acceder

## 🔴 Problema Identificado

Los usuarios no pueden entrar porque la **URL del backend está incorrecta** en la configuración del frontend.

**Frontend:** https://agrovetconectah.onrender.com/  
**Backend:** https://agrovet-api-e22a.onrender.com/

---

## ✅ Pasos para Solucionar (5 minutos)

### **PASO 1: Actualizar Frontend en Render**

1. Ve a: https://dashboard.render.com
2. Haz clic en el servicio **`agrovetconectah`** (tu frontend)
3. En el menú izquierdo, haz clic en **Environment**
4. Busca la variable: `VITE_API_URL`
5. **Cambia el valor a:**
   ```
   https://agrovet-api-e22a.onrender.com/api
   ```
6. Haz clic en **Save Changes**
7. Espera 2-3 minutos mientras se redesplega

---

### **PASO 2: Actualizar Backend en Render**

1. En Render Dashboard, haz clic en **`agrovet-api-e22a`** (tu backend)
2. Ve a **Environment**
3. Busca la variable: `CORS_ORIGIN`
4. **Cambia el valor a:**
   ```
   https://agrovetconectah.onrender.com
   ```
5. Haz clic en **Save Changes**
6. Espera 2-3 minutos mientras se redesplega

---

### **PASO 3: Verificar que funciona**

1. Abre tu navegador en modo incógnito (Ctrl + Shift + N)
2. Ve a: https://agrovetconectah.onrender.com/
3. Intenta hacer login con:
   - **Email:** `admin@agrovet.com`
   - **Password:** `admin123`

Si carga correctamente, **¡LISTO!** ✅

---

## 🔍 Verificación del Backend

Puedes verificar que el backend está funcionando visitando:
https://agrovet-api-e22a.onrender.com/health

Deberías ver algo como:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-03T..."
}
```

---

## 📝 Notas Importantes

### ⏱️ **Primera carga puede tardar**
Si el servicio estaba dormido (plan gratuito de Render), la primera carga puede tardar **30-60 segundos**. Luego será rápido.

### 🔄 **Auto-deploy activado**
Cada vez que hagas `git push`, Render automáticamente redesplega. Asegúrate de que `.env.production` tenga la URL correcta antes de subir cambios.

### 🌐 **URLs correctas**
- Frontend: `https://agrovetconectah.onrender.com`
- Backend API: `https://agrovet-api-e22a.onrender.com/api`
- Health Check: `https://agrovet-api-e22a.onrender.com/health`

---

## ❓ Si aún no funciona

### Error de CORS
Si ves errores en la consola del navegador que dicen "CORS", verifica que:
- `CORS_ORIGIN` en el backend sea: `https://agrovetconectah.onrender.com`
- NO incluyas `/` al final

### Error 401 (No autorizado)
- Verifica que el backend tenga la variable `JWT_SECRET` configurada
- Intenta hacer logout y login de nuevo

### Error de red
- Verifica que el backend esté corriendo: https://agrovet-api-e22a.onrender.com/health
- Si dice "Service Unavailable", el backend está iniciando (espera 1 minuto)

### Base de datos no conecta
- Verifica en Render → agrovet-api-e22a → Environment que las variables de Supabase estén correctas:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

---

## 🎯 Resumen Rápido

```
FRONTEND (Render):
Variable: VITE_API_URL
Valor: https://agrovet-api-e22a.onrender.com/api

BACKEND (Render):
Variable: CORS_ORIGIN
Valor: https://agrovetconectah.onrender.com
```

¡Listo! Después de estos cambios, todos los usuarios podrán acceder. 🚀
