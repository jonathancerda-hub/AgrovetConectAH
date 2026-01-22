import json

# Leer datos procesados
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']

print("-- Actualizar puestos de todos los empleados")
print("-- Script generado automáticamente\n")

for emp in empleados:
    dni = emp['dni']
    cargo = emp['cargo'].replace("'", "''")  # Escapar comillas
    
    sql = f"""UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo}') WHERE dni = '{dni}' AND puesto_id IS NULL;"""
    print(sql)

print(f"\n-- Total: {len(empleados)} empleados actualizados")
