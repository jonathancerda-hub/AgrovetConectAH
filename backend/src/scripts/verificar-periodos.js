import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function verificarPeriodos() {
  try {
    console.log('🔍 Verificando períodos vacacionales...\n');
    
    // Ver períodos existentes
    const periodosQuery = `
      SELECT 
        pv.id,
        pv.empleado_id,
        e.nombres,
        e.apellidos,
        pv.anio_generacion,
        pv.dias_totales,
        pv.dias_disponibles,
        pv.estado
      FROM periodos_vacacionales pv
      JOIN empleados e ON pv.empleado_id = e.id
      ORDER BY pv.empleado_id, pv.anio_generacion;
    `;
    
    const result = await pool.query(periodosQuery);
    
    console.log('📋 Períodos existentes:');
    console.log('=====================================');
    if (result.rows.length === 0) {
      console.log('  ❌ No hay períodos registrados');
    } else {
      result.rows.forEach(row => {
        console.log(`  ID: ${row.id} | Empleado: ${row.empleado_id} (${row.nombres} ${row.apellidos})`);
        console.log(`    Año: ${row.anio_generacion} | Disponibles: ${row.dias_disponibles}/${row.dias_totales} | Estado: ${row.estado}`);
      });
    }
    
    // Ver empleados sin período
    console.log('\n📋 Empleados sin período 2025:');
    console.log('=====================================');
    const sinPeriodoQuery = `
      SELECT 
        e.id,
        e.nombres,
        e.apellidos,
        e.dias_vacaciones,
        e.tipo_trabajador_id
      FROM empleados e
      LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id AND pv.anio_generacion = 2025
      WHERE pv.id IS NULL
      ORDER BY e.id
      LIMIT 10;
    `;
    
    const sinPeriodo = await pool.query(sinPeriodoQuery);
    if (sinPeriodo.rows.length === 0) {
      console.log('  ✅ Todos los empleados tienen período 2025');
    } else {
      sinPeriodo.rows.forEach(row => {
        console.log(`  ID: ${row.id} | ${row.nombres} ${row.apellidos} | Días: ${row.dias_vacaciones} | Tipo: ${row.tipo_trabajador_id || 'sin asignar'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarPeriodos();
