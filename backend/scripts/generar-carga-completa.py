import json

# Primero obtenemos todos los puestos de Supabase para hacer el mapeo
# Este script genera INSERT con puesto_id directo

with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

print("-- Para ejecutar este script, primero necesitamos el mapeo de puestos")
print("-- Ejecutar en Supabase: SELECT id, nombre FROM puestos ORDER BY nombre;")
print("-- Y crear un diccionario con los IDs")
print()
print("-- Por ahora, generamos un script de UPDATE masivo simple")
print()

empleados = datos['empleados']

# Generar DELETE y re-INSERT completo
print("-- PASO 1: Eliminar todos los empleados")
print("DELETE FROM empleados;")
print()
print("-- PASO 2: Reinsertar con los 219 empleados completos")
print()

lote_size = 25
total_lotes = (len(empleados) + lote_size - 1) // lote_size

for lote_idx in range(total_lotes):
    start = lote_idx * lote_size
    end = min(start + lote_size, len(empleados))
    lote_empleados = empleados[start:end]
    
    print(f"-- LOTE {lote_idx + 1}/{total_lotes} - Empleados {start + 1} a {end}")
    print("INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)")
    print("VALUES")
    
    values = []
    for i, emp in enumerate(lote_empleados):
        codigo = emp['codigo']
        dni = emp['dni']
        nombre_completo = emp['nombreCompleto']
        partes = nombre_completo.split(' ', 1)
        nombres = partes[1] if len(partes) > 1 else ''
        apellidos = partes[0] if partes else ''
        
        # Intentar separar mejor
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
        # Convertir formato M/D/YYYY a YYYY-MM-DD
        if '/' in fecha:
            partes_fecha = fecha.split('/')
            if len(partes_fecha) == 3:
                mes, dia, anio = partes_fecha
                fecha = f"{anio}-{mes.zfill(2)}-{dia.zfill(2)}"
        
        # Centro de costo mapeado a area_id (simplificado, usar 1 por defecto)
        area_id = 1
        
        # Tipo de trabajador siempre 1
        tipo_trabajador_id = 1
        
        # Es supervisor si nivelJerarquico < 3
        nivel = emp.get('nivelJerarquico', 5)
        es_supervisor = 'true' if nivel <= 2 else 'false'
        
        es_rrhh = 'false'
        activo = 'true'
        
        nombres_esc = nombres.replace("'", "''")
        apellidos_esc = apellidos.replace("'", "''")
        
        value = f"  ('{codigo}', '{dni}', '{nombres_esc}', '{apellidos_esc}', '{email}', '{fecha}'::date, {area_id}, {tipo_trabajador_id}, {es_supervisor}, {es_rrhh}, {activo})"
        values.append(value)
    
    print(',\n'.join(values))
    print("ON CONFLICT (dni) DO NOTHING;")
    print()

print(f"-- Total: {len(empleados)} empleados")
print()
print("-- PASO 3: Actualizar puesto_id usando el cargo del JSON")
print("-- Este UPDATE usa el nombre del cargo para buscar en la tabla puestos")
print()

for emp in empleados[:10]:  # Solo mostrar ejemplos
    dni = emp['dni']
    cargo = emp['cargo'].replace("'", "''")
    print(f"UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '{cargo}') WHERE dni = '{dni}';")

print("...")
print(f"-- (repetir para los {len(empleados)} empleados)")
