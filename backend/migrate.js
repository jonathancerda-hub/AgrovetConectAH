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

async function runMigrations() {
  try {
    console.log('🔌 Conectando a Supabase...\n');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    const migrationsDir = path.join(__dirname, 'database', 'migrations');
    
    // Lista de migraciones en orden
    const migrations = [
      '01_estructura_base.sql',
      '02_sistema_usuarios.sql',
      '03_gestion_empleados.sql',
      '04_comunicaciones.sql',
      '05_sistema_vacaciones.sql',
      '06_gestion_documentos.sql',
      '07_tablas_adicionales.sql',
      '08_agregar_es_rrhh.sql',
      '09_agregar_columnas_auditoria.sql'
    ];

    for (const migration of migrations) {
      const filePath = path.join(migrationsDir, migration);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Saltando ${migration} (no existe)`);
        continue;
      }

      console.log(`📦 Ejecutando ${migration}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ ${migration} completada\n`);
      } catch (err) {
        console.error(`❌ Error en ${migration}:`, err.message);
        // Continuar con las siguientes migraciones
      }
    }

    console.log('\n🎉 Todas las migraciones ejecutadas!\n');
    console.log('Próximo paso: Ejecutar seeds con: npm run seed\n');

  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
