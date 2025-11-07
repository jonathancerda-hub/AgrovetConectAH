import pg from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conexión a la base de datos
const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: {
    rejectUnauthorized: false
  }
});

async function ejecutarMigracion() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Leer el archivo SQL
    const sqlPath = join(__dirname, '..', '..', 'database', 'migrations', '06_fix_vacaciones.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Ejecutando script de migración...');
    console.log('=' .repeat(50));
    
    // Ejecutar el script
    await client.query(sqlScript);
    
    console.log('=' .repeat(50));
    console.log('✅ Migración ejecutada exitosamente!');
    
    // Verificar las tablas creadas
    const verificacion = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('tipos_trabajador', 'periodos_vacacionales', 'feriados')
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tablas creadas:');
    verificacion.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    // Verificar feriados
    const feriados = await client.query('SELECT COUNT(*) as total FROM feriados WHERE anio = 2025');
    console.log(`\n🎉 Feriados 2025: ${feriados.rows[0].total} registros`);
    
    // Verificar períodos
    const periodos = await client.query('SELECT COUNT(*) as total FROM periodos_vacacionales');
    console.log(`📅 Períodos creados: ${periodos.rows[0].total} registro(s)`);
    
    console.log('\n✨ El sistema de vacaciones está listo para usar!');
    
  } catch (error) {
    console.error('❌ Error ejecutando la migración:', error.message);
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

ejecutarMigracion();
