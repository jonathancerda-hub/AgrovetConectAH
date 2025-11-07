import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function verificarConstraints() {
  try {
    console.log('🔍 Verificando constraints de solicitudes_vacaciones...\n');
    
    const query = `
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(c.oid) as constraint_definition
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = 'solicitudes_vacaciones'::regclass
      AND conname LIKE '%estado%';
    `;
    
    const result = await pool.query(query);
    
    console.log('📋 Constraints encontradas:');
    console.log('=====================================');
    result.rows.forEach(row => {
      console.log(`\n${row.constraint_name}:`);
      console.log(`  ${row.constraint_definition}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarConstraints();
