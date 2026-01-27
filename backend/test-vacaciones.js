import { query as dbQuery } from './src/db.js';

async function testVacaciones() {
  try {
    // Buscar empleado Juana Lovaton
    const empleado = await dbQuery(
      `SELECT id, nombres, apellidos FROM empleados WHERE nombres ILIKE '%Juana%' AND apellidos ILIKE '%Lovaton%'`
    );
    
    if (empleado.rows.length === 0) {
      console.log('❌ No se encontró empleado Juana Lovaton');
      return;
    }
    
    const empleadoId = empleado.rows[0].id;
    console.log('👤 Empleado:', empleado.rows[0]);
    console.log('📋 ID:', empleadoId);
    
    // Verificar periodo vacacional
    const periodo = await dbQuery(
      `SELECT * FROM periodos_vacacionales WHERE empleado_id = $1 AND estado = 'activo'`,
      [empleadoId]
    );
    console.log('\n📅 Períodos vacacionales:', periodo.rows);
    
    // Verificar solicitudes
    const solicitudes = await dbQuery(
      `SELECT id, fecha_inicio, fecha_fin, dias_solicitados, estado, comentarios 
       FROM solicitudes_vacaciones 
       WHERE empleado_id = $1
       ORDER BY fecha_inicio`,
      [empleadoId]
    );
    console.log('\n📝 Solicitudes de vacaciones:', solicitudes.rows);
    
    // Verificar solicitudes aprobadas futuras
    const futuras = await dbQuery(
      `SELECT id, fecha_inicio, fecha_fin, dias_solicitados, estado
       FROM solicitudes_vacaciones
       WHERE empleado_id = $1
       AND estado IN ('aprobada', 'Aprobado', 'pendiente', 'Pendiente')
       AND fecha_inicio >= CURRENT_DATE`,
      [empleadoId]
    );
    console.log('\n🔮 Solicitudes futuras/programadas:', futuras.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testVacaciones();
