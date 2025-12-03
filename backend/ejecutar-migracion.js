import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function ejecutarMigracion() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando migración de empleados...\n');
    
    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, 'database', 'migrations', '10_importar_empleados_completos.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar la migración
    await client.query('BEGIN');
    await client.query(sqlContent);
    
    // Verificar resultados
    const result = await client.query(`
      SELECT 
        'Migración completada' as mensaje,
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM empleados) as total_empleados,
        (SELECT COUNT(*) FROM puestos) as total_puestos,
        (SELECT COUNT(*) FROM areas) as total_areas
    `);
    
    await client.query('COMMIT');
    
    console.log('\n✅ Migración completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log('─'.repeat(50));
    console.log(`   Total Usuarios:  ${result.rows[0].total_usuarios}`);
    console.log(`   Total Empleados: ${result.rows[0].total_empleados}`);
    console.log(`   Total Puestos:   ${result.rows[0].total_puestos}`);
    console.log(`   Total Áreas:     ${result.rows[0].total_areas}`);
    console.log('─'.repeat(50));
    
    // Mostrar algunos empleados de ejemplo
    const empleados = await client.query(`
      SELECT e.dni, e.nombres, e.apellidos, p.nombre as puesto, a.nombre as area, u.rol
      FROM empleados e
      LEFT JOIN puestos p ON e.puesto_id = p.id
      LEFT JOIN areas a ON e.area_id = a.id
      LEFT JOIN usuarios u ON e.usuario_id = u.id
      WHERE e.estado = 'Activo'
      ORDER BY e.id
      LIMIT 5
    `);
    
    console.log('\n👥 Primeros 5 empleados:');
    console.log('─'.repeat(50));
    empleados.rows.forEach(emp => {
      console.log(`   ${emp.nombres} ${emp.apellidos}`);
      console.log(`   DNI: ${emp.dni} | Puesto: ${emp.puesto}`);
      console.log(`   Área: ${emp.area} | Rol: ${emp.rol}`);
      console.log('   ' + '─'.repeat(46));
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar la migración
ejecutarMigracion()
  .then(() => {
    console.log('\n🎉 Proceso completado!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
