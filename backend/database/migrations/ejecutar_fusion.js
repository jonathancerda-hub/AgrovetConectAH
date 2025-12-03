import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

// Crear pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function ejecutarMigracion() {
  console.log('========================================');
  console.log('🚀 FUSIÓN DE EMPLEADOS Y USUARIOS');
  console.log('========================================\n');

  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '08_fusion_empleados_usuarios.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📡 Conectando a la base de datos...\n');

    // Ejecutar la migración
    console.log('📝 Ejecutando migración...\n');
    await pool.query(sql);

    console.log('✅ Migración completada exitosamente!\n');
    console.log('========================================');
    console.log('DATOS INSERTADOS:');
    console.log('========================================');
    console.log('✓ 21 Usuarios con contraseña: Agrovet2025!');
    console.log('✓ 21 Empleados vinculados a usuarios');
    console.log('✓ 4 Áreas: Finanzas, TI, Admin, RRHH');
    console.log('✓ 19 Puestos de trabajo\n');

    // Verificar
    console.log('📊 Verificando datos...\n');
    const result = await pool.query(`
      SELECT 'Usuarios' as tabla, COUNT(*) as cantidad FROM usuarios
      UNION ALL
      SELECT 'Empleados' as tabla, COUNT(*) as cantidad FROM empleados
      UNION ALL
      SELECT 'Áreas' as tabla, COUNT(*) as cantidad FROM areas
      UNION ALL
      SELECT 'Puestos' as tabla, COUNT(*) as cantidad FROM puestos
    `);

    console.table(result.rows);

    console.log('\n🎉 Todo listo! Puedes iniciar sesión con:');
    console.log('   Email: jonathan.cerda@agrovetmarket.com');
    console.log('   Password: Agrovet2025!');
    console.log('\n   o cualquier otro usuario del archivo JSON\n');

  } catch (error) {
    console.error('\n❌ ERROR al ejecutar la migración:');
    console.error(error.message);
    console.error('\n💡 Revisa el archivo SQL en:');
    console.error('   backend/database/migrations/08_fusion_empleados_usuarios.sql\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

ejecutarMigracion();
