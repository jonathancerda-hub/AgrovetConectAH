import json

# Leer datos
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']

print(f"Total empleados: {len(empleados)}")
print("\nPrimeros 10 empleados:")
for i, e in enumerate(empleados[:10]):
    print(f"{i+1}. {e['codigo']} - {e.get('nombreCompleto', '')} - {e.get('cargo', '')} - {e.get('centroCosto', '')}")
