import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarDuplicados() {
  try {
    console.log('🔍 Verificando solicitudes duplicadas...\n');
    
    // Buscar empleado Mariano Polo
    const empleadoQuery = `
      SELECT id, nombres, apellidos, dias_vacaciones
      FROM empleados
      WHERE LOWER(nombres || ' ' || apellidos) LIKE '%mariano%polo%'
      LIMIT 1
    `;
    
    const empResult = await pool.query(empleadoQuery);
    
    if (empResult.rows.length === 0) {
      console.log('❌ No se encontró empleado con nombre Mariano Polo');
      return;
    }
    
    const empleado = empResult.rows[0];
    console.log(`✅ Empleado encontrado:`);
    console.log(`   ID: ${empleado.id}`);
    console.log(`   Nombre: ${empleado.nombres} ${empleado.apellidos}`);
    console.log(`   Días disponibles: ${empleado.dias_vacaciones}\n`);
    
    // Buscar todas sus solicitudes
    const solicitudesQuery = `
      SELECT 
        id,
        fecha_inicio,
        fecha_fin,
        dias_solicitados,
        dias_calendario,
        estado,
        created_at
      FROM solicitudes_vacaciones
      WHERE empleado_id = $1
      ORDER BY created_at DESC
    `;
    
    const solResult = await pool.query(solicitudesQuery, [empleado.id]);
    
    console.log(`📋 Solicitudes encontradas: ${solResult.rows.length}\n`);
    
    if (solResult.rows.length === 0) {
      console.log('   No hay solicitudes para este empleado');
      return;
    }
    
    // Mostrar cada solicitud
    solResult.rows.forEach((sol, index) => {
      console.log(`${index + 1}. Solicitud ID: ${sol.id}`);
      console.log(`   Fechas: ${sol.fecha_inicio} al ${sol.fecha_fin}`);
      console.log(`   Días solicitados: ${sol.dias_solicitados}`);
      console.log(`   Días calendario: ${sol.dias_calendario}`);
      console.log(`   Estado: ${sol.estado}`);
      console.log(`   Creada: ${sol.created_at}`);
      console.log('');
    });
    
    // Detectar duplicados
    const fechasMap = new Map();
    const duplicados = [];
    
    solResult.rows.forEach(sol => {
      const key = `${sol.fecha_inicio}_${sol.fecha_fin}`;
      if (fechasMap.has(key)) {
        duplicados.push({
          original: fechasMap.get(key),
          duplicado: sol
        });
      } else {
        fechasMap.set(key, sol);
      }
    });
    
    if (duplicados.length > 0) {
      console.log('⚠️  DUPLICADOS DETECTADOS:\n');
      duplicados.forEach((dup, index) => {
        console.log(`${index + 1}. Solicitudes con las mismas fechas:`);
        console.log(`   Original: ID ${dup.original.id} (creada: ${dup.original.created_at})`);
        console.log(`   Duplicado: ID ${dup.duplicado.id} (creada: ${dup.duplicado.created_at})`);
        console.log(`   Días descontados 2 veces: ${dup.original.dias_calendario}\n`);
      });
      
      // Calcular total descontado de más
      const totalDuplicado = duplicados.reduce((sum, dup) => sum + dup.duplicado.dias_calendario, 0);
      console.log(`💰 Total de días descontados de más: ${totalDuplicado} días`);
      console.log(`   Días actuales: ${empleado.dias_vacaciones}`);
      console.log(`   Días que debería tener: ${empleado.dias_vacaciones + totalDuplicado}\n`);
    } else {
      console.log('✅ No se detectaron solicitudes duplicadas\n');
    }
    
    // Verificar períodos vacacionales
    const periodosQuery = `
      SELECT 
        id,
        anio_generacion,
        dias_totales,
        dias_disponibles,
        dias_usados,
        estado
      FROM periodos_vacacionales
      WHERE empleado_id = $1
      ORDER BY anio_generacion DESC
    `;
    
    const perResult = await pool.query(periodosQuery, [empleado.id]);
    
    console.log(`📊 Períodos vacacionales: ${perResult.rows.length}\n`);
    perResult.rows.forEach((per, index) => {
      console.log(`${index + 1}. Período ${per.anio_generacion}`);
      console.log(`   ID: ${per.id}`);
      console.log(`   Total: ${per.dias_totales} días`);
      console.log(`   Usados: ${per.dias_usados} días`);
      console.log(`   Disponibles: ${per.dias_disponibles} días`);
      console.log(`   Estado: ${per.estado}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

verificarDuplicados();
