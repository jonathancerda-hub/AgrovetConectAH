import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function ejecutarMigracion() {
  try {
    console.log('🚀 Agregando columnas created_at y updated_at...\n');
    
    const comandos = [
      // Agregar columnas a solicitudes_vacaciones
      {
        sql: "ALTER TABLE solicitudes_vacaciones ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
        desc: "Agregar created_at a solicitudes_vacaciones"
      },
      {
        sql: "ALTER TABLE solicitudes_vacaciones ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
        desc: "Agregar updated_at a solicitudes_vacaciones"
      },
      // Copiar datos existentes
      {
        sql: "UPDATE solicitudes_vacaciones SET created_at = fecha_creacion WHERE created_at IS NULL",
        desc: "Copiar fecha_creacion a created_at"
      },
      {
        sql: "UPDATE solicitudes_vacaciones SET updated_at = COALESCE(fecha_actualizacion, fecha_creacion) WHERE updated_at IS NULL",
        desc: "Copiar fecha_actualizacion a updated_at"
      }
    ];
    
    console.log(`⚙️  Ejecutando ${comandos.length} comandos...\n`);
    
    for (let i = 0; i < comandos.length; i++) {
      const { sql, desc } = comandos[i];
      console.log(`  [${i + 1}/${comandos.length}] ${desc}...`);
      
      const { data, error } = await supabase.rpc('execute_sql_write', { sql });

      if (error) {
        // Continuar si la columna ya existe
        if (error.message && error.message.includes('already exists')) {
          console.log(`  ⚠️  Ya existe (omitiendo)`);
          continue;
        }
        console.error(`  ❌ Error:`, error.message);
        throw error;
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
        AND column_name IN ('created_at', 'updated_at')
      ORDER BY table_name, column_name
    `;
    
    const { data: columnas, error: errorVerif } = await supabase.rpc('execute_sql', { sql: verificacionSQL });
    
    if (!errorVerif && columnas) {
      console.log('✅ Columnas encontradas:');
      for (const row of columnas) {
        console.log(`   ${row.table_name}.${row.column_name} (${row.data_type})`);
      }
    }
    
    console.log('\n✨ Proceso completado exitosamente!');
    console.log('   Ahora puedes crear solicitudes de vacaciones sin errores.\n');
    
  } catch (error) {
    console.error('\n❌ Error ejecutando migración:', error.message);
    throw error;
  }
}

ejecutarMigracion().catch(console.error);
