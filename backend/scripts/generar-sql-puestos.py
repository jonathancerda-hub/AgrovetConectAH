import json

# Cargar datos
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Obtener todos los empleados y generar el SQL
empleados = data['empleados']
total = len(empleados)

# Generar SQL completo
sql_lines = ["-- Corrección completa de puestos"]
for idx, emp in enumerate(empleados):
    cargo = emp.get('cargo', '')
    codigo = emp.get('codigo', '')
    if cargo and codigo:
        # Escape de comillas simples
        cargo_escaped = cargo.replace("'", "''")
        sql_lines.append(f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo_escaped}') WHERE codigo_empleado = '{codigo}';")

sql_final = '\n'.join(sql_lines)

# Guardar en archivo
with open(r'c:\Users\jcerda\Desktop\reac\backend\scripts\correccion-puestos-final.sql', 'w', encoding='utf-8') as f:
    f.write(sql_final)

print(f"Generado SQL para {len(sql_lines)-1} empleados")
print(f"Archivo: correccion-puestos-final.sql")
