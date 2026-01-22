import json

# Mapeos completos de áreas
areas_map = {
    "GERENCIA GENERAL": 18,
    "ALMACEN": 2,
    "MAYORES": 24,
    "ADMINISTRACION": 1,
    "CONTABILIDAD Y COSTOS/PLANEAMIENTO FINANCIERO/FINANZAS/ADMINISTRACION/SISTEMAS": 12,
    "CONTROL DE CALIDAD": 13,
    "I&D/FORMULACION/ASUNTOS REGULATORIOS/DESARROLLO ANALITICO/SANIDAD ANIMAL": 19,
    "ASEGURAMIENTO DE LA CALIDAD": 4,
    "VENTAS INTERNACIONALES": 35,
    "MARKETING LOCAL": 22,
    "PRODUCCION": 29,
    "MARKETING": 21,
    "FINANZAS": 16,
    "SEGURIDAD Y MEDIO AMBIENTE": 32,
    "DESARROLLO ANALITICO": 14,
    "FORMULACION": 17,
    "ESTABILIDADES Y VALIDACIONES ANALITICAS": 15,
    "ASUNTOS REGULATORIOS": 5,
    "SANIDAD ANIMAL": 31,
    "COMPRAS": 10,
    "PCP": 27,
    "ALMACEN/ COMPRAS/ PCP/ COMERCIO EXTERIOR": 3,
    "COMERCIO EXTERIOR": 8,
    "SISTEMAS": 33,
    "AVES Y CERDOS": 6,
    "CONTABILIDAD Y COSTOS": 11,
    "INTERPET": 20,
    "TALENTO HUMANO": 34,
    "PLANEAMIENTO FINANCIERO": 28,
    "NUTRICIONAL": 26,
    "MARKETING LOCAL/MARKETING INTERNACIONAL/COMERCIO ELECTRONICO/MAYORES/COMPAÑIA/AVES Y CERDOS/DIGITAL": 23,
    "MARKETING LOCAL/MARKETING INTERNACIONAL/COMERCIO ELECTRONICO/MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL": 23,
    "PROYECTOS Y PROCESOS Y FARMACEUTICOS": 30,
    "COMERCIO ELECTRONICO": 7,
    "MAYORES/COMPAÑIA/AVES Y CERDOS/DIGITAL": 25,
    "MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL": 25
}

# Cargar JSON
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

# Saltar los primeros 30 (ya cargados)
empleados = datos['empleados'][30:]

print(f"Total empleados a cargar: {len(empleados)}")
print(f"Generando {(len(empleados) + 29) // 30} lotes...")

# Generar lotes de 30
lote_num = 2  # Ya cargamos lote 1
batch_size = 30

for start in range(0, len(empleados), batch_size):
    end = min(start + batch_size, len(empleados))
    batch = empleados[start:end]
    
    # Generar VALUES
    values_list = []
    for emp in batch:
        codigo = emp.get('codigo', '').replace("'", "''")
        dni = emp.get('dni', '').replace("'", "''")
        nombre_completo = emp.get('nombreCompleto', '')
        
        if ', ' in nombre_completo:
            apellidos, nombres = nombre_completo.split(', ', 1)
        else:
            nombres = nombre_completo
            apellidos = ''
        
        nombres = nombres.replace("'", "''").replace('�', 'ñ')
        apellidos = apellidos.replace("'", "''").replace('�', 'ñ')
        
        fecha_ingreso = emp.get('fechaIngreso', '')
        # Convertir fecha de M/D/YYYY a YYYY-MM-DD
        if '/' in fecha_ingreso:
            parts = fecha_ingreso.split('/')
            if len(parts) == 3:
                mes, dia, año = parts
                fecha_ingreso = f"{año}-{mes.zfill(2)}-{dia.zfill(2)}"
        
        centro_costo = emp.get('centroCosto', '')
        email = emp.get('email', '').replace("'", "''")
        
        # Buscar area
        area_id = areas_map.get(centro_costo, 1)
        
        # Puesto - usar un ID por defecto temporalmente
        puesto_id = 14  # Asesor
        
        values_list.append(
            f"('{codigo}', '{dni}', '{nombres}', '{apellidos}', '{email}', '{fecha_ingreso}', {puesto_id}, {area_id})"
        )
    
    # Generar SQL
    sql = f"""INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id)
VALUES
{',\n'.join(values_list)};"""
    
    # Guardar en archivo
    filename = f'lote{lote_num}-empleados.sql'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print(f"✓ Generado {filename} con {len(batch)} empleados")
    lote_num += 1

print(f"\n✓ Total de lotes generados: {lote_num - 2}")
print(f"✓ Total de empleados: {len(empleados)}")
