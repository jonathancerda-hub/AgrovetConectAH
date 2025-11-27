import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const client = new pg.Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function runSeeds() {
  try {
    console.log('🔌 Conectando a Supabase...\n');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    const seedsPath = path.join(__dirname, 'database', 'seeds.sql');
    
    if (!fs.existsSync(seedsPath)) {
      console.error('❌ Archivo seeds.sql no encontrado');
      process.exit(1);
    }

    console.log('🌱 Ejecutando seeds.sql...');
    const sql = fs.readFileSync(seedsPath, 'utf8');
    
    await client.query(sql);
    console.log('✅ Seeds ejecutados exitosamente\n');
    
    // Verificar datos insertados
    const result = await client.query('SELECT COUNT(*) as total FROM usuarios');
    console.log(`✓ ${result.rows[0].total} usuarios creados`);
    
    const empleados = await client.query('SELECT COUNT(*) as total FROM empleados');
    console.log(`✓ ${empleados.rows[0].total} empleados creados`);
    
    console.log('\n🎉 Base de datos lista para usar!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeeds();
