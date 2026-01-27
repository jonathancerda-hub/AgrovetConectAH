import { query } from './src/db.js';

async function checkPublicaciones() {
  try {
    console.log('📋 Verificando tabla publicaciones...\n');
    
    // Ver estructura
    const estructura = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'publicaciones'
      ORDER BY ordinal_position
    `);
    
    console.log('Columnas de la tabla publicaciones:');
    console.table(estructura.rows);
    
    // Contar registros
    const count = await query('SELECT COUNT(*) FROM publicaciones');
    console.log(`\n✅ Total de publicaciones: ${count.rows[0].count}`);
    
    // Ver últimas 3 publicaciones
    const ultimas = await query(`
      SELECT id, titulo, tipo, fecha_publicacion
      FROM publicaciones
      ORDER BY fecha_publicacion DESC
      LIMIT 3
    `);
    
    console.log('\n📰 Últimas publicaciones:');
    console.table(ultimas.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

checkPublicaciones();
