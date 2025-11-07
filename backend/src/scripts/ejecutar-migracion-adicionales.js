import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function ejecutarMigracion() {
  let client;
  try {
    console.log('🔄 Conectando a la base de datos...');
    client = await pool.connect();
    
    console.log('📄 Ejecutando script de migración...');
    console.log('==================================================');
    
    const sqlPath = path.join(__dirname, '..', '..', 'database', 'migrations', '07_tablas_adicionales.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    await client.query(sql);
    
    console.log('==================================================');
    console.log('✅ Migración ejecutada exitosamente!\n');
    
    // Verificar tablas creadas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('aprobaciones_vacaciones', 'historial_saldos')
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);
    
    console.log('📊 Tablas creadas:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    console.log('\n✨ El sistema de vacaciones está completamente configurado!');
    
  } catch (error) {
    console.log('==================================================');
    console.error('❌ Error ejecutando la migración:', error.message);
    console.error(error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

ejecutarMigracion();
