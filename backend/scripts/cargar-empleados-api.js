import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://uakdewhjlgbxpyjllhqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2Rld2hqbGdieHB5amxsaHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjk5NDQsImV4cCI6MjA3OTc0NTk0NH0.D7OIEJ5xltJk2eefh0wBbEU-V2D2K_Wy8SSoWgK54vM';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2Rld2hqbGdieHB5amxsaHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE2OTk0NCwiZXhwIjoyMDc5NzQ1OTQ0fQ.j7j1_lrwX4gPwGPQwqHYBLUUMCADGw3Y9BaLqCkG9Jc';

async function main() {
  console.log('🔌 Cargando empleados via API REST de Supabase...\n');
  
  const mappingPath = path.join(__dirname, 'empleados-mapping.json');
  const { empleados } = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  
  // Obtener puestos
  console.log('📖 Obteniendo puestos...');
  const puestosRes = await fetch(`${SUPABASE_URL}/rest/v1/puestos?select=id,nombre`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const puestos = await puestosRes.json();
  const puestosMap = new Map(puestos.map(p => [p.nombre, p.id]));
  console.log(`✅ ${puestos.length} puestos cargados\n`);
  
  // Obtener áreas
  console.log('📖 Obteniendo áreas...');
  const areasRes = await fetch(`${SUPABASE_URL}/rest/v1/areas?select=id,nombre`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const areas = await areasRes.json();
  const areasMap = new Map(areas.map(a => [a.nombre, a.id]));
  console.log(`✅ ${areas.length} áreas cargadas\n`);
  
  // Paso 1: Insertar empleados sin supervisor
  console.log('👥 Insertando empleados (paso 1/3)...');
  const empleadosMap = new Map();
  const emailsUsados = new Set();
  let insertados = 0;
  
  for (const emp of empleados) {
    const puestoId = puestosMap.get(emp.cargo);
    const areaId = areasMap.get(emp.area);
    
    // Parsear nombre
    const partes = emp.nombreCompleto.split(',');
    let apellidos = partes[0].trim();
    let nombres = partes.length > 1 ? partes[1].trim() : '';
    
    // Generar email único
    let email = emp.email;
    let contador = 1;
    while (emailsUsados.has(email)) {
      email = emp.email.replace('@', `${contador}@`);
      contador++;
    }
    emailsUsados.add(email);
    
    const empleadoData = {
      codigo_empleado: emp.codigo,
      dni: emp.dni,
      nombres,
      apellidos,
      email,
      fecha_ingreso: emp.fechaIngreso,
      puesto_id: puestoId,
      area_id: areaId,
      tipo_trabajador_id: emp.tipoTrabajadorId,
      es_supervisor: emp.rol === 'supervisor' || emp.rol === 'admin',
      es_rrhh: emp.rol === 'rrhh',
      activo: true
    };
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/empleados`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(empleadoData)
      });
      
      if (res.ok) {
        const [empleadoCreado] = await res.json();
        empleadosMap.set(emp.dni, empleadoCreado.id);
        insertados++;
        if (insertados % 50 === 0) {
          console.log(`   Progreso: ${insertados}/${empleados.length}`);
        }
      } else {
        const error = await res.text();
        console.log(`   ⚠️  Error con ${nombres} ${apellidos}: ${error}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error insertando ${nombres} ${apellidos}:`, error.message);
    }
  }
  
  console.log(`✅ ${insertados} empleados insertados\n`);
  
  // Paso 2: Actualizar supervisores
  console.log('👔 Asignando supervisores (paso 2/3)...');
  let supervisoresAsignados = 0;
  
  for (const emp of empleados) {
    if (emp.dniJefe) {
      const empleadoId = empleadosMap.get(emp.dni);
      const supervisorId = empleadosMap.get(emp.dniJefe);
      
      if (empleadoId && supervisorId) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/empleados?id=eq.${empleadoId}`, {
            method: 'PATCH',
            headers: {
              'apikey': SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ supervisor_id: supervisorId })
          });
          
          if (res.ok) {
            supervisoresAsignados++;
          }
        } catch (error) {
          // Silent fail
        }
      }
    }
  }
  
  console.log(`✅ ${supervisoresAsignados} supervisores asignados\n`);
  
  // Paso 3: Crear usuarios
  console.log('🔐 Creando usuarios (paso 3/3)...');
  const hashedPassword = await bcrypt.hash('Agrovet2026!', 10);
  let usuariosCreados = 0;
  
  for (const emp of empleados) {
    const empleadoId = empleadosMap.get(emp.dni);
    if (!empleadoId) continue;
    
    const email = [...emailsUsados].find(e => e.includes(emp.email.split('@')[0]));
    
    const usuarioData = {
      empleado_id: empleadoId,
      email: email,
      password: hashedPassword,
      rol: emp.rol,
      activo: true
    };
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioData)
      });
      
      if (res.ok) {
        usuariosCreados++;
      }
    } catch (error) {
      // Silent fail
    }
  }
  
  console.log(`✅ ${usuariosCreados} usuarios creados\n`);
  
  // Paso 4: Crear periodos vacacionales
  console.log('📅 Creando periodos vacacionales...');
  let periodosCreados = 0;
  
  for (const [dni, empleadoId] of empleadosMap) {
    const periodoData = {
      empleado_id: empleadoId,
      anio_generacion: 2026,
      fecha_inicio_periodo: '2026-01-01',
      fecha_fin_periodo: '2026-12-31',
      dias_totales: 30,
      dias_disponibles: 30,
      dias_usados: 0,
      viernes_usados: 0,
      tiene_bloque_7dias: false,
      estado: 'activo'
    };
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/periodos_vacacionales`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(periodoData)
      });
      
      if (res.ok) {
        periodosCreados++;
      }
    } catch (error) {
      // Silent fail
    }
  }
  
  console.log(`✅ ${periodosCreados} periodos creados\n`);
  
  console.log('📊 RESUMEN FINAL:');
  console.log('==================');
  console.log(`✅ Empleados: ${insertados}`);
  console.log(`✅ Supervisores: ${supervisoresAsignados}`);
  console.log(`✅ Usuarios: ${usuariosCreados}`);
  console.log(`✅ Periodos: ${periodosCreados}`);
  console.log('\n🎉 CARGA COMPLETA!');
}

main().catch(console.error);
