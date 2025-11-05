#!/usr/bin/env node

/**
 * Script para ejecutar migraciones de base de datos PostgreSQL
 * Ejecuta todos los archivos SQL en orden
 */

import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de conexión
const connectionString = 'postgresql://agrovet_conecta_user:SRRdobWgeKBcsVvV8j6MeVVQxHN7SYP6@dpg-d45ou2f5r7bs73anpnj0-a.oregon-postgres.render.com/agrovet_conecta';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrationsDir = path.join(__dirname, 'migrations');
const seedsFile = path.join(__dirname, 'seeds.sql');

async function executeSQLFile(filePath, fileName) {
  console.log(`\n📄 Ejecutando: ${fileName}...`);
  try {
    const sql = await fs.readFile(filePath, 'utf8');
    await client.query(sql);
    console.log(`✅ ${fileName} ejecutado correctamente`);
  } catch (error) {
    console.error(`❌ Error en ${fileName}:`, error.message);
    throw error;
  }
}

async function runMigrations() {
  console.log('🚀 Iniciando migraciones de base de datos...\n');
  console.log('📡 Conectando a PostgreSQL en Render...');

  try {
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    // Ejecutar migraciones en orden
    const migrations = [
      '01_estructura_organizacional.sql',
      '02_usuarios_empleados.sql',
      '03_solicitudes_vacaciones.sql',
      '04_publicaciones_social.sql',
      '05_notificaciones_sistema.sql',
      '06_utilidades_auditoria.sql'
    ];

    console.log('📦 Ejecutando migraciones...');
    for (const migration of migrations) {
      const filePath = path.join(migrationsDir, migration);
      await executeSQLFile(filePath, migration);
    }

    // Ejecutar seeds
    console.log('\n🌱 Insertando datos iniciales...');
    await executeSQLFile(seedsFile, 'seeds.sql');

    // Verificar creación
    console.log('\n📊 Verificando base de datos...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`\n✅ Total de tablas creadas: ${result.rows.length}`);
    console.log('📋 Tablas:');
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Contar registros
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as usuarios,
        (SELECT COUNT(*) FROM empleados) as empleados,
        (SELECT COUNT(*) FROM publicaciones) as publicaciones,
        (SELECT COUNT(*) FROM solicitudes_vacaciones) as solicitudes,
        (SELECT COUNT(*) FROM notificaciones) as notificaciones
    `);
    
    console.log('\n📈 Registros insertados:');
    console.log(`   - Usuarios: ${counts.rows[0].usuarios}`);
    console.log(`   - Empleados: ${counts.rows[0].empleados}`);
    console.log(`   - Publicaciones: ${counts.rows[0].publicaciones}`);
    console.log(`   - Solicitudes: ${counts.rows[0].solicitudes}`);
    console.log(`   - Notificaciones: ${counts.rows[0].notificaciones}`);

    console.log('\n🎉 ¡Base de datos lista para usar!');
    console.log('\n👤 Usuarios de prueba:');
    console.log('   admin@agrovet.com - password: admin123 (Administrador)');
    console.log('   ursula.huamancaja@agrovet.com - password: rrhh123 (RRHH)');
    console.log('   perci.mondragon@agrovet.com - password: jefe123 (Jefe TI)');
    console.log('   jonathan.cerda@agrovet.com - password: coord123 (Coordinador)');
    console.log('   ana.garcia@agrovet.com - password: emp123 (Empleado)');

  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar
runMigrations();
