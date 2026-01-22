import json
import re
import sys

# Forzar UTF-8 en stdout
sys.stdout.reconfigure(encoding='utf-8')

with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

empleados = datos['empleados']
lote_size = 30
total_lotes = (len(empleados) + lote_size - 1) // lote_size

print(f"-- Generando {total_lotes} lotes para {len(empleados)} empleados\n")

for lote_num in range(total_lotes):
    inicio = lote_num * lote_size
    fin = min(inicio + lote_size, len(empleados))
    empleados_lote = empleados[inicio:fin]
    
    print(f"-- LOTE {lote_num + 1}/{total_lotes} - Empleados {inicio + 1} a {fin}")
    print("INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)")
    print("SELECT * FROM (VALUES")
    
    valores = []
    emails_usados = set()
    
    for emp in empleados_lote:
        # Parsear nombre
        partes = emp['nombreCompleto'].split(',')
        apellidos = partes[0].strip().replace("'", "''")
        nombres = (partes[1].strip() if len(partes) > 1 else '').replace("'", "''")
        
        # Email único
        email = emp['email']
        contador = 1
        while email in emails_usados:
            email = emp['email'].replace('@', f'{contador}@')
            contador += 1
        emails_usados.add(email)
        
        # Convertir fecha al formato SQL
        fecha = emp['fechaIngreso']
        try:
            # Intentar parsear M/D/YYYY
            partes_fecha = fecha.split('/')
            if len(partes_fecha) == 3:
                mes, dia, anio = partes_fecha
                fecha_sql = f"{anio}-{mes.zfill(2)}-{dia.zfill(2)}"
            else:
                fecha_sql = fecha
        except:
            fecha_sql = fecha
        
        cargo_escaped = emp['cargo'].replace("'", "''")
        es_supervisor = 'true' if emp['rol'] in ['supervisor', 'admin'] else 'false'
        es_rrhh = 'true' if emp['rol'] == 'rrhh' else 'false'
        
        area_ids = {
            'ADMINISTRACION': 1, 'ALMACEN': 2, 'ALMACEN/ COMPRAS/ PCP/ COMERCIO EXTERIOR': 3,
            'ASEGURAMIENTO DE LA CALIDAD': 4, 'ASUNTOS REGULATORIOS': 5, 'AVES Y CERDOS': 6,
            'COMERCIO ELECTRONICO': 7, 'COMERCIO EXTERIOR': 8, 'COMPANIA': 9, 'COMPRAS': 10,
            'CONTABILIDAD Y COSTOS': 11, 'CONTABILIDAD Y COSTOS/PLANEAMIENTO FINANCIERO/FINANZAS/ADMINISTRACION/SISTEMAS': 12,
            'CONTROL DE CALIDAD': 13, 'DESARROLLO ANALITICO': 14, 'ESTABILIDADES Y VALIDACIONES ANALITICAS': 15,
            'FINANZAS': 16, 'FORMULACION': 17, 'GERENCIA GENERAL': 18,
            'I&D/FORMULACION/ASUNTOS REGULATORIOS/DESARROLLO ANALITICO/SANIDAD ANIMAL': 19,
            'INTERPET': 20, 'MARKETING': 21, 'MARKETING LOCAL': 22,
            'MARKETING LOCAL/MARKETING INTERNACIONAL/COMERCIO ELECTRONICO/MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL': 23,
            'MAYORES': 24, 'MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL': 25, 'NUTRICIONAL': 26,
            'PCP': 27, 'PLANEAMIENTO FINANCIERO': 28, 'PRODUCCION': 29,
            'PROYECTOS Y PROCESOS Y FARMACEUTICOS': 30, 'SANIDAD ANIMAL': 31,
            'SEGURIDAD Y MEDIO AMBIENTE': 32, 'SISTEMAS': 33, 'TALENTO HUMANO': 34,
            'VENTAS INTERNACIONALES': 35
        }
        area_id = area_ids.get(emp['area'], 1)
        
        valores.append(
            f"  ('{emp['codigo']}', '{emp['dni']}', '{nombres}', '{apellidos}', '{email}', " +
            f"'{fecha_sql}'::date, (SELECT id FROM puestos WHERE nombre = '{cargo_escaped}'), " +
            f"{area_id}, {emp.get('tipoTrabajadorId', 1)}, {es_supervisor}, {es_rrhh}, true)"
        )
    
    print(',\n'.join(valores))
    print(") AS datos(codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)")
    print("ON CONFLICT (dni) DO NOTHING;\n")

print(f"-- Total: {len(empleados)} empleados en {total_lotes} lotes")
