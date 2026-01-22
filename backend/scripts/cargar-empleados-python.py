import json
import psycopg2
from psycopg2.extras import execute_values
import bcrypt

# Conexión a Supabase
conn = psycopg2.connect(
    host="aws-0-sa-east-1.pooler.supabase.com",
    port=6543,
    database="postgres",
    user="postgres.uakdewhjlgbxpyjllhqg",
    password="Agrovet2025-"
)
cur = conn.cursor()

print("🔌 Conectado a Supabase")

# Cargar datos
with open('../../datos-procesados.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

# Obtener mapeo de áreas
cur.execute("SELECT id, nombre FROM areas")
areas_map = {nombre: id for id, nombre in cur.fetchall()}
print(f"✅ {len(areas_map)} áreas cargadas")

# Obtener mapeo de puestos
cur.execute("SELECT id, nombre FROM puestos")
puestos_map = {nombre: id for id, nombre in cur.fetchall()}
print(f"✅ {len(puestos_map)} puestos cargados")

# Insertar empleados
print(f"\n👥 Insertando {len(datos['empleados'])} empleados...")
emails_usados = set()
empleados_data = []
dni_to_dniJefe = {}

for emp in datos['empleados']:
    # Parsear nombre
    partes = emp['nombreCompleto'].split(',')
    apellidos = partes[0].strip()
    nombres = partes[1].strip() if len(partes) > 1 else ''
    
    # Email único
    email = emp['email']
    contador = 1
    while email in emails_usados:
        email = emp['email'].replace('@', f'{contador}@')
        contador += 1
    emails_usados.add(email)
    
    # Guardar relación DNI->DNI Jefe para después
    if emp.get('dniJefe'):
        dni_to_dniJefe[emp['dni']] = emp['dniJefe']
    
    empleados_data.append((
        emp['codigo'],
        emp['dni'],
        nombres,
        apellidos,
        email,
        emp['fechaIngreso'],
        puestos_map.get(emp['cargo']),
        areas_map.get(emp['area'], 1),
        emp.get('tipoTrabajadorId', 1),
        emp['rol'] in ['supervisor', 'admin'],
        emp['rol'] == 'rrhh',
        True
    ))

# Insertar en batch
cur.execute("BEGIN")
execute_values(
    cur,
    """INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, 
       puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)
       VALUES %s ON CONFLICT (dni) DO NOTHING""",
    empleados_data
)
conn.commit()
print(f"✅ {len(empleados_data)} empleados insertados")

# Obtener mapeo DNI->ID
cur.execute("SELECT id, dni FROM empleados")
dni_to_id = {dni: id for id, dni in cur.fetchall()}

# Actualizar supervisores
print("\n👔 Asignando supervisores...")
supervisores_asignados = 0
for dni, dni_jefe in dni_to_dniJefe.items():
    if dni in dni_to_id and dni_jefe in dni_to_id:
        cur.execute(
            "UPDATE empleados SET supervisor_id = %s WHERE id = %s",
            (dni_to_id[dni_jefe], dni_to_id[dni])
        )
        supervisores_asignados += 1
conn.commit()
print(f"✅ {supervisores_asignados} supervisores asignados")

# Crear usuarios
print("\n🔐 Creando usuarios...")
password_hash = bcrypt.hashpw('Agrovet2026!'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
usuarios_data = []

for emp in datos['empleados']:
    if emp['dni'] in dni_to_id:
        email = [e for e in emails_usados if emp['email'].split('@')[0] in e][0]
        usuarios_data.append((
            dni_to_id[emp['dni']],
            email,
            password_hash,
            emp['rol'],
            True
        ))

execute_values(
    cur,
    """INSERT INTO usuarios (empleado_id, email, password, rol, activo)
       VALUES %s ON CONFLICT (email) DO NOTHING""",
    usuarios_data
)
conn.commit()
print(f"✅ {len(usuarios_data)} usuarios creados")

# Crear periodos vacacionales
print("\n📅 Creando periodos vacacionales...")
cur.execute("""
    INSERT INTO periodos_vacacionales 
    (empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo, 
     dias_totales, dias_disponibles, dias_usados, viernes_usados, tiene_bloque_7dias, estado)
    SELECT id, 2026, '2026-01-01'::date, '2026-12-31'::date, 30, 30, 0, 0, false, 'activo'
    FROM empleados
""")
conn.commit()
print(f"✅ {cur.rowcount} periodos creados")

print("\n📊 RESUMEN:")
print(f"✅ Empleados: {len(empleados_data)}")
print(f"✅ Supervisores: {supervisores_asignados}")
print(f"✅ Usuarios: {len(usuarios_data)}")
print(f"✅ Periodos: {cur.rowcount}")

cur.close()
conn.close()
print("\n🎉 CARGA COMPLETA!")
