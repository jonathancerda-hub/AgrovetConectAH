import json

# Leer datos del JSON
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

# Buscar a Ena Fernandez
ena = next((e for e in datos['empleados'] if e['codigo'] == 'AGV0957'), None)
print(f"\n=== ENA FERNANDEZ ===")
print(f"Código: {ena['codigo']}")
print(f"DNI: {ena['dni']}")
print(f"Cargo: {ena['cargo']}")
print(f"Área: {ena['area']}")

# Buscar empleados que reportan a Ena (DNI: 43431921)
print(f"\n=== EMPLEADOS QUE REPORTAN A ENA (DNI 43431921) EN JSON ===")
subordinados_ena = [e for e in datos['empleados'] if e.get('dniJefe') == '43431921']
print(f"Total: {len(subordinados_ena)} empleados\n")

for emp in sorted(subordinados_ena, key=lambda x: x.get('nombreCompleto', '')):
    print(f"{emp['codigo']} - {emp.get('nombreCompleto', '')} - Área: {emp.get('area', '')} - Cargo: {emp.get('cargo', '')}")

# Verificar los 2 empleados sospechosos
print(f"\n=== VERIFICACIÓN ESPECÍFICA ===")
for codigo in ['AGV1154', 'AGV1165']:
    emp = next((e for e in datos['empleados'] if e['codigo'] == codigo), None)
    if emp:
        jefe_info = next((j for j in datos['empleados'] if j['dni'] == emp.get('dniJefe')), None)
        print(f"\n{emp['codigo']} - {emp.get('nombreCompleto')}")
        print(f"  Área: {emp.get('area')}")
        print(f"  Cargo: {emp.get('cargo')}")
        print(f"  DNI Jefe: {emp.get('dniJefe')}")
        if jefe_info:
            print(f"  Jefe Inmediato: {jefe_info.get('nombreCompleto')} - {jefe_info.get('cargo')}")
