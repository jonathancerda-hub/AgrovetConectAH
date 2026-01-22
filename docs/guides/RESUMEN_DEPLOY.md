# ⚡ Resumen Ejecutivo - Deploy a Producción

## 🎯 Objetivo
Desplegar **AgrovetConectAH** en Render.com con base de datos Supabase.

---

## 📦 Lo que he preparado para ti

### ✅ Archivos Creados

1. **GUIA_DESPLIEGUE_RENDER.md** 
   - Guía completa paso a paso
   - Solución de problemas
   - Configuración detallada

2. **RENDER_VISUAL_GUIDE.md**
   - Instrucciones visuales con capturas
   - Configuración de Render UI
   - Tips y trucos

3. **COMANDOS_DESPLIEGUE.md**
   - Comandos rápidos
   - Variables de entorno listas para copiar
   - Checklist

4. **README.md**
   - Documentación del proyecto
   - Instrucciones de instalación
   - Información técnica

5. **deploy-github.ps1**
   - Script automático para Git push
   - Facilita el proceso

6. **.env.development** y **.env.production**
   - Configuración separada por entorno
   - Variables correctamente configuradas

7. **render.yaml**
   - Configuración automatizada (opcional)

---

## 🚀 3 Pasos Simples para Deploy

### PASO 1: Subir a GitHub (2 minutos)

```powershell
cd C:\Users\jcerda\Desktop\reac
git add .
git commit -m "Preparar proyecto para producción"
git push origin main
```

O ejecuta el script:
```powershell
.\deploy-github.ps1
```

### PASO 2: Crear Backend en Render (10 minutos)

1. Ve a https://dashboard.render.com
2. Click en **New + → Web Service**
3. Conecta: `jonathancerda-hub/AgrovetConectAH`
4. Configura:
   - Name: `agrovet-api`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Agrega las variables de entorno (ver abajo)
6. Click en **Create Web Service**

### PASO 3: Crear Frontend en Render (5 minutos)

1. Click en **New + → Static Site**
2. Conecta el mismo repositorio
3. Configura:
   - Name: `agrovet-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Agrega variable: `VITE_API_URL=https://agrovet-api.onrender.com/api`
5. Configura Rewrite: `/*` → `/index.html`
6. Click en **Create Static Site**

**Total: ~17 minutos**

---

## 🔑 Variables de Entorno

### Backend (Copiar y Pegar)

```env
NODE_ENV=production
PORT=10000
# 🔐 Obtener de: https://supabase.com/dashboard/project/TU_PROYECTO/settings/api
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE_DASHBOARD
# 🔐 Obtener de: https://supabase.com/dashboard/project/TU_PROYECTO/settings/database
PGHOST=aws-X-sa-east-1.pooler.supabase.com
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres.TU_PROYECTO
PGPASSWORD=TU_PASSWORD_DE_SUPABASE
# 🔐 Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=CAMBIAR_POR_VALOR_ALEATORIO_GENERADO
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://agrovet-frontend.onrender.com
```

⚠️ **Recuerda cambiar**:
- `JWT_SECRET`: Por algo aleatorio y largo
- `CORS_ORIGIN`: Después de crear el frontend (actualizar)

### Frontend

```env
VITE_API_URL=https://agrovet-api.onrender.com/api
```

---

## ✅ Checklist Final

**Antes del Deploy:**
- [ ] Código subido a GitHub
- [ ] Variables `.env` NO están en GitHub
- [ ] RPC Functions creadas en Supabase

**Durante el Deploy:**
- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas
- [ ] Health check funcionando: `/health`
- [ ] Frontend desplegado en Render
- [ ] Variable VITE_API_URL configurada
- [ ] Rewrite configurado para SPA

**Después del Deploy:**
- [ ] CORS_ORIGIN actualizado en backend
- [ ] Login funciona en producción
- [ ] Dashboard RRHH carga datos
- [ ] Calendario funciona

---

## 🌐 URLs Resultantes

Después del deploy, tendrás:

- **Frontend**: https://agrovet-frontend.onrender.com
- **Backend**: https://agrovet-api.onrender.com
- **Health**: https://agrovet-api.onrender.com/health
- **GitHub**: https://github.com/jonathancerda-hub/AgrovetConectAH

---

## 👤 Login de Prueba

**RRHH:**
```
Email: ursula.huamancaja@agrovet.com
Password: rrhh123
```

**Admin:**
```
Email: admin@agrovet.com
Password: admin123
```

---

## 📚 Documentación Disponible

1. **GUIA_DESPLIEGUE_RENDER.md** - Guía completa y detallada
2. **RENDER_VISUAL_GUIDE.md** - Guía visual paso a paso
3. **COMANDOS_DESPLIEGUE.md** - Comandos rápidos
4. **README.md** - Documentación del proyecto

---

## 🆘 ¿Problemas?

### Backend no inicia
✅ Revisa logs en Render → agrovet-api → Logs

### Frontend no se conecta
✅ Verifica `VITE_API_URL` en variables de entorno

### CORS Error
✅ Verifica que `CORS_ORIGIN` coincida con URL del frontend

### Base de datos no conecta
✅ Verifica credenciales de Supabase
✅ Verifica que RPC functions estén creadas

---

## 💡 Tips Importantes

1. **Plan Gratuito**: Los servicios se duermen después de 15 min de inactividad
2. **Primera carga**: Puede tardar 30-60 segundos después de dormir
3. **Auto-deploy**: Cada `git push` despliega automáticamente
4. **SSL**: Render proporciona HTTPS gratis
5. **Logs**: Disponibles en tiempo real en el dashboard

---

## 🎉 ¡Listo!

Tu aplicación estará en línea y accesible globalmente.

**Siguiente paso**: 
```powershell
cd C:\Users\jcerda\Desktop\reac
git add .
git commit -m "Deploy a producción"
git push origin main
```

Luego ve a: https://dashboard.render.com

**¡Éxito! 🚀**
