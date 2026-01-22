import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el JSON con todos los empleados
const datosPath = path.join(__dirname, '..', '..', 'datos-procesados.json');
const datos = JSON.parse(fs.readFileSync(datosPath, 'utf-8'));

console.log(`Total empleados en JSON: ${datos.empleados.length}`);

// Generar SQLs en lotes de 25 empleados
const BATCH_SIZE = 25;
const empleados = datos.empleados;
const totalBatches = Math.ceil(empleados.length / BATCH_SIZE);

for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
  const start = batchNum * BATCH_SIZE;
  const end = Math.min(start + BATCH_SIZE, empleados.length);
  const batch = empleados.slice(start, end);
  
  console.log(`\n--- LOTE ${batchNum + 1} de ${totalBatches} (empleados ${start + 1} a ${end}) ---\n`);
  
  const values = batch.map(emp => {
    // Parsear nombreCompleto: "Apellidos, Nombres" → apellidos y nombres
    const [apellidos, nombres] = emp.nombreCompleto.split(', ').map(s => s.trim());
    
    // Escapar comillas simples para SQL
    const escapar = (str) => str ? str.replace(/'/g, "''") : '';
    
    return `(
  '${escapar(emp.codigo)}',
  '${escapar(emp.dni)}',
  '${escapar(nombres)}',
  '${escapar(apellidos)}',
  '${escapar(emp.email)}',
  '${emp.fechaIngreso}',
  (SELECT id FROM puestos WHERE nombre = '${escapar(emp.cargo)}' LIMIT 1),
  (SELECT id FROM areas WHERE nombre = '${escapar(emp.centroCosto)}' LIMIT 1),
  ${emp.tipoTrabajadorId},
  false,
  ${emp.rol === 'rrhh' ? 'true' : 'false'},
  true
)`;
  }).join(',\n');
  
  const sql = `-- Lote ${batchNum + 1}: empleados ${start + 1} a ${end}
INSERT INTO empleados (
  codigo_empleado, dni, nombres, apellidos, email, fecha_ingreso,
  puesto_id, area_id, tipo_trabajador_id, es_supervisor, es_rrhh, activo
) VALUES
${values}
ON CONFLICT (dni) DO UPDATE SET
  nombres = EXCLUDED.nombres,
  apellidos = EXCLUDED.apellidos,
  email = EXCLUDED.email,
  puesto_id = EXCLUDED.puesto_id,
  area_id = EXCLUDED.area_id;
`;
  
  console.log(sql);
}

console.log(`\n\nResumen: Se generaron ${totalBatches} lotes para ${empleados.length} empleados`);
