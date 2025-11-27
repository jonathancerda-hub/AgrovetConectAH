# 🚀 Migración a Supabase - Guía Completa

## ✅ Pasos Completados Automáticamente

1. ✅ Archivo `.env` actualizado con placeholder de Supabase
2. ✅ Scripts de migración creados (`migrate.js`, `seed.js`)
3. ✅ Comandos npm configurados en `package.json`

## 📋 Pasos que DEBES Hacer

### 1️⃣ Crear Proyecto en Supabase (5 minutos)

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea cuenta o inicia sesión con GitHub
3. Click en **"New Project"**
4. Configura:
   ```
   Name: agrovet-conecta
   Database Password: [GUARDA ESTA CONTRASEÑA]
   Region: South America (São Paulo) - la más cercana
   ```
5. Click **"Create new project"** (espera ~2 minutos)

### 2️⃣ Obtener String de Conexión

Una vez creado el proyecto:

1. En Supabase, ve a **Settings** (⚙️ en la barra lateral)
2. Click en **Database** en el menú izquierdo
3. Scroll hasta **"Connection string"**
4. Selecciona el tab **"URI"**
5. Verás algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **COPIA** esta cadena completa

### 3️⃣ Actualizar .env

Abre `backend/.env` y **reemplaza** la línea `DATABASE_URL`:

```env
# ANTES (placeholder)
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.XXXXX.supabase.co:5432/postgres

# DESPUÉS (con tu URL real de Supabase)
DATABASE_URL=postgresql://postgres:tu_password_real@db.abcdefghijk.supabase.co:5432/postgres
```

**⚠️ IMPORTANTE:**
- Reemplaza `[YOUR-PASSWORD]` con la contraseña que guardaste
- Reemplaza `xxxxx` con tu proyecto ID de Supabase

### 4️⃣ Ejecutar Migraciones

Abre una terminal en la carpeta `backend` y ejecuta:

```powershell
cd backend
npm run migrate
```

Deberías ver:
```
🔌 Conectando a Supabase...
✅ Conectado exitosamente

📦 Ejecutando 01_estructura_base.sql...
✅ 01_estructura_base.sql completada

📦 Ejecutando 02_sistema_usuarios.sql...
✅ 02_sistema_usuarios.sql completada

... (todas las migraciones)

🎉 Todas las migraciones ejecutadas!
```

### 5️⃣ Insertar Datos de Prueba

Ejecuta:

```powershell
npm run seed
```

Deberías ver:
```
🌱 Ejecutando seeds.sql...
✅ Seeds ejecutados exitosamente

✓ 8 usuarios creados
✓ 8 empleados creados

🎉 Base de datos lista para usar!
```

### 6️⃣ Iniciar el Backend

```powershell
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en puerto 3001
📊 Conectado a PostgreSQL (Supabase)
```

### 7️⃣ Probar el Sistema

1. Inicia el frontend en otra terminal:
   ```powershell
   cd ..
   npm run dev
   ```

2. Abre [http://localhost:5173](http://localhost:5173)

3. Inicia sesión con:
   ```
   Email: jonathan.cerda@agrovet.com
   Contraseña: coord123
   ```

4. Ve a **Vacaciones > Aprobar Solicitudes**

5. Deberías ver las solicitudes de tus subordinados

## 🔍 Verificación en Supabase

Puedes ver tus datos directamente en Supabase:

1. En tu proyecto de Supabase, click en **"Table Editor"** (📊)
2. Selecciona la tabla `empleados`
3. Verás todos los empleados insertados
4. Selecciona `solicitudes_vacaciones` para ver las solicitudes

## 🆘 Solución de Problemas

### Error: "connection refused"
- Verifica que copiaste correctamente la URL de conexión
- Asegúrate de que tu IP está permitida en Supabase (Settings > Database > Connection pooling)

### Error: "password authentication failed"
- Verifica que la contraseña en DATABASE_URL es correcta
- Reemplaza `[YOUR-PASSWORD]` con tu contraseña real (sin corchetes)

### Error: "relation already exists"
- Si ya ejecutaste las migraciones antes, elimina todas las tablas en Supabase:
  - Ve a **SQL Editor** en Supabase
  - Ejecuta: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
  - Vuelve a ejecutar `npm run migrate`

## 📊 Comandos Útiles

```powershell
# Ejecutar solo migraciones
npm run migrate

# Ejecutar solo seeds
npm run seed

# Ejecutar migraciones + seeds (reset completo)
npm run reset

# Iniciar backend
npm run dev

# Iniciar backend en producción
npm start
```

## ✨ Ventajas de Supabase

1. ✅ **Interfaz visual** para ver y editar datos
2. ✅ **SQL Editor** integrado para queries
3. ✅ **Backups automáticos** (plan gratuito)
4. ✅ **Logs en tiempo real**
5. ✅ **Mejor rendimiento** que Render Free Tier
6. ✅ **APIs REST automáticas** (opcional, no las usamos)
7. ✅ **2GB de base de datos gratis** vs 1GB en Render

## 🎯 Próximos Pasos

Una vez migrado exitosamente:

1. ✅ Backend funcionando con Supabase
2. ✅ Datos de prueba insertados
3. ✅ Sistema de aprobación de vacaciones listo
4. ✅ Todas las columnas necesarias creadas

Ya puedes empezar a probar el sistema de aprobación jerárquica de vacaciones.
