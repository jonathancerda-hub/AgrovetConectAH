import json
import sys

# Cargar datos
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Solo primeros 50 para lote 1
empleados_con_cargo = [e for e in data['empleados'] if e.get('cargo', '')][:50]

sql_statements = []
for emp in empleados_con_cargo:
    cargo = emp.get('cargo', '').replace("'", "''")  # Escapar comillas
    codigo = emp['codigo']
    sql_statements.append(
        f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo}') WHERE codigo_empleado = '{codigo}';"
    )

# Imprimir
for sql in sql_statements:
    print(sql)
