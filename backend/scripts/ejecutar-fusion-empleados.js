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

async function ejecutarFusionEmpleados() {
  try {
    console.log('🚀 Iniciando fusión de empleados y usuarios...\n');
    
    const rutaArchivo = path.join(__dirname, '..', 'database', 'migrations', '08_fusion_empleados_usuarios.sql');
    
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
      
      const { data, error } = await supabase.rpc('execute_sql_write', {
        sql: comando
      });

      if (error) {
        // Continuar si ya existe
        if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
          console.error(`  ❌ Error en comando ${i + 1}:`, error.message);
          throw error;
        }
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`  Procesados ${i + 1}/${comandos.length} comandos...`);
      }
    }
    
    console.log('\n✅ Migración ejecutada exitosamente!\n');
    
    // Verificar resultados
    console.log('📊 Resumen de datos insertados:\n');
    
    const verificaciones = [
      { nombre: 'Usuarios', sql: 'SELECT COUNT(*) as total FROM usuarios' },
      { nombre: 'Empleados', sql: 'SELECT COUNT(*) as total FROM empleados' },
      { nombre: 'Áreas', sql: 'SELECT COUNT(*) as total FROM areas' },
      { nombre: 'Puestos', sql: 'SELECT COUNT(*) as total FROM puestos' },
      { nombre: 'Periodos Vacacionales', sql: 'SELECT COUNT(*) as total FROM periodos_vacacionales' }
    ];
    
    for (const ver of verificaciones) {
      const { data } = await supabase.rpc('execute_sql', { sql: ver.sql });
      if (data && data.length > 0) {
        console.log(`   ${ver.nombre}: ${data[0].total}`);
      }
    }
    
    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Email: denis.huaman@agrovetmarket.com');
    console.log('   Password: Agrovet2025!\n');
    
    console.log('👥 Usuarios por rol:');
    const { data: roles } = await supabase.rpc('execute_sql', {
      sql: `SELECT rol, COUNT(*) as cantidad 
            FROM usuarios 
            GROUP BY rol 
            ORDER BY cantidad DESC`
    });
    
    if (roles) {
      for (const rol of roles) {
        console.log(`   ${rol.rol}: ${rol.cantidad}`);
      }
    }
    
    console.log('\n✨ Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error ejecutando migración:', error.message);
    throw error;
  }
}

ejecutarFusionEmpleados().catch(console.error);
