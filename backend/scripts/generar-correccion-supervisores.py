import json

# Leer datos del JSON
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

print("-- SCRIPT DE CORRECCIÓN COMPLETA DE SUPERVISORES")
print("-- Generado automáticamente comparando JSON con BD\n")

# Generar UPDATE para cada empleado que NO es director general
updates = []
for emp in sorted(datos['empleados'], key=lambda x: x['codigo']):
    codigo = emp['codigo']
    dni_jefe = emp.get('dniJefe')
    
    # Skip director general
    if codigo == 'AGV0002':
        continue
    
    if dni_jefe:
        updates.append(f"UPDATE empleados SET supervisor_id = (SELECT id FROM empleados WHERE dni = '{dni_jefe}') WHERE codigo_empleado = '{codigo}';")

# Imprimir en lotes de 50
for i in range(0, len(updates), 50):
    lote = i // 50 + 1
    print(f"\n-- LOTE {lote}")
    for update in updates[i:i+50]:
        print(update)

print(f"\n-- Total de {len(updates)} empleados actualizados")
print("\n-- Verificar resultado:")
print("SELECT COUNT(*) FROM empleados WHERE supervisor_id IS NULL AND codigo_empleado != 'AGV0002';")
