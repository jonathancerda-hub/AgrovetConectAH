import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new pg.Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log('\n🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');
    
    // Leer datos procesados
    console.log('📖 Leyendo datos procesados...');
    const datosPath = path.join(__dirname, '../../datos-procesados.json');
    const datos = JSON.parse(fs.readFileSync(datosPath, 'utf8'));
    console.log(`   - ${datos.empleados.length} empleados`);
    console.log(`   - ${datos.puestos.length} puestos`);
    console.log(`   - ${datos.areas.length} áreas\n`);
    
    // PASO 1: Crear áreas
    console.log('🏢 Creando áreas...');
    const areasMap = new Map();
    for (const area of datos.areas) {
      const result = await client.query(
        'INSERT INTO areas (nombre, activo) VALUES ($1, $2) RETURNING id',
        [area, true]
      );
      areasMap.set(area, result.rows[0].id);
    }
    console.log(`✅ ${datos.areas.length} áreas creadas\n`);
    
    // PASO 2: Crear puestos únicos
    console.log('🏢 Creando puestos de trabajo...');
    const puestosMap = new Map();
    
    for (const puesto of datos.puestos) {
      // Determinar área del puesto basado en los empleados
      const empleadosConPuesto = datos.empleados.filter(e => e.cargo === puesto);
      let areaId = areasMap.get('Administración'); // Default
      
      if (empleadosConPuesto.length > 0) {
        const areaName = empleadosConPuesto[0].area;
        areaId = areasMap.get(areaName) || areaId;
      }
      
      const result = await client.query(
        'INSERT INTO puestos (nombre, area_id, nivel_jerarquico, activo) VALUES ($1, $2, $3, $4) RETURNING id',
        [puesto, areaId, 1, true]
      );
      puestosMap.set(puesto, result.rows[0].id);
    }
    console.log(`✅ ${datos.puestos.length} puestos creados\n`);
    
    // PASO 3: Crear empleados (primera pasada - sin supervisores)
    console.log('👥 Creando empleados (paso 1/2)...');
    const empleadosMap = new Map();
    const emailsUsados = new Set();
    
    for (const emp of datos.empleados) {
      const puestoId = puestosMap.get(emp.cargo);
      const areaId = areasMap.get(emp.area);
      const tipoTrabajadorId = emp.tipoTrabajadorId || 1;
      
      // Generar código de empleado
      const codigoEmpleado = emp.codigo || `EMP-${emp.dni}`;
      
      // Parsear nombre completo "Apellidos, Nombres"
      let nombres = '';
      let apellidos = '';
      
      if (emp.nombreCompleto.includes(',')) {
        const partes = emp.nombreCompleto.split(',');
        apellidos = partes[0].trim();
        nombres = partes[1].trim();
      } else {
        const partes = emp.nombreCompleto.split(' ');
        nombres = partes.slice(0, Math.ceil(partes.length / 2)).join(' ');
        apellidos = partes.slice(Math.ceil(partes.length / 2)).join(' ');
      }
      
      // Generar email único
      let email = emp.email;
      let contador = 1;
      while (emailsUsados.has(email)) {
        // Si el email ya existe, agregar número
        const partes = emp.email.split('@');
        email = `${partes[0]}${contador}@${partes[1]}`;
        contador++;
      }
      emailsUsados.add(email);
      
      // Determinar es_supervisor y es_rrhh
      const esSupervisor = ['admin', 'supervisor'].includes(emp.rol);
      const esRrhh = emp.rol === 'rrhh';
      
      // Parsear fecha de ingreso (formato MM/DD/YYYY o DD/MM/YYYY)
      let fechaIngreso = '2020-01-01'; // Default
      if (emp.fechaIngreso) {
        try {
          const partes = emp.fechaIngreso.split('/');
          if (partes.length === 3) {
            const mes = parseInt(partes[0]);
            const dia = parseInt(partes[1]);
            const anio = parseInt(partes[2]);
            fechaIngreso = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
          }
        } catch (e) {
          // Mantener default
        }
      }
      
      try {
        const result = await client.query(`
          INSERT INTO empleados (
            codigo_empleado, dni, nombres, apellidos, email, 
            fecha_ingreso, puesto_id, area_id, tipo_trabajador_id,
            es_supervisor, es_rrhh, activo
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id
        `, [
          codigoEmpleado, emp.dni, nombres, apellidos, email,
          fechaIngreso, puestoId, areaId, tipoTrabajadorId,
          esSupervisor, esRrhh, true
        ]);
        
        empleadosMap.set(emp.dni, {
          id: result.rows[0].id,
          dniJefe: emp.dniJefe,
          rol: emp.rol,
          email: email
        });
      } catch (error) {
        console.error(`   ⚠️  Error con empleado ${nombres} ${apellidos} (DNI: ${emp.dni}):`, error.message);
      }
    }
    console.log(`✅ ${datos.empleados.length} empleados creados\n`);
    
    // PASO 3: Actualizar supervisores
    console.log('👔 Asignando supervisores...');
    let supervisoresAsignados = 0;
    
    for (const [dni, empleado] of empleadosMap) {
      if (empleado.dniJefe) {
        const jefe = empleadosMap.get(empleado.dniJefe);
        if (jefe) {
          await client.query(
            'UPDATE empleados SET supervisor_id = $1 WHERE id = $2',
            [jefe.id, empleado.id]
          );
          supervisoresAsignados++;
        }
      }
    }
    console.log(`✅ ${supervisoresAsignados} supervisores asignados\n`);
    
    // PASO 4: Crear usuarios
    console.log('🔐 Creando usuarios con acceso...');
    const passwordDefault = await bcrypt.hash('Agrovet2026!', 10);
    
    for (const [dni, empleado] of empleadosMap) {
      await client.query(`
        INSERT INTO usuarios (empleado_id, email, password, rol, activo)
        VALUES ($1, $2, $3, $4, $5)
      `, [empleado.id, empleado.email, passwordDefault, empleado.rol, true]);
    }
    console.log(`✅ ${empleadosMap.size} usuarios creados\n`);
    
    // PASO 5: Crear periodos vacacionales
    console.log('📅 Creando periodos vacacionales...');
    const tiposResult = await client.query('SELECT id, dias_vacaciones_anuales FROM tipos_trabajador');
    const diasPorTipo = {};
    tiposResult.rows.forEach(row => {
      diasPorTipo[row.id] = row.dias_vacaciones_anuales;
    });
    
    for (const [dni, empleado] of empleadosMap) {
      const empData = datos.empleados.find(e => e.dni === dni);
      const empDbData = await client.query('SELECT tipo_trabajador_id FROM empleados WHERE id = $1', [empleado.id]);
      const tipoId = empDbData.rows[0].tipo_trabajador_id;
      const diasTotales = diasPorTipo[tipoId] || 30;
      
      await client.query(`
        INSERT INTO periodos_vacacionales (
          empleado_id, anio_generacion, fecha_inicio_periodo, fecha_fin_periodo,
          dias_totales, dias_disponibles, dias_usados, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        empleado.id, 2026, '2026-01-01', '2026-12-31',
        diasTotales, diasTotales, 0, 'activo'
      ]);
    }
    console.log(`✅ ${empleadosMap.size} periodos vacacionales creados\n`);
    
    // Resumen final
    console.log('📊 RESUMEN FINAL:');
    console.log('==================');
    
    const resumenEmpleados = await client.query('SELECT COUNT(*) as total FROM empleados');
    const resumenUsuarios = await client.query('SELECT COUNT(*) as total FROM usuarios');
    const resumenPuestos = await client.query('SELECT COUNT(*) as total FROM puestos');
    const resumenPeriodos = await client.query('SELECT COUNT(*) as total FROM periodos_vacacionales');
    
    console.log(`✅ Empleados: ${resumenEmpleados.rows[0].total}`);
    console.log(`✅ Usuarios: ${resumenUsuarios.rows[0].total}`);
    console.log(`✅ Puestos: ${resumenPuestos.rows[0].total}`);
    console.log(`✅ Periodos: ${resumenPeriodos.rows[0].total}`);
    
    const rolesCuenta = await client.query(`
      SELECT rol, COUNT(*) as cantidad 
      FROM usuarios 
      GROUP BY rol 
      ORDER BY cantidad DESC
    `);
    
    console.log('\n📋 Distribución de roles:');
    rolesCuenta.rows.forEach(row => {
      console.log(`   - ${row.rol}: ${row.cantidad} usuarios`);
    });
    
    console.log('\n🎉 CARGA COMPLETA EXITOSA!\n');
    console.log('📝 Credenciales de acceso:');
    console.log('   Email: [nombre].[apellido]@agrovetmarket.com');
    console.log('   Password: Agrovet2026!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
