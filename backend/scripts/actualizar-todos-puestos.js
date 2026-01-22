const fs = require('fs');
const path = require('path');

// Leer el archivo JSON
const datosPath = path.join(__dirname, '../../datos-procesados.json');
const datos = JSON.parse(fs.readFileSync(datosPath, 'utf-8'));

// Obtener todos los empleados
const empleados = datos.empleados;

console.log(`Total de empleados encontrados: ${empleados.length}`);

// Generar grupos de 50 UPDATE statements
const gruposTamaño = 50;
let contador = 0;

for (let i = 0; i < empleados.length; i += gruposTamaño) {
  contador++;
  const grupo = empleados.slice(i, i + gruposTamaño);
  
  console.log(`\n\n-- GRUPO ${contador} (${i + 1} a ${Math.min(i + gruposTamaño, empleados.length)})`);
  console.log(`-- Aplicar esta migración con nombre: actualizar_puestos_grupo_${contador}\n`);
  
  grupo.forEach(emp => {
    const codigo = emp.Codigo || emp.codigo;
    const cargo = (emp.Cargo || emp.cargo || '').trim();
    
    if (!cargo) {
      console.log(`-- ADVERTENCIA: Empleado ${codigo} sin cargo definido`);
      return;
    }
    
    // Limpiar el cargo de caracteres especiales para SQL
    const cargoLimpio = cargo.replace(/'/g, "''");
    
    console.log(`UPDATE empleados SET puesto_id = (SELECT id FROM puestos WHERE nombre = '${cargoLimpio}') WHERE codigo_empleado = '${codigo}';`);
  });
}

console.log(`\n\n-- Total de grupos generados: ${contador}`);
