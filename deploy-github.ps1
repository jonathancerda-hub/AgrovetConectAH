# Script PowerShell para hacer deploy a GitHub
# Ejecutar: .\deploy-github.ps1

Write-Host "🚀 Preparando deploy a GitHub..." -ForegroundColor Cyan

# Verificar estado de Git
Write-Host "`n📊 Estado actual:" -ForegroundColor Yellow
git status

# Confirmar
$confirm = Read-Host "`n¿Deseas continuar con el deploy? (s/n)"
if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host "❌ Deploy cancelado" -ForegroundColor Red
    exit
}

# Agregar archivos
Write-Host "`n📦 Agregando archivos..." -ForegroundColor Cyan
git add .

# Crear commit
$commitMessage = Read-Host "`n✏️ Mensaje del commit (Enter para usar default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Configurar proyecto para producción en Render"
}

Write-Host "`n💾 Creando commit..." -ForegroundColor Cyan
git commit -m "$commitMessage"

# Push a GitHub
Write-Host "`n☁️ Subiendo a GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Deploy completado!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ve a https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Crea el Web Service (Backend)" -ForegroundColor White
Write-Host "3. Crea el Static Site (Frontend)" -ForegroundColor White
Write-Host "`nConsulta: RENDER_VISUAL_GUIDE.md" -ForegroundColor Cyan
