import json
import sys

# Mapeo de áreas
areas_map = {
    "ADMINISTRACION": 1,
    "ALMACEN": 2,
    "ALMACEN/ COMPRAS/ PCP/ COMERCIO EXTERIOR": 3,
    "ASEGURAMIENTO DE LA CALIDAD": 4,
    "ASUNTOS REGULATORIOS": 5,
    "AVES Y CERDOS": 6,
    "COMERCIO ELECTRONICO": 7,
    "COMERCIO EXTERIOR": 8,
    "COMPAÑIA": 9,
    "COMPANIA": 9,  # Sin tilde también apunta al mismo
    "COMPRAS": 10,
    "CONTABILIDAD Y COSTOS": 11,
    "CONTABILIDAD Y COSTOS/PLANEAMIENTO FINANCIERO/FINANZAS/ADMINISTRACION/SISTEMAS": 12,
    "CONTROL DE CALIDAD": 13,
    "DESARROLLO ANALITICO": 14,
    "ESTABILIDADES Y VALIDACIONES ANALITICAS": 15,
    "FINANZAS": 16,
    "FORMULACION": 17,
    "GERENCIA GENERAL": 18,
    "I&D/FORMULACION/ASUNTOS REGULATORIOS/DESARROLLO ANALITICO/SANIDAD ANIMAL": 19,
    "INTERPET": 20,
    "MARKETING": 21,
    "MARKETING LOCAL": 22,
    "MARKETING LOCAL/MARKETING INTERNACIONAL/COMERCIO ELECTRONICO/MAYORES/COMPAÑIA/AVES Y CERDOS/DIGITAL": 23,
    "MARKETING LOCAL/MARKETING INTERNACIONAL/COMERCIO ELECTRONICO/MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL": 23,
    "MAYORES": 24,
    "MAYORES/COMPAÑIA/AVES Y CERDOS/DIGITAL": 25,
    "MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL": 25,
    "NUTRICIONAL": 26,
    "PCP": 27,
    "PLANEAMIENTO FINANCIERO": 28,
    "PRODUCCION": 29,
    "PROYECTOS Y PROCESOS Y FARMACEUTICOS": 30,
    "SANIDAD ANIMAL": 31,
    "SEGURIDAD Y MEDIO AMBIENTE": 32,
    "SISTEMAS": 33,
    "TALENTO HUMANO": 34,
    "VENTAS INTERNACIONALES": 35
}

# Mapeo de puestos (manteniendo los caracteres especiales correctos)
puestos_map = {
    "Director General": 1,
    "Supervisor de Recepcion, Materiales y Despachos a Maquilas": 2,
    "Jefe de Ventas Ganadería": 3,
    "Jefe de Ventas Ganaderia": 3,
    "Supervisor de Producto Terminado, Distribucion y Transporte": 4,
    "Jefe de Administración": 5,
    "Jefe de Administracion": 5,
    "Director de Finanzas y Tecnologias de la Informacion": 6,
    "Supervisor de Control de Procesos": 7,
    "Directora de Investigacion y Desarrollo": 8,
    "Auxiliar de Limpieza Y Mantenimiento": 9,
    "Directora de Desarrollo Organizacional": 10,
    "Subgerente de Ventas Internacionales": 11,
    "Gerente de Logistica y Distribucion": 12,
    "Asistente de Materiales y Despacho Maquilas": 13,
    "Asesor": 14,
    "Asistente Administrativo de Ventas Internacionales": 15,
    "Coordinador de Proyectos de Mejora de TI": 16,
    "Subgerente de Estabilidades y Validaciones Analiticas": 17,
    "Gerente de Marketing": 18,
    "Gerente de Proyectos y Procesos Farmaceuticos": 19,
    "Directora Comercial Local": 20,
    "Auxiliar de Producto Terminado y Distribucion": 21,
    "Jefe Tecnico Comercial Internacional Petmedica America Latina": 22,
    "Jefe de Produccion de Maquilas": 23,
    "Jefe de Abastecimiento": 24,
    "Supervisor de Finanzas": 25,
    "Asistente de Control de Calidad MP": 26,
    "Jefe de Sanidad Aves y Cerdos": 27,
    "Supervisor Contable": 28,
    "Asistente de Distribucion Internacional": 29,
    "Supervisor de Compras Locales": 30,
    "Jefe de Back Office y Procedimientos Comerciales": 31,
    "Jefe de Asuntos Regulatorios Cuentas Claves": 32,
    "Supervisor de Diseño de Material de Empaque": 33,
    "Supervisor de Diseno de Material de Empaque": 33,
    "Gerente de Innovacion y Desarrollo Farmaceutico": 34,
    "Jefe de Asuntos Regulatorios Latam": 35,
    "Analista de Creditos y Cobranzas": 36,
    "Chofer": 37,
    "Jefe de CRM": 38,
    "Jefe de Validaciones Analiticas": 39,
    "Jefe de Escalonamiento y Transferencia": 40,
    "Analista de Tesoreria": 41,
    "Editor de Contenidos": 42,
    "Asistente de Distribucion Local": 43,
    "Jefe de Centro de Distribucion": 44,
    "Representante de Ventas Ganaderia": 45,
    "Supervisor de Creditos y Cobranzas": 46,
    "Representante de Ventas - Animales de Compañía": 47,
    "Representante de Ventas - Animales de Compania": 47,
    "Asesor Legal": 48,
    "Gerente de Talento Humano y SST": 49,
    "Auxiliar de Laboratorio": 50,
    "Auxiliar de Almacen": 51,
    "Asistente de Gestion de la Calidad": 52,
    "Asistente de Creditos y Cobranzas": 53,
    "Subgerente de Formulacion y Desarrollo de Procesos": 54,
    "Jefe de Sanidad- Animales Mayores y de Produccion": 55,
    "Asesor Externo de Investigación en Ganado Lechero": 56,
    "Asesor Externo de Investigacion en Ganado Lechero": 56,
    "Guardian": 57,
    "Subgerente de Desarrollo Analitico": 58,
    "Jefe de Asuntos Regulatorios": 59,
    "Gerente de Animales de Compañía": 60,
    "Gerente de Animales de Compania": 60,
    "Jefe de Formulaciones": 61,
    "Jefe de Estabilidades": 62,
    "Auxiliar de Mensajería de Investigación Y Desarrollo": 63,
    "Auxiliar de Mensajeria de Investigacion Y Desarrollo": 63,
    "Jefe de Seguridad y Medio Ambiente": 64,
    "Supervisor de Asuntos Regulatorios": 65,
    "Jefe Tecnico Comercial": 66,
    "Asistente de Ventas": 67,
    "Jefe de Control de Calidad": 68,
    "Jefe de Marketing Internacional": 69,
    "Asistente de Diseño de Material de Empaque": 70,
    "Asistente de Diseno de Material de Empaque": 70,
    "Supervisor de Ventas Internacionales": 71,
    "Representante de Ventas - Nutriscience": 72,
    "Jefe de Ventas Ganaderia Zona Sur Oriente": 73,
    "Supervisor de Operaciones": 74,
    "Supervisor de Dispensacion": 75,
    "Supervisor de Costos": 76,
    "Jefe de Comercio Exterior": 77,
    "Jefe de Planeamiento Financiero": 78,
    "Subgerente de Ventas Locales": 79,
    "Jefe de Finanzas": 80,
    "Jefe de Sanidad - Animales Menores y Farmacovigilancia": 81,
    "Jefe de Ventas Ganaderia-Zona Norte": 82,
    "Asistente de Marketing": 83,
    "Analista Contable": 84,
    "Supervisor Senior de Tecnicas Analiticas": 85,
    "Jefe de Aplicaciones TI": 86,
    "Asistente Contable": 87,
    "Asistente de Administración": 88,
    "Asistente de Administracion": 88,
    "Supervisor de Talento Humano": 89,
    "Supervisor de Ventas": 90,
    "Coordinador de Infraestructura y Seguridad TI": 91,
    "Auxiliar de Mantenimiento": 92,
    "Supervisor de Empaque": 93,
    "Jefe de Produccion": 94,
    "Analista de Desarrollo de Proyectos Farmaceuticos": 95,
    "Gerente de Aseguramiento de la Calidad": 96,
    "Auxiliar de Produccion": 97,
    "Analista Senior de Aseguramiento de la Calidad": 98,
    "Analista de Operaciones": 99,
    "Tecnico de Asuntos Regulatorios": 100,
    "Jefe de Contabilidad Y Costos": 101,
    "Gerente de Planta Maquilas": 102,
    "Auxiliar de Almacen de Materiales": 103,
    "Tecnico de Control de Procesos": 104,
    "Jefe de Produccion de Farmaceuticos": 105,
    "Analista de Tesoreria Senior": 106,
    "Analista de Estadisticas": 107,
    "Tecnico de Formulacion": 108,
    "Jefe de Investigacion y Formulacion": 109,
    "Representante de Ventas Productores Interpet": 110,
    "Analista de Desarrollo Analitico": 111,
    "Gerente de Ventas Zonas Norte - Centro y Selva": 112,
    "Tecnico de Estabilidades y Validaciones": 113,
    "Tecnico de Empaque Primario": 114,
    "Operario de Produccion": 115,
    "Jefe de PCP": 116,
    "Analista de Creditos y Cobranzas Senior": 117,
    "Analista de Gestion de Compras": 118,
    "Jefe de Gestion de la Calidad": 119,
    "Gerente Aves Y Cerdos": 120,
    "Analista de Importaciones": 121,
    "Supervisor de PCP": 122,
    "Supervisor de Limpieza": 123,
    "Gerente Regional de Interpet": 124,
    "Gerente Mayores": 125,
    "Analista de Almacenes": 126,
    "Supervisor de Calidad Microbiologica": 127,
    "Tecnico Compras": 128,
    "Asistente de Marketing Local": 129,
    "Asistente de Abastecimiento": 130,
    "Operador de Dispensacion y Produccion": 131,
    "Analista de Comercio Exterior": 132,
    "Jefe de Empaque Primario": 133,
    "Coordinador de Seguridad Y Medio Ambiente": 134,
    "Operario de Dispensacion": 135,
    "Auxiliar de Servicios Generales": 136,
    "Asistente de Registros": 137,
    "Jefe de Operaciones": 138,
    "Auxiliar de Compras": 139,
    "Coordinador de Desarrollo de Empaque": 140,
    "Operario de Empaque": 141,
    "Coordinador de Gestion de Almacenes": 142,
    "Jefe de Mayores": 143,
    "Analista de Ventas": 144,
    "Tecnico de Seguridad Y Medio Ambiente": 145,
    "Gerente Nutriscience": 146,
    "Jefe de Investigación en Ganado Lechero": 147,
    "Jefe de Investigacion en Ganado Lechero": 147,
    "Supervisor de Maquilas": 148,
    "Tecnico de Microbiologia": 149,
    "Analista de Validaciones Analiticas": 150,
    "Analista de Desarrollo de Marketing": 151,
    "Analista de Producto": 152,
    "Especialista Digital de Marca": 153,
    "Especialista en Transformacion": 154,
    "Asistente Tecnico Comercial": 156,
    "Jefe de Customer Experience": 157,
    "Supervisor de Limpieza Y Mantenimiento": 158,
    "Coordinador de E-commerce": 159,
    "Asistente de Comunicacion Interna": 160,
    "Analista Comercial": 161,
    "Analista de Desarrollo Digital": 162,
    "Analista de SST": 163,
    "Community Manager": 164,
    "Jefe de Comercio Electronico": 165,
    "Auxiliar de Productos Terminado": 166,
    "Pasante": 167,
    "Asistente de Comunicaciones de Marketing Local": 168,
    "Analista de Insight & Planning": 169
}

# Leer datos-procesados.json
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']

# Generar SQL en lotes de 25
batch_size = 25
total_batches = (len(empleados) + batch_size - 1) // batch_size

sqls = []  # Almacenar todos los SQLs
advertencias = []

for batch_num in range(total_batches):
    start = batch_num * batch_size
    end = min((batch_num + 1) * batch_size, len(empleados))
    batch = empleados[start:end]
    
    values_parts = []
    for emp in batch:
        # Extraer datos
        codigo = emp.get('codigo', '')
        dni = emp.get('dni', '')
        nombre_completo = emp.get('nombreCompleto', '')
        
        # Parsear nombre completo: "Apellidos, Nombres"
        if ', ' in nombre_completo:
            apellidos, nombres = nombre_completo.split(', ', 1)
        else:
            nombres = nombre_completo
            apellidos = ''
        
        fecha_ingreso = emp.get('fechaIngreso', '')
        cargo = emp.get('cargo', '')
        centro_costo = emp.get('centroCosto', '')
        email = emp.get('email', '')
        rol = emp.get('rol', 'empleado')
        
        # Convertir nivel jerárquico
        nivel = emp.get('nivelJerarquico', 5)
        try:
            nivel = int(nivel)
        except:
            nivel = 5
        
        # Buscar area_id
        area_id = areas_map.get(centro_costo)
        if not area_id:
            advertencias.append(f"Área no encontrada para {codigo}: {centro_costo}")
            area_id = 1  # Default
        
        # Buscar puesto_id
        puesto_id = puestos_map.get(cargo)
        if not puesto_id:
            advertencias.append(f"Puesto no encontrado para {codigo}: {cargo}")
            puesto_id = 14  # Default "Asesor"
        
        # Escapar valores
        codigo_sql = codigo.replace("'", "''")
        dni_sql = dni.replace("'", "''")
        nombres_sql = nombres.replace("'", "''")
        apellidos_sql = apellidos.replace("'", "''")
        email_sql = email.replace("'", "''")
        
        values_parts.append(
            f"('{codigo_sql}', '{dni_sql}', '{nombres_sql}', '{apellidos_sql}', "
            f"'{fecha_ingreso}', {puesto_id}, {area_id}, {nivel})"
        )
    
    sql = f"""INSERT INTO empleados (codigo, dni, nombres, apellidos, fecha_ingreso, puesto_id, area_id, nivel_jerarquico)
VALUES
{',\n'.join(values_parts)};"""
    
    sqls.append({
        'batch': batch_num + 1,
        'count': len(batch),
        'sql': sql
    })

# Escribir resultado en formato JSON
result = {
    'total_batches': total_batches,
    'total_empleados': len(empleados),
    'advertencias': advertencias,
    'batches': sqls
}

import json as json_module
print(json_module.dumps(result, ensure_ascii=False, indent=2))
