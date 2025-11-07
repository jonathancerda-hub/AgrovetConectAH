import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function verificarTablas() {
  try {
    console.log('🔍 Verificando tablas del sistema de vacaciones...\n');
    
    const tablas = [
      'tipos_trabajador',
      'periodos_vacacionales',
      'feriados',
      'solicitudes_vacaciones',
      'aprobaciones_vacaciones',
      'historial_saldos'
    ];
    
    for (const tabla of tablas) {
      const query = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `;
      
      const result = await pool.query(query, [tabla]);
      const existe = result.rows[0].exists;
      
      if (existe) {
        // Contar registros
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${tabla}`);
        const count = countResult.rows[0].count;
        console.log(`✅ ${tabla.padEnd(30)} ${count} registro(s)`);
      } else {
        console.log(`❌ ${tabla.padEnd(30)} NO EXISTE`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarTablas();
