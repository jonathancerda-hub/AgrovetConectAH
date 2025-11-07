import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function verificarEmpleados() {
  try {
    console.log('🔍 Verificando estructura de la tabla empleados...\n');
    
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'empleados'
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query);
    
    console.log('📋 Columnas de la tabla empleados:');
    console.log('=====================================');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name.padEnd(30)} ${row.data_type.padEnd(20)} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Ver un registro de ejemplo
    console.log('\n📄 Ejemplo de registro:');
    const ejemploQuery = 'SELECT * FROM empleados LIMIT 1';
    const ejemploResult = await pool.query(ejemploQuery);
    if (ejemploResult.rows.length > 0) {
      console.log(JSON.stringify(ejemploResult.rows[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarEmpleados();
