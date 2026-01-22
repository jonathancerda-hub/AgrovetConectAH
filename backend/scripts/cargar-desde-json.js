import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer datos procesados
const datosPath = path.join(__dirname, '../../datos-procesados.json');
const datos = JSON.parse(fs.readFileSync(datosPath, 'utf8'));

// Generar SQL para crear áreas (ya se hizo manualmente)
console.log(`-- Ya se crearon ${datos.areas.length} áreas\n`);

// Generar SQL para puestos
console.log('-- CREAR PUESTOS');
const areaMap = {};
datos.areas.forEach((area, i) => {
  areaMap[area] = i + 1; // IDs de áreas del 1 al 38
});

const puestosSql = [];
datos.puestos.forEach(puesto => {
  // Buscar área del puesto desde empleados
  const empleadosConPuesto = datos.empleados.filter(e => e.cargo === puesto);
  let areaId = 1; // Default Administración
  
  if (empleadosConPuesto.length > 0) {
    const areaName = empleadosConPuesto[0].area;
    areaId = areaMap[areaName] || 1;
  }
  
  puestosSql.push(`('${puesto.replace(/'/g, "''")}', ${areaId}, 1, true)`);
});

console.log(`INSERT INTO puestos (nombre, area_id, nivel_jerarquico, activo) VALUES`);
console.log(puestosSql.join(',\n') + ';');

console.log(`\n\n-- RESUMEN:`);
console.log(`-- Áreas: ${datos.areas.length}`);
console.log(`-- Puestos: ${datos.puestos.length}`);
console.log(`-- Empleados: ${datos.empleados.length}`);
