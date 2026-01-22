import json

# Leer el JSON
with open('datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Códigos de empleados sin puesto (primeros 30)
sin_puesto = [
    "AGV0961", "AGV0963", "AGV0964", "AGV0968", "AGV0970", "AGV0973", "AGV0976", 
    "AGV0978", "AGV0980", "AGV0984", "AGV0986", "AGV0991", "AGV0996", "AGV0997", 
    "AGV1001", "AGV1002", "AGV1008", "AGV1013", "AGV1014", "AGV1015", "AGV1020", 
    "AGV1024", "AGV1026", "AGV1031", "AGV1033", "AGV1036", "AGV1037", "AGV1038", 
    "AGV1039", "AGV1040"
]

# Buscar en el JSON y generar UPDATEs
updates = []
for empleado in data['empleados']:
    if empleado['codigo'] in sin_puesto:
        puesto = empleado['cargo'].strip()
        codigo = empleado['codigo']
        updates.append(f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{puesto}') WHERE codigo_empleado = '{codigo}' AND puesto_id IS NULL;")

# Imprimir
for update in updates:
    print(update)
