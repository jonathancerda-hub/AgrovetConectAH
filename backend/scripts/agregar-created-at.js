import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function ejecutarMigracion() {
  try {
    console.log('🚀 Agregando columnas created_at y updated_at...\n');
    
    const rutaArchivo = path.join(__dirname, '..', 'database', 'migrations', '11_agregar_created_at_simple.sql');
    
    if (!fs.existsSync(rutaArchivo)) {
      console.log(`❌ Archivo no encontrado: ${rutaArchivo}`);
      process.exit(1);
    }
    
    console.log('📄 Leyendo archivo de migración...');
    const sqlCompleto = fs.readFileSync(rutaArchivo, 'utf-8');
    
    // Dividir en comandos individuales (sin BEGIN/COMMIT)
    const comandos = sqlCompleto
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.match(/^(BEGIN|COMMIT|--)/));
    
    console.log(`⚙️  Ejecutando ${comandos.length} comandos...\n`);
    
    // Ejecutar cada comando individualmente
    for (let i = 0; i < comandos.length; i++) {
      const comando = comandos[i];
      if (!comando) continue;
      
      console.log(`  [${i + 1}/${comandos.length}] Ejecutando...`);
      const { data, error } = await supabase.rpc('execute_sql_write', {
        sql: comando
      });

      if (error) {
        console.error(`  ❌ Error en comando ${i + 1}:`, error.message);
        // Continuar si el error es "columna ya existe"
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
      console.log(`  ✅ Completado`);
    }
    
    console.log('\n✅ Migración ejecutada exitosamente!\n');
    
    // Verificar resultados
    console.log('📊 Verificando columnas agregadas:\n');
    
    const verificacionSQL = `
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_name IN ('solicitudes_vacaciones', 'notificaciones')
        AND column_name IN ('created_at', 'updated_at', 'fecha_creacion', 'fecha_actualizacion')
      ORDER BY table_name, column_name
    `;
    
    const { data: columnas, error: errorVerif } = await supabase.rpc('execute_sql', { sql: verificacionSQL });
    
    if (!errorVerif && columnas) {
      console.log('Columnas encontradas:');
      for (const row of columnas) {
        console.log(`   ${row.table_name}.${row.column_name} (${row.data_type})`);
      }
    }
    
    console.log('\n✨ Proceso completado exitosamente!');
    console.log('   Ahora puedes crear solicitudes de vacaciones sin errores.\n');
    
  } catch (error) {
    console.error('\n❌ Error ejecutando migración:', error.message);
    console.error('\nDetalles del error:', error);
    throw error;
  }
}

ejecutarMigracion().catch(console.error);
