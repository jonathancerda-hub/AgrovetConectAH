import json

# Cargar datos JSON
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

puestos_json = set(data['puestos'])

print(f"Total de puestos en JSON: {len(puestos_json)}")
print("\nTodos los puestos del JSON (para comparar con BD):")
print("=" * 80)

for puesto in sorted(puestos_json):
    # Escapar comillas
    puesto_escaped = puesto.replace("'", "''")
    print(f"'{puesto_escaped}'")
