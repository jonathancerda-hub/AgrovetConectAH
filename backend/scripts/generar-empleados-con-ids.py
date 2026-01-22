import json

# Mapeo de cargo a puesto_id (obtenido de Supabase)
PUESTO_MAP = {
    'Director General': 1,
    'Supervisor de Recepcion, Materiales y Despachos a Maquilas': 2,
    'Jefe de Ventas Ganadería': 3,
    'Supervisor de Producto Terminado, Distribucion y Transporte': 4,
    'Jefe de Administración': 5,
    'Director de Finanzas y Tecnologias de la Informacion': 6,
    'Supervisor de Control de Procesos': 7,
    'Directora de Investigacion y Desarrollo': 8,
    'Auxiliar de Limpieza Y Mantenimiento': 9,
    'Directora de Desarrollo Organizacional': 10,
    'Subgerente de Ventas Internacionales': 11,
    'Gerente de Logistica y Distribucion': 12,
    'Asistente de Materiales y Despacho Maquilas': 13,
    'Asesor': 14,
    'Asistente Administrativo de Ventas Internacionales': 15,
    'Coordinador de Proyectos de Mejora de TI': 16,
    'Subgerente de Estabilidades y Validaciones Analiticas': 17,
    'Gerente de Marketing': 18,
    'Gerente de Proyectos y Procesos Farmaceuticos': 19,
    'Directora Comercial Local': 20,
    'Auxiliar de Producto Terminado y Distribucion': 21,
    'Jefe Tecnico Comercial Internacional Petmedica America Latina': 22,
    'Jefe de Produccion de Maquilas': 23,
    'Jefe de Abastecimiento': 24,
    'Supervisor de Finanzas': 25,
    'Asistente de Control de Calidad MP': 26,
    'Jefe de Sanidad Aves y Cerdos': 27,
    'Supervisor Contable': 28,
    'Asistente de Distribucion Internacional': 29,
    'Supervisor de Compras Locales': 30,
    'Jefe de Back Office y Procedimientos Comerciales': 31,
    'Jefe de Asuntos Regulatorios Cuentas Claves': 32,
    'Supervisor de Diseño de Material de Empaque': 33,
    'Gerente de Innovacion y Desarrollo Farmaceutico': 34,
    'Jefe de Asuntos Regulatorios Latam': 35,
    'Analista de Creditos y Cobranzas': 36,
    'Chofer': 37,
    'Jefe de CRM': 38,
    'Jefe de Validaciones Analiticas': 39,
    'Jefe de Escalonamiento y Transferencia': 40,
    'Analista de Tesoreria': 41,
    'Editor de Contenidos': 42,
    'Asistente de Distribucion Local': 43,
    'Jefe de Centro de Distribucion': 44,
    'Representante de Ventas Ganaderia': 45,
    'Supervisor de Creditos y Cobranzas': 46,
    'Representante de Ventas - Animales de Compañía': 47,
    'Asesor Legal': 48,
    'Gerente de Talento Humano y SST': 49,
    'Auxiliar de Laboratorio': 50,
    'Auxiliar de Almacen': 51,
    'Asistente de Gestion de la Calidad': 52,
    'Asistente de Creditos y Cobranzas': 53,
    'Subgerente de Formulacion y Desarrollo de Procesos': 54,
    'Jefe de Sanidad- Animales Mayores y de Produccion': 55,
    'Asesor Externo de Investigación en Ganado Lechero': 56,
    'Guardian': 57,
    'Subgerente de Desarrollo Analitico': 58,
    'Jefe de Asuntos Regulatorios': 59,
    'Gerente de Animales de Compañía': 60,
    'Jefe de Formulaciones': 61,
    'Jefe de Estabilidades': 62,
    'Auxiliar de Mensajería de Investigación Y Desarrollo': 63,
    'Jefe de Seguridad y Medio Ambiente': 64,
    'Supervisor de Asuntos Regulatorios': 65,
    'Jefe Tecnico Comercial': 66,
    'Asistente de Ventas': 67,
    'Jefe de Control de Calidad': 68,
    'Jefe de Marketing Internacional': 69,
    'Asistente de Diseño de Material de Empaque': 70,
    'Supervisor de Ventas Internacionales': 71,
    'Representante de Ventas - Nutriscience': 72,
    'Jefe de Ventas Ganaderia Zona Sur Oriente': 73,
    'Supervisor de Operaciones': 74,
    'Supervisor de Dispensacion': 75,
    'Supervisor de Costos': 76,
    'Jefe de Comercio Exterior': 77,
    'Jefe de Planeamiento Financiero': 78,
    'Subgerente de Ventas Locales': 79,
    'Jefe de Finanzas': 80,
    'Jefe de Sanidad - Animales Menores y Farmacovigilancia': 81,
    'Jefe de Ventas Ganaderia-Zona Norte': 82,
    'Asistente de Marketing': 83,
    'Analista Contable': 84,
    'Supervisor Senior de Tecnicas Analiticas': 85,
    'Jefe de Aplicaciones TI': 86,
    'Asistente Contable': 87,
    'Asistente de Administración': 88,
    'Supervisor de Talento Humano': 89,
    'Gestor de Contenido Digital Veterinario': 90,
    'Gerente Comercial Ganaderia': 91,
    'Supervisor de Dirección de Investigación y Desarrollo': 92,
    'Supervisor de Tecnicas Analiticas': 93,
    'Gerente de Transformación Digital': 94,
    'Supervisor de Asuntos Regulatorios Latam': 95,
    'Auxiliar de Formulaciones': 96,
    'Asistente de Ventas Ecommerce': 97,
    'Asistente de Almacen e Inventarios': 98,
    'Jefe de Comunicación Interna': 99,
    'Supervisor de Procesos Industriales': 100,
    'Supervisor de Formulaciones 2': 101,
    'Auxiliar de Distribucion de Materiales': 102,
    'KAM Aves y Cerdos Lima - Arequipa': 103,
    'Asistente de Costos': 104,
    'Promotor de Ventas Animales de Compañía': 105,
    'Supervisor de Sanidad - Animales Menores y Farmacovigilancia': 106,
    'Asistente de Televentas': 107,
    'Asistente de Operaciones y Logistica': 108,
    'Auxiliar de Distribución de Materiales': 109,
    'Asistente de Tesoreria': 110,
    'Asistente de Ventas internacionales': 111,
    'Supervisor de Estabilidades': 112,
    'Gerente de Producción': 113,
    'Jefe de Ventas Zona Centro': 114,
    'Asistente de Compras Locales': 115,
    'Supervisor de TI': 116,
    'Asistente de Asuntos Regulatorios': 117,
    'Supervisor de Marketing Linea Nutricional': 118,
    'Asistente de Seguridad y Medio Ambiente': 119,
    'Auxiliar de PT y Distribución': 120,
    'Supervisor de Planeamiento Y Control de La Producción': 121,
    'Asistente de Sanidad Animal': 122,
    'Asistente de Compras Internacionales': 123,
    'Supervisor de Proyectos de Finanzas': 124,
    'Supervisor de Infraestructura y Operaciones': 125,
    'Asistente de Infraestructura y Soporte TI': 126,
    'Supervisor de Formulaciones 3': 127,
    'Asistente de Sanidad - Animales Menores y Farmacovigilancia': 128,
    'Supervisor de Validaciones Analíticas': 129,
    'Jefe de Desarrollo Analitico': 130,
    'Asistente de Atracción del Talento': 131,
    'Jefe de Propiedad Intelectual': 132,
    'Asistente de Operaciones de Producción': 133,
    'Promotor de Ventas Pet Nutriscience': 134,
    'Jefe de Investigación y Planeamiento de Demanda': 135,
    'Auxiliar de Recepción': 136,
    'Auxiliar de Infraestructura y TI - Part Time': 137,
    'Supervisor de Desarrollo Analítico': 138,
    'Asistente de Control de Producción': 139,
    'Asistente de Aplicaciones': 140,
    'Jefe de Proyectos de TI': 141,
    'Asistente de Importaciones': 142,
    'Auxiliar de Facturación': 143,
    'Asistente de Diseño Gráfico': 144,
    'Asistente Técnico de Mantenimiento': 145,
    'Auxiliar de Control de Calidad': 146,
    'Asistente de Exportaciones': 147,
    'Supervisor de Formulaciones I': 148,
    'Jefe de Marketing': 149,
    'Gerente Pet Nutriscience': 150,
    'Supervisor de Diseño': 151,
    'Supervisor de Marketing - Línea Ganadería / Aves y Cerdos': 152,
    'Sub Gerente Técnico de Proyectos y Asesor Comercial': 153,
    'Jefe de Ventas Interpet': 154,
    'Representante de Venta Interpet': 155,
    'Asistente de Desarrollo Analítico': 156,
    'Auxiliar de Dispensación': 157,
    'Auxiliar de Limpieza y Lavado': 158,
    'Jefe de Planeamiento y Control de la Producción': 159,
    'Auxiliar de Distribución de Ventas E-Commerce': 160,
    'Supervisor de Desarrollo de Packaging': 161,
    'Jefe Técnico Ganadería': 162,
    'Asistente de Marketing Internacional': 163,
    'Chofer de Operaciones Logísticas': 164,
    'Asistente de Trade Marketing Pets': 165,
    'Supervisor de Desarrollo Online': 166,
    'Asistente de Diseño de Material de Empaque - Compras': 167,
    'Auxiliar de Diseño de Material de Empaque': 168,
    'Asistente de Estabilidades': 169,
    'Supervisor de Aseguramiento de la Calidad': 170,
}

# Leer empleados del JSON
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']

print(f"-- Cargar {len(empleados)} empleados con puesto_id correcto")
print()

# Generar INSERT en lotes de 25
lote_size = 25
total_lotes = (len(empleados) + lote_size - 1) // lote_size

for lote_idx in range(total_lotes):
    start = lote_idx * lote_size
    end = min(start + lote_size, len(empleados))
    lote_empleados = empleados[start:end]
    
    print(f"-- LOTE {lote_idx + 1}/{total_lotes}")
    print("INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)")
    print("VALUES")
    
    values = []
    for emp in lote_empleados:
        codigo = emp['codigo']
        dni = emp['dni']
        nombres = emp.get('nombres', '').replace("'", "''")
        apellidos = emp.get('apellidos', '').replace("'", "''")
        email = emp.get('email', '')
        fecha = emp.get('fechaIngreso', '2024-01-01')
        
        # Convertir fecha
        if '/' in fecha:
            partes = fecha.split('/')
            if len(partes) == 3:
                mes, dia, anio = partes
                fecha = f"{anio}-{mes.zfill(2)}-{dia.zfill(2)}"
        
        cargo = emp.get('cargo', '')
        puesto_id = PUESTO_MAP.get(cargo, 'NULL')
        # Si no hay mapeo, intentar buscar manualmente después
        
        area_id = emp.get('area_id', 1)
        tipo_trabajador_id = 1
        nivel = emp.get('nivelJerarquico', 5)
        try:
            nivel = int(nivel)
        except:
            nivel = 5
        es_supervisor = 'true' if nivel <= 2 else 'false'
        es_rrhh = 'true' if emp.get('rol') == 'rrhh' else 'false'
        activo = 'true'
        
        value = f"  ('{codigo}', '{dni}', '{nombres}', '{apellidos}', '{email}', '{fecha}'::date, {puesto_id}, {area_id}, {tipo_trabajador_id}, {es_supervisor}, {es_rrhh}, {activo})"
        values.append(value)
    
    print(',\n'.join(values))
    print("ON CONFLICT (dni) DO NOTHING;")
    print()

print(f"-- Total: {len(empleados)} empleados")
