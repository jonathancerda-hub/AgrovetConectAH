import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: { rejectUnauthorized: false }
});

async function crearPeriodos() {
  try {
    console.log('🔄 Creando períodos vacacionales 2025 para todos los empleados...\n');
    
    // Obtener empleados sin período 2025
    const query = `
      SELECT 
        e.id,
        e.nombres,
        e.apellidos,
        e.dias_vacaciones,
        COALESCE(e.dias_vacaciones, 30) as dias_asignar
      FROM empleados e
      LEFT JOIN periodos_vacacionales pv ON e.id = pv.empleado_id AND pv.anio_generacion = 2025
      WHERE pv.id IS NULL
      ORDER BY e.id;
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      console.log('✅ Todos los empleados ya tienen período 2025');
      return;
    }
    
    console.log(`📊 Encontrados ${result.rows.length} empleados sin período\n`);
    
    for (const emp of result.rows) {
      const insertQuery = `
        INSERT INTO periodos_vacacionales (
          empleado_id,
          anio_generacion,
          fecha_generacion,
          dias_totales,
          dias_disponibles,
          estado
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (empleado_id, anio_generacion) DO NOTHING
      `;
      
      await pool.query(insertQuery, [
        emp.id,
        2025,
        new Date(),
        emp.dias_asignar,
        emp.dias_asignar,
        'activo'
      ]);
      
      console.log(`✅ Empleado ${emp.id} (${emp.nombres} ${emp.apellidos}): ${emp.dias_asignar} días`);
    }
    
    console.log('\n🎉 Períodos creados exitosamente!');
    
    // Verificar total
    const countQuery = 'SELECT COUNT(*) FROM periodos_vacacionales WHERE anio_generacion = 2025';
    const countResult = await pool.query(countQuery);
    console.log(`\n📊 Total períodos 2025: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

crearPeriodos();
