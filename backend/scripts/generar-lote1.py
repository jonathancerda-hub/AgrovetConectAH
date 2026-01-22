import json

# Mapeos simples
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

empleados = datos['empleados'][:30]  # Primeros 30

# Generar VALUES
values_list = []
for emp in empleados:
    codigo = emp.get('codigo', '').replace("'", "''")
    dni = emp.get('dni', '').replace("'", "''")
    nombre_completo = emp.get('nombreCompleto', '')
    
    if ', ' in nombre_completo:
        apellidos, nombres = nombre_completo.split(', ', 1)
    else:
        nombres = nombre_completo
        apellidos = ''
    
    nombres = nombres.replace("'", "''")
    apellidos = apellidos.replace("'", "''")
    
    fecha_ingreso = emp.get('fechaIngreso', '')
    cargo = emp.get('cargo', '')
    centro_costo = emp.get('centroCosto', '')
    
    # Buscar area
    area_id = areas_map.get(centro_costo, 1)
    
    # Buscar puesto - usar un ID por defecto temporalmente
    puesto_id = 14  # Asesor
    
    # Nivel jerárquico
    nivel_str = emp.get('nivelJerarquico', '5')
    if isinstance(nivel_str, str):
        if '1' in nivel_str or 'Director' in nivel_str or 'Gerente' in cargo:
            nivel = 1
        elif '2' in nivel_str or 'Subgerente' in nivel_str or 'Subgerente' in cargo:
            nivel = 2
        elif '3' in nivel_str:
            nivel = 3
        elif '4' in nivel_str or 'Jefe' in nivel_str or 'Jefe' in cargo:
            nivel = 4
        elif '5' in nivel_str or 'Supervisor' in nivel_str or 'Supervisor' in cargo:
            nivel = 5
        else:
            nivel = 6
    else:
        nivel = int(nivel_str) if nivel_str else 6
    
    email = emp.get('email', '').replace("'", "''")
    
    values_list.append(
        f"('{codigo}', '{dni}', '{nombres}', '{apellidos}', '{email}', '{fecha_ingreso}', {puesto_id}, {area_id})"
    )

# Generar SQL
sql = f"""INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id)
VALUES
{',\n'.join(values_list)};"""

with open('lote1-empleados.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print("SQL generado en lote1-empleados.sql")
print(f"Total de empleados en lote: {len(empleados)}")
