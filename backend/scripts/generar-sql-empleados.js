import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datosPath = path.join(__dirname, '../../datos-procesados.json');
const datos = JSON.parse(fs.readFileSync(datosPath, 'utf8'));

// Mapear áreas a sus IDs
const areaIds = {
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
};

console.log('-- PASO 1: Obtener IDs de puestos');
console.log('DO $$');
console.log('DECLARE');
console.log('  puesto_record RECORD;');
console.log('BEGIN');
console.log('  -- Crear tabla temporal para mapeo de puestos');
console.log('  CREATE TEMP TABLE IF NOT EXISTS temp_puestos_map (nombre TEXT, puesto_id INT);');
console.log('  FOR puesto_record IN SELECT id, nombre FROM puestos LOOP');
console.log('    INSERT INTO temp_puestos_map VALUES (puesto_record.nombre, puesto_record.id);');
console.log('  END LOOP;');
console.log('END $$;');
console.log('');

// Generar mapeo DNI -> Empleado para segundo paso
const dniMap = {};
datos.empleados.forEach((emp, idx) => {
  dniMap[emp.dni] = idx + 1; // IDs empezarán en 1
});

console.log('-- PASO 2: Insertar empleados (sin supervisores)');
const empleadosSql = [];
const emailsUsados = new Set();

datos.empleados.forEach((emp, idx) => {
  const areaId = areaIds[emp.area] || 1;
  
  // Parsear nombre completo
  const partes = emp.nombreCompleto.split(',');
  const apellidos = partes[0].trim().replace(/'/g, "''");
  const nombres = (partes[1] || '').trim().replace(/'/g, "''");
  
  // Email único
  let email = emp.email;
  let contador = 1;
  while (emailsUsados.has(email)) {
    email = emp.email.replace('@', `${contador}@`);
    contador++;
  }
  emailsUsados.add(email);
  
  const esSupervisor = emp.rol === 'supervisor' || emp.rol === 'admin' ? 'true' : 'false';
  const esRrhh = emp.rol === 'rrhh' ? 'true' : 'false';
  
  empleadosSql.push(
    `  ('${emp.codigo}', '${emp.dni}', '${nombres}', '${apellidos}', '${email}', ` +
    `'${emp.fechaIngreso}', (SELECT puesto_id FROM temp_puestos_map WHERE nombre = '${emp.cargo.replace(/'/g, "''")}'), ` +
    `${areaId}, ${emp.tipoTrabajadorId || 1}, ${esSupervisor}, ${esRrhh}, true)`
  );
});

console.log('INSERT INTO empleados (codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso, puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo)');
console.log('VALUES');
console.log(empleadosSql.join(',\n'));
console.log('ON CONFLICT (dni) DO NOTHING;');
console.log('');

console.log('-- PASO 3: Actualizar supervisores');
console.log('DO $$');
console.log('DECLARE');
console.log('  emp_record RECORD;');
console.log('  supervisor_id_var INT;');
console.log('BEGIN');
datos.empleados.forEach(emp => {
  if (emp.dniJefe) {
    console.log(`  SELECT id INTO supervisor_id_var FROM empleados WHERE dni = '${emp.dniJefe}';`);
    console.log(`  IF supervisor_id_var IS NOT NULL THEN`);
    console.log(`    UPDATE empleados SET supervisor_id = supervisor_id_var WHERE dni = '${emp.dni}';`);
    console.log(`  END IF;`);
  }
});
console.log('END $$;');
console.log('');

console.log('-- PASO 4: Crear usuarios');
console.log("-- Password hash para 'Agrovet2026!': $2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m");
const passwordHash = '$2b$10$rI7jN5rGZxKvPqF.yH1vIeGqE9KJ.XqGZQ7aRf3qKLJ8Z9pL3Ld5m';

const usuariosSql = [];
Array.from(emailsUsados).forEach((email, idx) => {
  const empData = datos.empleados.find(e => email.includes(e.email.split('@')[0]));
  if (empData) {
    usuariosSql.push(
      `  ((SELECT id FROM empleados WHERE dni = '${empData.dni}'), '${email}', '${passwordHash}', '${empData.rol}', true)`
    );
  }
});

console.log('INSERT INTO usuarios (empleado_id, email, password, rol, activo)');
console.log('VALUES');
console.log(usuariosSql.join(',\n'));
console.log('ON CONFLICT (email) DO NOTHING;');
console.log('');

console.log('-- PASO 5: Crear periodos vacacionales 2026');
console.log("INSERT INTO periodos_vacacionales (empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo, dias_totales, dias_disponibles, dias_usados, viernes_usados, tiene_bloque_7dias, estado)");
console.log("SELECT id, 2026, '2026-01-01'::date, '2026-12-31'::date, 30, 30, 0, 0, false, 'activo'");
console.log("FROM empleados;");

console.log('\n-- Total empleados a cargar:', datos.empleados.length);
