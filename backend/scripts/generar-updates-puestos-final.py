import json

# Cargar datos del JSON con UTF-8
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Obtener empleados que necesitan actualización (todos)
empleados = data['empleados']

print("-- Script de actualización completa de puestos")
print(f"-- Total empleados: {len(empleados)}")
print()

# Dividir en 5 lotes
tamano_lote = 50
total_lotes = (len(empleados) + tamano_lote - 1) // tamano_lote

for lote_num in range(total_lotes):
    inicio = lote_num * tamano_lote
    fin = min(inicio + tamano_lote, len(empleados))
    lote = empleados[inicio:fin]
    
    print(f"========== LOTE {lote_num + 1} (Empleados {inicio + 1}-{fin}) ==========")
    
    for emp in lote:
        cargo = emp.get('cargo', '')
        codigo = emp.get('codigo', '')
        if cargo and codigo:
            # Escapar comillas simples
            cargo_escaped = cargo.replace("'", "''")
            print(f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo_escaped}') WHERE codigo_empleado = '{codigo}';")
    
    print()
    print()
