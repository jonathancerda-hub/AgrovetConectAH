import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function ejecutarMigraciones() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando ejecución de migraciones...\n');
    
    // Migraciones en orden
    const migraciones = [
      '05_sistema_vacaciones.sql',
      '06_fix_vacaciones.sql',
      '07_tablas_adicionales.sql'
    ];
    
    for (const archivo of migraciones) {
      console.log(`📄 Ejecutando: ${archivo}`);
      
      const rutaArchivo = path.join(__dirname, '..', 'database', 'migrations', archivo);
      
      if (!fs.existsSync(rutaArchivo)) {
        console.log(`   ⚠️  Archivo no encontrado: ${rutaArchivo}`);
        continue;
      }
      
      const sql = fs.readFileSync(rutaArchivo, 'utf-8');
      
      try {
        await client.query(sql);
        console.log(`   ✅ Ejecutado exitosamente\n`);
      } catch (error) {
        // Si el error es que la tabla ya existe, continuamos
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Ya existe (omitiendo): ${error.message.split('\n')[0]}\n`);
        } else {
          console.error(`   ❌ Error: ${error.message}\n`);
          throw error;
        }
      }
    }
    
    // Verificar que las tablas existen
    console.log('🔍 Verificando tablas creadas...\n');
    
    const tablasRequeridas = [
      'periodos_vacacionales',
      'solicitudes_vacaciones',
      'feriados',
      'tipos_trabajador'
    ];
    
    for (const tabla of tablasRequeridas) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        ) as exists
      `, [tabla]);
      
      if (result.rows[0].exists) {
        console.log(`   ✅ ${tabla}`);
      } else {
        console.log(`   ❌ ${tabla} - NO EXISTE`);
      }
    }
    
    console.log('\n✅ Migraciones completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

ejecutarMigraciones().catch(console.error);
