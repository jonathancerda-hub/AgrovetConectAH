import json
import sys

# Configurar UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Leer datos del JSON
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

# Crear mapeo de DNI a código de empleado
dni_a_codigo = {e['dni']: e['codigo'] for e in datos['empleados']}

print("=" * 80)
print("AUDITORÍA COMPLETA DE SUPERVISORES")
print("Comparación JSON vs Base de Datos")
print("=" * 80)

errores = []
correctos = 0

# Generar SQL para verificar TODOS los empleados
print("\n-- SQL para verificar supervisores en la base de datos:\n")
print("SELECT ")
print("  e.codigo_empleado,")
print("  e.dni,")
print("  e.nombres || ' ' || e.apellidos as empleado,")
print("  s.dni as supervisor_dni,")
print("  s.codigo_empleado as supervisor_codigo,")
print("  s.nombres || ' ' || s.apellidos as supervisor_nombre")
print("FROM empleados e")
print("LEFT JOIN empleados s ON e.supervisor_id = s.id")
print("WHERE e.codigo_empleado != 'AGV0002'")
print("ORDER BY e.codigo_empleado;")

print("\n" + "=" * 80)
print("ANÁLISIS DE RELACIONES JERÁRQUICAS EN JSON")
print("=" * 80)

# Analizar cada empleado
for emp in sorted(datos['empleados'], key=lambda x: x['codigo']):
    codigo = emp['codigo']
    dni_jefe = emp.get('dniJefe')
    
    # Skip el director general
    if codigo == 'AGV0002':
        continue
    
    if dni_jefe:
        # Buscar quién debería ser su jefe
        codigo_jefe = dni_a_codigo.get(dni_jefe)
        jefe_info = next((j for j in datos['empleados'] if j['dni'] == dni_jefe), None)
        
        if not jefe_info:
            errores.append({
                'empleado': codigo,
                'nombre': emp.get('nombreCompleto', ''),
                'problema': f"DNI de jefe {dni_jefe} no existe en datos",
                'dni_jefe_esperado': dni_jefe,
                'codigo_jefe_esperado': None
            })
        else:
            print(f"{codigo} -> {codigo_jefe} ({jefe_info.get('nombreCompleto', '')})")
            correctos += 1
    else:
        errores.append({
            'empleado': codigo,
            'nombre': emp.get('nombreCompleto', ''),
            'problema': "Sin DNI de jefe en JSON",
            'dni_jefe_esperado': None,
            'codigo_jefe_esperado': None
        })

print(f"\n\nTotal relaciones válidas en JSON: {correctos}")
print(f"Total problemas detectados: {len(errores)}")

if errores:
    print("\n" + "=" * 80)
    print("EMPLEADOS CON PROBLEMAS:")
    print("=" * 80)
    for e in errores:
        print(f"\n{e['empleado']} - {e['nombre']}")
        print(f"  Problema: {e['problema']}")
        if e['dni_jefe_esperado']:
            print(f"  DNI Jefe esperado: {e['dni_jefe_esperado']}")

# Generar SQL de corrección completo
print("\n\n" + "=" * 80)
print("SQL PARA VERIFICAR DISCREPANCIAS EN LA BASE DE DATOS")
print("=" * 80)
print("""
-- Ejecuta esta query en Supabase y compara con el análisis de arriba:
WITH supervisores_esperados AS (
  SELECT 
    e.codigo_empleado,
    e.dni as empleado_dni,
    s.dni as supervisor_dni_actual,
    s.codigo_empleado as supervisor_codigo_actual
  FROM empleados e
  LEFT JOIN empleados s ON e.supervisor_id = s.id
  WHERE e.codigo_empleado != 'AGV0002'
)
SELECT * FROM supervisores_esperados
ORDER BY codigo_empleado;
""")

print("\n\nPara cada empleado, verifica que el 'supervisor_dni_actual' coincida")
print("con el DNI del jefe esperado del análisis de arriba.")
print("\nSi encuentras diferencias, usa este patrón para corregir:")
print("""
UPDATE empleados 
SET supervisor_id = (SELECT id FROM empleados WHERE dni = 'DNI_JEFE_CORRECTO')
WHERE codigo_empleado = 'CODIGO_EMPLEADO';
""")
