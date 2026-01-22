import json
import sys
import io

# Configurar salida UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Cargar JSON
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Lista completa de puestos del JSON
puestos_json = sorted(data['puestos'])

print(f"-- Total de puestos en JSON: {len(puestos_json)}")
print(f"-- Insertar puestos faltantes (si existen)")
print()

# Generar INSERT para cada puesto
for puesto in puestos_json:
    puesto_escaped = puesto.replace("'", "''")
    print(f"INSERT INTO puestos (nombre) SELECT '{puesto_escaped}' WHERE NOT EXISTS (SELECT 1 FROM puestos WHERE nombre = '{puesto_escaped}');")
