import json

# Cargar datos
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Obtener puestos únicos del JSON
puestos_json = set(data['puestos'])

print(f"Total de puestos en JSON: {len(puestos_json)}")
print("\nPrimeros 30 puestos del JSON:")
for idx, puesto in enumerate(list(puestos_json)[:30], 1):
    print(f"{idx}. {puesto}")
