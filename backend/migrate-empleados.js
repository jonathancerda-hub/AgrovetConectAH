import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migración de empleados...\n');
    
    // Leer el archivo SQL
    const sqlFile = join(__dirname, 'database', 'migrations', '99_migrate_empleados_data.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Ejecutar la migración
    const result = await client.query(sql);
    
    console.log('✅ Migración completada exitosamente!\n');
    console.log('📊 Resumen de empleados migrados:\n');
    
    // Mostrar resultado
    if (result[result.length - 1]?.rows) {
      const empleados = result[result.length - 1].rows;
      console.log(`Total de empleados: ${empleados.length}\n`);
      
      empleados.forEach(emp => {
        console.log(`ID: ${emp.id} | ${emp.nombre_completo} | ${emp.puesto}`);
        console.log(`   Email: ${emp.email} | Rol: ${emp.rol} | Días: ${emp.dias_vacaciones}`);
        console.log(`   Usuario ID: ${emp.usuario_id} | RRHH: ${emp.es_rrhh ? 'Sí' : 'No'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    console.error('Detalles:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar
runMigration()
  .then(() => {
    console.log('✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
