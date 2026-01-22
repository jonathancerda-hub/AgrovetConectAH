import json
import sys
import io

# Configurar salida UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Cargar datos
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Crear diccionario de puestos: nombre -> True
puestos_disponibles = {p: True for p in data['puestos']}

# Generar SQL de corrección
print("-- Corrección de puestos para empleados con puesto_id NULL")
print("-- Total de puestos en catálogo:", len(data['puestos']))
print()

# Crear lotes de 50
contador = 0
lote = 1
empleados_procesados = 0

for emp in data['empleados']:
    cargo = emp.get('cargo', '')
    codigo = emp['codigo']
    
    # Solo procesar si el cargo existe en puestos
    if cargo and cargo in puestos_disponibles:
        if contador == 0:
            print(f"-- LOTE {lote}")
        
        # Generar UPDATE con escape de comillas simples
        cargo_escaped = cargo.replace("'", "''")
        print(f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo_escaped}') WHERE codigo_empleado = '{codigo}';")
        
        contador += 1
        empleados_procesados += 1
        
        if contador >= 50:
            print()
            contador = 0
            lote += 1

print()
print(f"-- Total de empleados a actualizar: {empleados_procesados}")
print()
print("-- Verificar resultado:")
print("SELECT COUNT(*) FROM empleados WHERE puesto_id IS NULL;")
