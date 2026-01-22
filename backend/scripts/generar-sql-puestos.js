import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datosPath = path.join(__dirname, '../../datos-procesados.json');
const datos = JSON.parse(fs.readFileSync(datosPath, 'utf8'));

// Mapear áreas a sus IDs (las áreas ya están creadas en orden alfabético)
const areaIds = {
  'ADMINISTRACION': 1,
  'ALMACEN': 2,
  'ALMACEN/ COMPRAS/ PCP/ COMERCIO EXTERIOR': 3,
  'ASEGURAMIENTO DE LA CALIDAD': 4,
  'ASUNTOS REGULATORIOS': 5,
  'AVES Y CERDOS': 6,
  'COMERCIO ELECTRONICO': 7,
  'COMERCIO EXTERIOR': 8,
  'COMPANIA': 9,
  'COMPRAS': 10,
  'CONTABILIDAD Y COSTOS': 11,
  'CONTABILIDAD Y COSTOS/PLANEAMIENTO FINANCIERO/FINANZAS/ADMINISTRACION/SISTEMAS': 12,
  'CONTROL DE CALIDAD': 13,
  'DESARROLLO ANALITICO': 14,
  'ESTABILIDADES Y VALIDACIONES ANALITICAS': 15,
  'FINANZAS': 16,
  'FORMULACION': 17,
  'GERENCIA GENERAL': 18,
  'I&D/FORMULACION/ASUNTOS REGULATORIOS/DESARROLLO ANALITICO/SANIDAD ANIMAL': 19,
  'INTERPET': 20,
  'MARKETING': 21,
  'MARKETING LOCAL': 22,
  'MARKETING LOCAL/MARKETING INTERNACIONAL/COMERCIO ELECTRONICO/MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL': 23,
  'MAYORES': 24,
  'MAYORES/COMPANIA/AVES Y CERDOS/DIGITAL': 25,
  'NUTRICIONAL': 26,
  'PCP': 27,
  'PLANEAMIENTO FINANCIERO': 28,
  'PRODUCCION': 29,
  'PROYECTOS Y PROCESOS Y FARMACEUTICOS': 30,
  'SANIDAD ANIMAL': 31,
  'SEGURIDAD Y MEDIO AMBIENTE': 32,
  'SISTEMAS': 33,
  'TALENTO HUMANO': 34,
  'VENTAS INTERNACIONALES': 35
};

console.log('-- CARGAR PUESTOS');
console.log('INSERT INTO puestos (nombre, area_id, nivel_jerarquico, activo) VALUES');

const puestosSql = [];
datos.puestos.forEach((puesto, idx) => {
  const empleadosConPuesto = datos.empleados.filter(e => e.cargo === puesto);
  let areaId = 1;
  
  if (empleadosConPuesto.length > 0) {
    const areaName = empleadosConPuesto[0].area;
    areaId = areaIds[areaName] || 1;
  }
  
  const puestoEscapado = puesto.replace(/'/g, "''");
  puestosSql.push(`  ('${puestoEscapado}', ${areaId}, 1, true)`);
});

console.log(puestosSql.join(',\n'));
console.log('ON CONFLICT (nombre) DO NOTHING;');
console.log('\n-- Total puestos:', datos.puestos.length);
