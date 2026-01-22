import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datosPath = path.join(__dirname, '../../datos-procesados.json');
const datos = JSON.parse(fs.readFileSync(datosPath, 'utf8'));

console.log('-- PASO 1: CARGAR EMPLEADOS (sin supervisor_id)');
console.log('-- Total empleados:', datos.empleados.length);
console.log('-- Generando SQL...\n');

// Primero generar archivo JSON con mappings para usar en Node.js
const mappingData = {
  empleados: datos.empleados.map(emp => ({
    dni: emp.dni,
    codigo: emp.codigo,
    nombreCompleto: emp.nombreCompleto,
    fechaIngreso: emp.fechaIngreso,
    cargo: emp.cargo,
    area: emp.area,
    rol: emp.rol,
    email: emp.email,
    dniJefe: emp.dniJefe,
    tipoTrabajadorId: emp.tipoTrabajadorId || 1
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'empleados-mapping.json'),
  JSON.stringify(mappingData, null, 2),
  'utf8'
);

console.log('✅ Archivo empleados-mapping.json creado con', datos.empleados.length, 'empleados');
console.log('\n📝 Para cargar los empleados, ejecuta el script Node.js especial');
console.log('   que insertará los registros uno por uno usando el mapping.');
