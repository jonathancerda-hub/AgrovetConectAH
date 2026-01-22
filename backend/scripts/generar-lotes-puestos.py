import json
import sys

# Cargar datos
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

empleados = data.get('empleados', [])

# Agrupar en lotes de 30
batch_size = 30
total_batches = (len(empleados) + batch_size - 1) // batch_size

for batch_num in range(total_batches):
    start_idx = batch_num * batch_size
    end_idx = min(start_idx + batch_size, len(empleados))
    batch = empleados[start_idx:end_idx]
    
    print(f"-- LOTE {batch_num + 1}: Empleados {start_idx + 1} a {end_idx}")
    print()
    
    for emp in batch:
        codigo = emp.get('codigo')
        cargo = emp.get('cargo', '').strip()
        
        if codigo and cargo:
            # Escapar comillas simples
            cargo_limpio = cargo.replace("'", "''")
            print(f"UPDATE empleados e SET puesto_id = p.id FROM puestos p WHERE e.codigo_empleado = '{codigo}' AND p.nombre = '{cargo_limpio}';")
    
    print()
    print()
