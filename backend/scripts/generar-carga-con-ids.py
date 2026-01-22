import json

# Mapeo completo de puestos: nombre -> id
puestos_map = {
    "Analista Comercial": 161,
    "Analista Contable": 84,
    "Analista de Almacenes": 126,
    "Analista de Comercio Exterior": 132,
    "Analista de Creditos y Cobranzas": 36,
    "Analista de Creditos y Cobranzas Senior": 117,
    "Analista de Desarrollo Analitico": 111,
    "Analista de Desarrollo de Marketing": 151,
    "Analista de Desarrollo de Proyectos Farmaceuticos": 95,
    "Analista de Desarrollo Digital": 162,
    "Analista de Estadisticas": 107,
    "Analista de Gestion de Compras": 118,
    "Analista de Importaciones": 121,
    "Analista de Insight & Planning": 169,
    "Analista de Operaciones": 99,
    "Analista de Producto": 152,
    "Analista de SST": 163,
    "Analista de Tesoreria": 41,
    "Analista de Tesoreria Senior": 106,
    "Analista de Validaciones Analiticas": 150,
    "Analista de Ventas": 144,
    "Analista Senior de Aseguramiento de la Calidad": 98,
    "Asesor": 14,
    "Asesor Externo de Investigación en Ganado Lechero": 56,
    "Asesor Legal": 48,
    "Asistente Administrativo de Ventas Internacionales": 15,
    "Asistente Contable": 87,
    "Asistente de Abastecimiento": 130,
    "Asistente de Administración": 88,
    "Asistente de Comunicacion Interna": 160,
    "Asistente de Comunicaciones de Marketing Local": 168,
    "Asistente de Control de Calidad MP": 26,
    "Asistente de Creditos y Cobranzas": 53,
    "Asistente de Diseño de Material de Empaque": 70,
    "Asistente de Distribucion Internacional": 29,
    "Asistente de Distribucion Local": 43,
    "Asistente de Gestion de la Calidad": 52,
    "Asistente de Marketing": 83,
    "Asistente de Marketing Local": 129,
    "Asistente de Materiales y Despacho Maquilas": 13,
    "Asistente de Registros": 137,
    "Asistente de Ventas": 67,
    "Asistente Tecnico Comercial": 156,
    "Auxiliar de Almacen": 51,
    "Auxiliar de Almacen de Materiales": 103,
    "Auxiliar de Compras": 139,
    "Auxiliar de Laboratorio": 50,
    "Auxiliar de Limpieza Y Mantenimiento": 9,
    "Auxiliar de Mantenimiento": 92,
    "Auxiliar de Mensajería de Investigación Y Desarrollo": 63,
    "Auxiliar de Produccion": 97,
    "Auxiliar de Producto Terminado y Distribucion": 21,
    "Auxiliar de Productos Terminado": 166,
    "Auxiliar de Servicios Generales": 136,
    "Chofer": 37,
    "Community Manager": 164,
    "Coordinador de Desarrollo de Empaque": 140,
    "Coordinador de E-commerce": 159,
    "Coordinador de Gestion de Almacenes": 142,
    "Coordinador de Infraestructura y Seguridad TI": 91,
    "Coordinador de Proyectos de Mejora de TI": 16,
    "Coordinador de Seguridad Y Medio Ambiente": 134,
    "Director de Finanzas y Tecnologias de la Informacion": 6,
    "Director General": 1,
    "Directora Comercial Local": 20,
    "Directora de Desarrollo Organizacional": 10,
    "Directora de Investigacion y Desarrollo": 8,
    "Editor de Contenidos": 42,
    "Especialista Digital de Marca": 153,
    "Especialista en Transformacion": 154,
    "Gerente Aves Y Cerdos": 120,
    "Gerente de Animales de Compañía": 60,
    "Gerente de Aseguramiento de la Calidad": 96,
    "Gerente de Innovacion y Desarrollo Farmaceutico": 34,
    "Gerente de Logistica y Distribucion": 12,
    "Gerente de Marketing": 18,
    "Gerente de Planta Maquilas": 102,
    "Gerente de Proyectos y Procesos Farmaceuticos": 19,
    "Gerente de Talento Humano y SST": 49,
    "Gerente de Ventas Zonas Norte - Centro y Selva": 112,
    "Gerente Mayores": 125,
    "Gerente Nutriscience": 146,
    "Gerente Regional de Interpet": 124,
    "Guardian": 57,
    "Jefe de Abastecimiento": 24,
    "Jefe de Administración": 5,
    "Jefe de Aplicaciones TI": 86,
    "Jefe de Asuntos Regulatorios": 59,
    "Jefe de Asuntos Regulatorios Cuentas Claves": 32,
    "Jefe de Asuntos Regulatorios Latam": 35,
    "Jefe de Back Office y Procedimientos Comerciales": 31,
    "Jefe de Centro de Distribucion": 44,
    "Jefe de Comercio Electronico": 165,
    "Jefe de Comercio Exterior": 77,
    "Jefe de Contabilidad Y Costos": 101,
    "Jefe de Control de Calidad": 68,
    "Jefe de CRM": 38,
    "Jefe de Customer Experience": 157,
    "Jefe de Empaque Primario": 133,
    "Jefe de Escalonamiento y Transferencia": 40,
    "Jefe de Estabilidades": 62,
    "Jefe de Finanzas": 80,
    "Jefe de Formulaciones": 61,
    "Jefe de Gestion de la Calidad": 119,
    "Jefe de Investigación en Ganado Lechero": 147,
    "Jefe de Investigacion y Formulacion": 109,
    "Jefe de Marketing Internacional": 69,
    "Jefe de Mayores": 143,
    "Jefe de Operaciones": 138,
    "Jefe de PCP": 116,
    "Jefe de Planeamiento Financiero": 78,
    "Jefe de Produccion": 94,
    "Jefe de Produccion de Farmaceuticos": 105,
    "Jefe de Produccion de Maquilas": 23,
    "Jefe de Sanidad - Animales Menores y Farmacovigilancia": 81,
    "Jefe de Sanidad Aves y Cerdos": 27,
    "Jefe de Sanidad- Animales Mayores y de Produccion": 55,
    "Jefe de Seguridad y Medio Ambiente": 64,
    "Jefe de Validaciones Analiticas": 39,
    "Jefe de Ventas Ganadería": 3,
    "Jefe de Ventas Ganaderia Zona Sur Oriente": 73,
    "Jefe de Ventas Ganaderia-Zona Norte": 82,
    "Jefe Tecnico Comercial": 66,
    "Jefe Tecnico Comercial Internacional Petmedica America Latina": 22,
    "Operador de Dispensacion y Produccion": 131,
    "Operario de Dispensacion": 135,
    "Operario de Empaque": 141,
    "Operario de Produccion": 115,
    "Pasante": 167,
    "Representante de Ventas - Animales de Compañía": 47,
    "Representante de Ventas - Nutriscience": 72,
    "Representante de Ventas Ganaderia": 45,
    "Representante de Ventas Productores Interpet": 110,
    "Subgerente de Desarrollo Analitico": 58,
    "Subgerente de Estabilidades y Validaciones Analiticas": 17,
    "Subgerente de Formulacion y Desarrollo de Procesos": 54,
    "Subgerente de Ventas Internacionales": 11,
    "Subgerente de Ventas Locales": 79,
    "Supervisor Contable": 28,
    "Supervisor de Asuntos Regulatorios": 65,
    "Supervisor de Calidad Microbiologica": 127,
    "Supervisor de Compras Locales": 30,
    "Supervisor de Control de Procesos": 7,
    "Supervisor de Costos": 76,
    "Supervisor de Creditos y Cobranzas": 46,
    "Supervisor de Diseño de Material de Empaque": 33,
    "Supervisor de Dispensacion": 75,
    "Supervisor de Empaque": 93,
    "Supervisor de Finanzas": 25,
    "Supervisor de Limpieza": 123,
    "Supervisor de Limpieza Y Mantenimiento": 158,
    "Supervisor de Maquilas": 148,
    "Supervisor de Operaciones": 74,
    "Supervisor de PCP": 122,
    "Supervisor de Producto Terminado, Distribucion y Transporte": 4,
    "Supervisor de Recepcion, Materiales y Despachos a Maquilas": 2,
    "Supervisor de Talento Humano": 89,
    "Supervisor de Ventas": 90,
    "Supervisor de Ventas Internacionales": 71,
    "Supervisor Senior de Tecnicas Analiticas": 85,
    "Tecnico Compras": 128,
    "Tecnico de Asuntos Regulatorios": 100,
    "Tecnico de Control de Procesos": 104,
    "Tecnico de Empaque Primario": 114,
    "Tecnico de Estabilidades y Validaciones": 113,
    "Tecnico de Formulacion": 108,
    "Tecnico de Microbiologia": 149,
    "Tecnico de Seguridad Y Medio Ambiente": 145
}

# Mapeo de areas (simplificado - usar el centro de costo del JSON)
areas_map = {
    "ADMINISTRACION": 1,
    "ALMACEN Y CENTROS DE DISTRIBUCION": 2,
    "ASEGURAMIENTO DE LA CALIDAD": 4,
    "ASUNTOS REGULATORIOS": 5,
    "AVES Y CERDOS": 6,
    "COMERCIO ELECTRONICO": 7,
    "COMERCIO EXTERIOR": 8,
    "COMPRAS": 10,
    "CONTABILIDAD": 11,
    "CONTROL DE CALIDAD": 13,
    "DESARROLLO ANALITICO": 14,
    "ESTABILIDADES": 15,
    "FINANZAS": 16,
    "FORMULACION Y DESARROLLO DE PROCESOS": 17,
    "GERENCIA GENERAL": 18,
    "INVESTIGACION Y DESARROLLO": 19,
    "INTERPET": 20,
    "LOGISTICA Y DISTRIBUCION": 3,
    "MARKETING": 21,
    "MARKETING - GANADERIA AVES Y CERDOS": 22,
    "MARKETING ANIMALES DE COMPAÑIA": 7,
    "MARKETING INTERNACIONAL": 35,
    "NUTRISCIENCE": 26,
    "OPERACIONES DE PRODUCCION": 29,
    "PLANEAMIENTO Y CONTROL DE LA PRODUCCION": 27,
    "PLANEAMIENTO FINANCIERO": 28,
    "PROYECTOS Y PROCESOS FARMACEUTICOS": 30,
    "SANIDAD": 31,
    "SEGURIDAD Y MEDIO AMBIENTE": 32,
    "TECNOLOGIAS DE LA INFORMACION": 33,
    "TALENTO HUMANO Y SST": 34,
    "VENTAS INTERNACIONALES": 35,
    "VENTAS - GANADERIA": 24,
    "VENTAS - ANIMALES DE COMPAÑIA": 1
}

# Leer datos de JSON
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']

print(f"-- CARGA COMPLETA DE {len(empleados)} EMPLEADOS")
print(f"-- Usando IDs de puestos directos (no subquerys)")
print()

lote_size = 25
total_lotes = (len(empleados) + lote_size - 1) // lote_size

for lote_idx in range(total_lotes):
    start = lote_idx * lote_size
    end = min(start + lote_size, len(empleados))
    lote_empleados = empleados[start:end]
    
    print(f"-- LOTE {lote_idx + 1}/{total_lotes} - Empleados {start + 1} a {end}")
    print("INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)")
    print("VALUES")
    
    values = []
    for emp in lote_empleados:
        codigo = emp['codigo']
        dni = emp['dni']
        nombre_completo = emp['nombreCompleto']
        
        # Separar nombres y apellidos
        palabras = nombre_completo.split()
        if len(palabras) >= 3:
            nombres = ' '.join(palabras[:2])
            apellidos = ' '.join(palabras[2:])
        else:
            nombres = palabras[0] if palabras else ''
            apellidos = ' '.join(palabras[1:]) if len(palabras) > 1 else ''
        
        email = f"{nombres.lower().replace(' ', '.')}.{apellidos.lower().replace(' ', '.')}@agrovetmarket.com"
        email = email.replace('..', '.')
        
        fecha = emp.get('fechaIngreso', '2024-01-01')
        if '/' in fecha:
            partes_fecha = fecha.split('/')
            if len(partes_fecha) == 3:
                mes, dia, anio = partes_fecha
                fecha = f"{anio}-{mes.zfill(2)}-{dia.zfill(2)}"
        
        # Obtener puesto_id del mapeo
        cargo = emp['cargo']
        puesto_id = puestos_map.get(cargo)
        if not puesto_id:
            print(f"-- WARNING: Puesto no encontrado: {cargo}")
            puesto_id = 'NULL'
        
        # Obtener area_id del centro de costo
        centro_costo = emp.get('centroCosto', 'ADMINISTRACION').upper()
        area_id = areas_map.get(centro_costo, 1)
        
        nivel = emp.get('nivelJerarquico', 5)
        es_supervisor = 'true' if nivel <= 2 else 'false'
        
        nombres_esc = nombres.replace("'", "''")
        apellidos_esc = apellidos.replace("'", "''")
        
        value = f"  ('{codigo}', '{dni}', '{nombres_esc}', '{apellidos_esc}', '{email}', '{fecha}'::date, {puesto_id}, {area_id}, 1, {es_supervisor}, false, true)"
        values.append(value)
    
    print(',\n'.join(values))
    print("ON CONFLICT (dni) DO NOTHING;")
    print()

print(f"-- Total: {len(empleados)} empleados cargados con puesto_id directo")
