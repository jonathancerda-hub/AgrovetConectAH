# 🚀 Comandos Rápidos para Desplegar

## 📤 Subir a GitHub

```bash
# 1. Ir al directorio del proyecto
cd C:\Users\jcerda\Desktop\reac

# 2. Ver cambios
git status

# 3. Agregar todos los archivos
git add .

# 4. Crear commit
git commit -m "Configurar proyecto para producción en Render"

# 5. Subir a GitHub
git push origin main
```

## 🔧 Variables de Entorno para Render

### Backend (agrovet-api)
Copia y pega estas variables en Render → Environment:

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
JWT_SECRET=CAMBIA_ESTO_POR_ALGO_SUPER_SECRETO_Y_ALEATORIO_123456
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://TU-FRONTEND.onrender.com
```

⚠️ **IMPORTANTE**:
- Cambia `JWT_SECRET` por algo aleatorio y seguro
- Cambia `CORS_ORIGIN` cuando tengas la URL del frontend

### Frontend (agrovet-frontend)
```
VITE_API_URL=https://TU-BACKEND.onrender.com/api
```

⚠️ Reemplaza `TU-BACKEND` con el nombre de tu servicio backend en Render.

## 📋 Checklist Rápido

1. ✅ Subir código a GitHub
2. ✅ Crear servicio Backend en Render
3. ✅ Configurar variables de entorno del Backend
4. ✅ Esperar a que el Backend se despliegue
5. ✅ Probar: `https://tu-backend.onrender.com/health`
6. ✅ Crear servicio Frontend en Render
7. ✅ Configurar variable VITE_API_URL
8. ✅ Esperar a que el Frontend se despliegue
9. ✅ Actualizar CORS_ORIGIN en el Backend
10. ✅ Probar login en producción

## 🌐 URLs de Acceso

- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/uakdewhjlgbxpyjllhqg
- **GitHub Repo**: https://github.com/jonathancerda-hub/AgrovetConectAH

## 🆘 ¿Problemas?

Lee la guía completa: `GUIA_DESPLIEGUE_RENDER.md`
