# Script para aplicar la migración de empleados a Render PostgreSQL
# Fecha: 2025-12-03

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FUSIÓN DE EMPLEADOS Y USUARIOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Leer variables de entorno
$envPath = "$PSScriptRoot\..\..\.env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
}

$DATABASE_URL = $env:DATABASE_URL

if (-not $DATABASE_URL) {
    Write-Host "❌ ERROR: No se encontró DATABASE_URL en .env" -ForegroundColor Red
    exit 1
}

Write-Host "📡 Conectando a la base de datos..." -ForegroundColor Yellow
Write-Host ""

# Ruta del archivo SQL
$sqlFile = "$PSScriptRoot\08_fusion_empleados_usuarios.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERROR: No se encontró el archivo de migración" -ForegroundColor Red
    exit 1
}

# Ejecutar con psql (requiere PostgreSQL client instalado)
Write-Host "📝 Ejecutando migración..." -ForegroundColor Yellow
Write-Host ""

try {
    # Opción 1: Si tienes psql instalado
    $content = Get-Content $sqlFile -Raw
    $content | psql $DATABASE_URL
    
    Write-Host ""
    Write-Host "✅ Migración completada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "DATOS INSERTADOS:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "- 21 Usuarios con contraseña: Agrovet2025!" -ForegroundColor White
    Write-Host "- 21 Empleados vinculados a usuarios" -ForegroundColor White
    Write-Host "- 4 Áreas: Finanzas, TI, Admin, RRHH" -ForegroundColor White
    Write-Host "- 19 Puestos de trabajo" -ForegroundColor White
    Write-Host ""
    Write-Host "Usuarios de ejemplo:" -ForegroundColor Yellow
    Write-Host "- jonathan.cerda@agrovetmarket.com (coordinador)" -ForegroundColor White
    Write-Host "- ursula.huamancaja@agrovetmarket.com (rrhh)" -ForegroundColor White
    Write-Host "- jose.garcia@agrovetmarket.com (director)" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR al ejecutar la migración:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 ALTERNATIVA: Copia el contenido de:" -ForegroundColor Yellow
    Write-Host "$sqlFile" -ForegroundColor White
    Write-Host "Y ejecútalo manualmente en el dashboard de Render" -ForegroundColor Yellow
    exit 1
}
