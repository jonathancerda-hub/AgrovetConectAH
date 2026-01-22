import json

# Cargar datos
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

empleados = data.get('empleados', [])

# Generar SQL para actualizar puestos
print("-- Actualizar puestos de empleados desde datos originales")
print()

actualizaciones = []
for emp in empleados:
    codigo = emp.get('codigo')
    cargo = emp.get('cargo', '').strip()
    
    if codigo and cargo:
        # Limpiar cargo
        cargo_limpio = cargo.replace("'", "''")  # Escapar comillas simples
        
        actualizaciones.append(f"UPDATE empleados e SET puesto_id = p.id "
                              f"FROM puestos p "
                              f"WHERE e.codigo_empleado = '{codigo}' "
                              f"AND p.nombre = '{cargo_limpio}';")

# Imprimir actualizaciones
for act in actualizaciones:
    print(act)

print()
print(f"-- Total de actualizaciones: {len(actualizaciones)}")
