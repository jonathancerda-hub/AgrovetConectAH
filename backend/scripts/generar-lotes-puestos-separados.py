import json

# Cargar datos
with open(r'c:\Users\jcerda\Desktop\reac\datos-procesados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Generar 5 lotes para aplicar via SQL
empleados_con_cargo = [e for e in data['empleados'] if e.get('cargo', '')]

lotes = []
tamano_lote = 50

for i in range(0, len(empleados_con_cargo), tamano_lote):
    lote = empleados_con_cargo[i:i+tamano_lote]
    sql_statements = []
    
    for emp in lote:
        cargo = emp.get('cargo', '').replace("'", "''")  # Escapar comillas
        codigo = emp['codigo']
        sql_statements.append(
            f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo}') WHERE codigo_empleado = '{codigo}';"
        )
    
    lotes.append('\n'.join(sql_statements))

# Imprimir cada lote
for idx, lote_sql in enumerate(lotes, 1):
    print(f"============ LOTE {idx} ============")
    print(lote_sql)
    print()
