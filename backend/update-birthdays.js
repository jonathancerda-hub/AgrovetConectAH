import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta',
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateBirthdays() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Actualizar empleados con cumpleaños HOY (7 de noviembre)
    await pool.query(`
      UPDATE empleados 
      SET fecha_nacimiento = '1990-11-07'
      WHERE dni = '12345678'
    `);
    console.log('✓ Actualizado Carlos Director - Cumpleaños HOY');

    await pool.query(`
      UPDATE empleados 
      SET fecha_nacimiento = '1985-11-07'
      WHERE dni = '23456789'
    `);
    console.log('✓ Actualizado Ursula Huamancaja - Cumpleaños HOY');

    await pool.query(`
      UPDATE empleados 
      SET fecha_nacimiento = '1988-11-07'
      WHERE dni = '34567890'
    `);
    console.log('✓ Actualizado Perci Mondragon - Cumpleaños HOY');

    await pool.query(`
      UPDATE empleados 
      SET fecha_nacimiento = '1992-01-08'
      WHERE dni = '45678901'
    `);
    console.log('✓ Actualizado Jonathan Cerda');

    // Verificar cumpleañeros de hoy
    const result = await pool.query(`
      SELECT 
        e.nombres || ' ' || e.apellidos as nombre_completo,
        e.fecha_nacimiento,
        p.nombre as puesto,
        a.nombre as area
      FROM empleados e
      LEFT JOIN puestos p ON e.puesto_id = p.id
      LEFT JOIN areas a ON e.area_id = a.id
      WHERE EXTRACT(MONTH FROM e.fecha_nacimiento) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(DAY FROM e.fecha_nacimiento) = EXTRACT(DAY FROM CURRENT_DATE)
        AND e.estado = 'Activo'
      ORDER BY e.nombres
    `);

    console.log('\n🎂 Cumpleañeros de hoy:');
    result.rows.forEach(row => {
      console.log(`  - ${row.nombre_completo} (${row.puesto} - ${row.area})`);
    });

    await pool.end();
    console.log('\n✅ Script completado exitosamente');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

updateBirthdays();
