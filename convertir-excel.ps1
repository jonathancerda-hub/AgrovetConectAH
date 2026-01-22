# Script para convertir Excel a CSV
$excelFile = "c:\Users\jcerda\Desktop\reac\Listado de Personal 14.01.xlsx"
$csvFile = "c:\Users\jcerda\Desktop\reac\listado-personal.csv"

try {
    Write-Host "Convirtiendo Excel a CSV..." -ForegroundColor Cyan
    
    # Crear objeto Excel
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Abrir el archivo
    $workbook = $excel.Workbooks.Open($excelFile)
    $worksheet = $workbook.Worksheets.Item(1)
    
    # Guardar como CSV
    $worksheet.SaveAs($csvFile, 6) # 6 = xlCSV format
    
    # Cerrar
    $workbook.Close($false)
    $excel.Quit()
    
    # Liberar objetos COM
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($worksheet) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host "Archivo convertido exitosamente" -ForegroundColor Green
    
    # Mostrar primeras líneas
    Get-Content $csvFile -TotalCount 20
    
} catch {
    Write-Host "Error con Excel COM. Intentando metodo alternativo..." -ForegroundColor Red
    
    # Verificar si existe el módulo ImportExcel
    if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
        Write-Host "Instalando modulo ImportExcel..." -ForegroundColor Cyan
        Install-Module -Name ImportExcel -Force -Scope CurrentUser
    }
    
    Import-Module ImportExcel
    $data = Import-Excel -Path $excelFile
    $data | Export-Csv -Path $csvFile -NoTypeInformation -Encoding UTF8
    
    Write-Host "Conversion completada con ImportExcel" -ForegroundColor Green
    Get-Content $csvFile -TotalCount 20
}
