# 📊 Fusión de Empleados y Usuarios

Este directorio contiene la migración para integrar los 21 empleados del archivo JSON con la estructura de la base de datos.

## 📋 Contenido de la Migración

### Datos que se insertarán:

- **21 Usuarios** con sus credenciales
- **21 Empleados** vinculados a esos usuarios
- **4 Áreas**: Finanzas, Transformación Digital, Administración, Recursos Humanos
- **19 Puestos** de trabajo con diferentes niveles jerárquicos
- **42 Periodos Vacacionales** (21 empleados × 2 años: 2024 y 2025)
  - Cada empleado: 30 días por año (disponibles)
  - Jonathan Cerda: 12 días en 2024 (proporcional desde septiembre)
  - Estado: todos activos

### Estructura Jerárquica:

```
José Garcia (Director Finanzas y TI)
├── Ena Fernández (Gerente Transformación Digital)
│   ├── Teodoro Balarezo (Jefe Proyectos TI)
│   │   └── Jonathan Cerda (Developer)
│   ├── Juana Lovaton (Jefe Aplicaciones)
│   │   └── Juan Portal (Asistente)
│   ├── Cesar Garcia (Supervisor Infraestructura)
│   ├── Mariano Polo (Supervisor Seguridad)
│   └── Otros empleados TI...
├── José Pariasca (Jefe Finanzas)
│   └── Katia Barcena (Supervisor Créditos)
├── Pamela Torres (Jefe Planeamiento)
│   ├── Marilia Tinoco (Supervisor Finanzas)
│   ├── Ana Flores (Supervisor Contable)
│   └── Blanca Loayza (Supervisor Costos)
└── Ricardo Calderón (Jefe Admin)

Ursula Huamancaja (Gerente RRHH) - Independiente
```

## 🔐 Credenciales

**Contraseña por defecto para TODOS los usuarios**: `Agrovet2025!`

### Usuarios Principales:

| Email | Rol | Área |
|-------|-----|------|
| jonathan.cerda@agrovetmarket.com | coordinador | Transformación Digital |
| ursula.huamancaja@agrovetmarket.com | rrhh | Recursos Humanos |
| jose.garcia@agrovetmarket.com | director | Finanzas y TI |
| ena.fernandez@agrovetmarket.com | gerente | Transformación Digital |

## 🚀 Cómo Ejecutar la Migración

### Opción 1: Desde PowerShell (Recomendado)

```powershell
cd backend\database\migrations
.\ejecutar_migracion.ps1
```

### Opción 2: Manualmente en Render Dashboard

1. Ve a tu base de datos en [Render Dashboard](https://dashboard.render.com/)
2. Clic en "Shell" o conecta con `psql`
3. Copia el contenido completo de `08_fusion_empleados_usuarios.sql`
4. Pégalo y ejecuta

### Opción 3: Usando psql directamente

```bash
psql "postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta" -f 08_fusion_empleados_usuarios.sql
```

## ✅ Verificación

Después de ejecutar la migración, verifica que todo esté correcto:

1. **Backend**: Los logs deberían mostrar conexión exitosa
2. **Login**: Prueba iniciar sesión con `jonathan.cerda@agrovetmarket.com` / `Agrovet2025!`
3. **Portal**: Debería mostrar "30 días disponibles" (o 12 para Jonathan en 2024)
4. **Dashboard RRHH**: Deberías ver los 21 empleados con sus datos
5. **Solicitud de Vacaciones**: Probar crear una solicitud para verificar que los periodos funcionan
6. **Mi Equipo**: Los supervisores deberían ver sus subordinados directos

## 📝 Notas Importantes

- ✅ La migración usa `ON CONFLICT DO UPDATE` para no duplicar datos
- ✅ Si ya existen datos, se actualizarán en lugar de fallar
- ✅ Las secuencias se actualizan automáticamente
- ✅ Todos los empleados tienen 30 días de vacaciones (excepto Ursula con 42)
- ✅ Las relaciones supervisor-empleado están establecidas

## 🔄 Rollback

Si necesitas revertir los cambios:

```sql
-- Solo si quieres eliminar TODOS los datos
BEGIN;
TRUNCATE TABLE empleados CASCADE;
TRUNCATE TABLE usuarios CASCADE;
TRUNCATE TABLE areas CASCADE;
TRUNCATE TABLE puestos CASCADE;
COMMIT;
```

## 📞 Soporte

Si tienes problemas:

1. Verifica que el backend esté conectado a la base de datos
2. Revisa los logs del servidor
3. Asegúrate de que las tablas existan (ejecuta migraciones previas)
4. Contacta al equipo de desarrollo

---

**Última actualización**: 3 de diciembre de 2025
