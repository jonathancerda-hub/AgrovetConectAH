import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Función para limpiar y normalizar strings
function limpiarTexto(texto) {
  if (!texto) return '';
  return texto.toString().trim().replace(/\s+/g, ' ');
}

// Función para extraer primer nombre
function extraerPrimerNombre(nombreCompleto) {
  const nombres = limpiarTexto(nombreCompleto).split(' ');
  return nombres[0].toLowerCase();
}

// Función para extraer primer apellido
function extraerPrimerApellido(nombreCompleto) {
  const partes = limpiarTexto(nombreCompleto).split(',');
  if (partes.length > 1) {
    const apellidos = partes[0].trim().split(' ');
    return apellidos[0].toLowerCase();
  }
  return 'usuario';
}

// Función para generar email
function generarEmail(nombreCompleto) {
  const partes = limpiarTexto(nombreCompleto).split(',');
  let email = '';
  
  if (partes.length > 1) {
    const apellidos = partes[0].trim().split(' ');
    const nombres = partes[1].trim().split(' ');
    
    const primerNombre = nombres[0].toLowerCase();
    const primerApellido = apellidos[0].toLowerCase();
    
    email = `${primerNombre}.${primerApellido}@agrovetmarket.com`;
  } else {
    email = `usuario${Math.random().toString(36).substring(7)}@agrovetmarket.com`;
  }
  
  // Limpiar caracteres especiales
  email = email.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  email = email.replace(/[^a-z0-9.@]/g, '');
  
  return email;
}

// Función para extraer DNI del jefe
function extraerDniJefe(jefeTexto) {
  if (!jefeTexto) return null;
  const match = jefeTexto.match(/(\d{8,9})/);
  return match ? match[1].trim() : null;
}

// Función para determinar rol según nivel jerárquico
function determinarRol(nivelJerarquico, cargo) {
  const nivel = limpiarTexto(nivelJerarquico).toLowerCase();
  const cargoLower = limpiarTexto(cargo).toLowerCase();
  
  // RRHH
  if (cargoLower.includes('talento humano') || cargoLower.includes('recursos humanos')) {
    return 'rrhh';
  }
  
  // Admin y Directores
  if (nivel.includes('1. director') || cargoLower.includes('director general')) {
    return 'admin';
  }
  
  // Gerentes, Jefes, Subgerentes = supervisores
  if (nivel.includes('2. gerente') || nivel.includes('3. subgerente') || 
      nivel.includes('4. jefe') || nivel.includes('5. supervisor') ||
      cargoLower.includes('coordinador')) {
    return 'supervisor';
  }
  
  // Resto = empleados
  return 'empleado';
}

// Función para determinar tipo de trabajador
function determinarTipoTrabajador(nivelJerarquico, cargo) {
  const cargoLower = limpiarTexto(cargo).toLowerCase();
  
  if (cargoLower.includes('practicante')) return 1; // Prácticas
  if (cargoLower.includes('temporal')) return 3; // Temporal
  
  return 1; // Por defecto: Plazo Indeterminado
}

// Función para mapear área desde centro de costo
function mapearAreaDesdeCentroCosto(centroCosto) {
  const centro = limpiarTexto(centroCosto).toUpperCase();
  
  // Si el centro de costo está vacío, retornar un área por defecto
  if (!centro) {
    return 'Administración';
  }
  
  // Normalizar y limpiar el centro de costo
  // Remover caracteres especiales y múltiples espacios
  const centroLimpio = centro
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Retornar el centro de costo limpio como área
  return centroLimpio;
}

async function main() {
  try {
    console.log('🚀 Iniciando carga de personal completo...\n');
    
    // 1. Leer CSV
    console.log('📖 Leyendo archivo CSV...');
    const csvPath = path.join(__dirname, '../../listado-personal.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parsear CSV con manejo de comillas
    const lines = csvContent.split('\n').filter(line => line.trim());
    const empleados = [];
    
    // Saltar header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Parseo mejorado: manejar comillas
      const campos = [];
      let campo = '';
      let dentroDeComillas = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          dentroDeComillas = !dentroDeComillas;
        } else if (char === ',' && !dentroDeComillas) {
          campos.push(campo);
          campo = '';
        } else {
          campo += char;
        }
      }
      campos.push(campo); // Último campo
      
      if (campos.length >= 10 && limpiarTexto(campos[1]).length >= 7) {
        const empleado = {
          codigo: limpiarTexto(campos[0]),
          dni: limpiarTexto(campos[1]),
          nombreCompleto: limpiarTexto(campos[2]),
          fechaIngreso: limpiarTexto(campos[3]),
          cargo: limpiarTexto(campos[4]),
          direccion: limpiarTexto(campos[5]),
          gerencia: limpiarTexto(campos[6]),
          centroCosto: limpiarTexto(campos[7]),
          nivelJerarquico: limpiarTexto(campos[8]),
          jefeInmediato: campos.slice(9).join(',').trim()
        };
        
        empleados.push(empleado);
      }
    }
    
    console.log(`✅ ${empleados.length} empleados encontrados\n`);
    
    // 2. Extraer datos únicos
    console.log('🔍 Extrayendo áreas y puestos únicos...');
    
    const areasSet = new Set();
    const puestosSet = new Set();
    const centrosCostoSet = new Set();
    
    empleados.forEach(emp => {
      const centroCosto = mapearAreaDesdeCentroCosto(emp.centroCosto);
      centrosCostoSet.add(centroCosto);
      puestosSet.add(emp.cargo);
    });
    
    const areas = Array.from(centrosCostoSet).sort();
    const puestos = Array.from(puestosSet);
    
    console.log(`   - ${areas.length} áreas únicas`);
    console.log(`   - ${puestos.length} puestos únicos\n`);
    
    // Guardar para referencia
    const dataParaCarga = {
      areas,
      puestos,
      empleados: empleados.map(emp => ({
        ...emp,
        email: generarEmail(emp.nombreCompleto),
        rol: determinarRol(emp.nivelJerarquico, emp.cargo),
        area: mapearAreaDesdeCentroCosto(emp.centroCosto),
        dniJefe: extraerDniJefe(emp.jefeInmediato),
        tipoTrabajadorId: determinarTipoTrabajador(emp.nivelJerarquico, emp.cargo)
      }))
    };
    
    const outputPath = path.join(__dirname, '../../datos-procesados.json');
    fs.writeFileSync(outputPath, JSON.stringify(dataParaCarga, null, 2), 'utf8');
    
    console.log(`✅ Datos procesados guardados en: datos-procesados.json`);
    console.log(`\n📊 Resumen de roles:`);
    
    const rolesCuenta = {};
    dataParaCarga.empleados.forEach(emp => {
      rolesCuenta[emp.rol] = (rolesCuenta[emp.rol] || 0) + 1;
    });
    
    Object.entries(rolesCuenta).forEach(([rol, count]) => {
      console.log(`   - ${rol}: ${count} empleados`);
    });
    
    console.log('\n✨ Procesamiento completado exitosamente');
    console.log('📝 Siguiente paso: ejecutar script de limpieza y carga en Supabase\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
