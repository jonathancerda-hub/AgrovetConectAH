# 🔒 Seguridad del Sistema

## Rate Limiting Implementado

### Protección General (15 minutos)
- **Límite**: 100 peticiones por IP
- **Ventana**: 15 minutos
- **Aplicado a**: Todas las rutas `/api/*`

### Protección de Autenticación (15 minutos)
- **Límite**: 5 intentos de login
- **Ventana**: 15 minutos
- **Aplicado a**: `/api/auth/*`
- **Característica**: Solo cuenta intentos fallidos

### Protección de API (1 minuto)
- **Límite**: 30 peticiones por minuto
- **Ventana**: 1 minuto
- **Aplicado a**: Todas las rutas API excepto auth

## Qué Previene

✅ **Ataques de Fuerza Bruta**: Máximo 5 intentos de login en 15 minutos
✅ **DDoS Simples**: Limita peticiones masivas por IP
✅ **Abuso de API**: Previene uso excesivo de recursos
✅ **Scraping**: Dificulta la extracción masiva de datos

## Headers de Respuesta

Cuando un cliente hace peticiones, recibe headers informativos:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1675612800
```

## Mensajes de Error

Cuando se excede el límite:

```json
{
  "error": "Demasiadas peticiones, intenta de nuevo más tarde"
}
```

Para login:
```json
{
  "error": "Demasiados intentos de login. Espera 15 minutos."
}
```

## Próximas Mejoras Recomendadas

1. **JWT Token Validation**
   - Verificar expiración en frontend
   - Implementar refresh tokens

2. **Helmet.js**
   - Headers de seguridad HTTP
   - Protección XSS

3. **CORS Mejorado**
   - Whitelist de dominios específicos
   - Configuración por ambiente

4. **Logging de Seguridad**
   - Registrar intentos fallidos
   - Alertas de IPs sospechosas

5. **2FA (Two-Factor Authentication)**
   - Para usuarios RRHH
   - Opcional para empleados

## Monitoreo

Para ver intentos bloqueados en logs:
```bash
# En producción (Render)
tail -f /var/log/app.log | grep "rate limit"
```

## Testing

Para probar el rate limiting:
```bash
# Hacer 6 requests rápidos al login
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

El 6to debería devolver error 429 (Too Many Requests).

## Fecha de Implementación

- **Rate Limiting**: 5 de febrero de 2026
- **Versión**: 1.0.0
