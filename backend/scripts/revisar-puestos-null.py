import json

# Cargar datos
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Lista de códigos sin puesto
codigos_sin_puesto = ['AGV0124', 'AGV0603', 'AGV0674', 'AGV0801', 'AGV0836', 
                      'AGV0868', 'AGV0935', 'AGV0949', 'AGV0950', 'AGV0953',
                      'AGV0956', 'AGV0957', 'AGV0959', 'AGV0961', 'AGV0963',
                      'AGV0964', 'AGV0966', 'AGV0968', 'AGV0970', 'AGV0973']

# Buscar empleados
print("EMPLEADOS SIN PUESTO - REVISIÓN DE CARGOS:")
print("=" * 80)

for emp in data['empleados']:
    if emp['codigo'] in codigos_sin_puesto:
        cargo = emp.get('cargo', 'SIN CARGO')
        print(f"{emp['codigo']} - {emp.get('nombreCompleto', 'SIN NOMBRE')}")
        print(f"  Cargo en JSON: '{cargo}'")
        print()

# Verificar si esos cargos existen en la lista de puestos
print("\n" + "=" * 80)
print("VERIFICACIÓN DE EXISTENCIA EN PUESTOS:")
print("=" * 80)

cargos_encontrados = set()
for emp in data['empleados']:
    if emp['codigo'] in codigos_sin_puesto:
        cargo = emp.get('cargo', '')
        if cargo in data['puestos']:
            print(f"✓ '{cargo}' SÍ existe en puestos")
            cargos_encontrados.add(cargo)
        else:
            print(f"✗ '{cargo}' NO existe en puestos")

# Buscar cargos similares
print("\n" + "=" * 80)
print("CARGOS SIMILARES EN LA LISTA DE PUESTOS:")
print("=" * 80)

for emp in data['empleados']:
    if emp['codigo'] in codigos_sin_puesto:
        cargo = emp.get('cargo', '')
        if cargo not in data['puestos']:
            # Buscar similares
            similares = [p for p in data['puestos'] if cargo.lower()[:15] in p.lower() or p.lower()[:15] in cargo.lower()]
            if similares:
                print(f"\nCargo: '{cargo}'")
                print(f"  Similares encontrados:")
                for sim in similares[:3]:
                    print(f"    - '{sim}'")
