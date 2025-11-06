import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function fixPasswords() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Actualizando contraseñas...\n');
    
    const sql = readFileSync(join(__dirname, 'database', 'fix-passwords.sql'), 'utf8');
    await client.query(sql);
    
    console.log('✅ Contraseñas actualizadas correctamente\n');
    
    // Verificar
    const result = await client.query('SELECT email, rol FROM usuarios ORDER BY id');
    console.log('📋 Usuarios actualizados:');
    result.rows.forEach(row => {
      console.log(`   - ${row.email} (${row.rol})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixPasswords();
