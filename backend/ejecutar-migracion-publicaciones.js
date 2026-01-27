import { query } from './src/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ejecutarMigracion() {
  try {
    console.log('📦 Ejecutando migración de publicaciones...\n');
    
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, '../database/migrations/04_publicaciones_social.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Ejecutar el SQL
    await query(sqlContent);
    
    console.log('✅ Tablas de publicaciones creadas exitosamente!\n');
    
    // Verificar
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('publicaciones', 'comentarios_publicaciones', 'reacciones_publicaciones')
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas creadas:');
    result.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
    
  } catch (error) {
    console.error('❌ Error al ejecutar migración:', error.message);
    console.error('Detalles:', error);
  } finally {
    process.exit();
  }
}

ejecutarMigracion();
