import json
import sys

# Configurar la salida para UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Leer datos
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']
print(f"Total empleados: {len(empleados)}\n")

# Generar listado de códigos para dividir en grupos
for i, emp in enumerate(empleados, 1):
    codigo = emp.get('Codigo') or emp.get('codigo')
    cargo = emp.get('Cargo') or emp.get('cargo') or ''
    cargo = cargo.strip()
    
    if not cargo:
        print(f"# SIN CARGO: {codigo}")
        continue
    
    # Escapar comillas simples
    cargo_sql = cargo.replace("'", "''")
    
    # Imprimir el código y cargo para referencia
    if i % 50 == 1:
        print(f"\n-- GRUPO {(i // 50) + 1}")
    print(f"{codigo}|{cargo_sql}")
