import { query } from './src/db.js';

async function crearBoletinPrueba() {
  try {
    console.log('📝 Creando boletín de prueba...\n');
    
    // Obtener un usuario RRHH para ser el autor
    const usuarios = await query(`
      SELECT u.id, u.email, e.nombres, e.apellidos 
      FROM usuarios u
      JOIN empleados e ON u.empleado_id = e.id
      WHERE e.es_rrhh = true
      LIMIT 1
    `);
    
    if (usuarios.rows.length === 0) {
      console.log('⚠️ No hay usuarios RRHH. Usando el primer usuario disponible...');
      const primerUsuario = await query('SELECT id FROM usuarios ORDER BY id LIMIT 1');
      if (primerUsuario.rows.length === 0) {
        throw new Error('No hay usuarios en la base de datos');
      }
      var autorId = primerUsuario.rows[0].id;
    } else {
      var autorId = usuarios.rows[0].id;
      console.log(`✅ Usando usuario: ${usuarios.rows[0].nombres} ${usuarios.rows[0].apellidos} (${usuarios.rows[0].email})`);
    }
    
    // Crear el boletín
    const boletin = await query(`
      INSERT INTO publicaciones (
        autor_id, 
        titulo, 
        contenido, 
        tipo, 
        prioridad, 
        imagen_url,
        visible
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      autorId,
      '🎉 Bienvenidos a la Nueva Plataforma ConectAH',
      'Estamos emocionados de presentar nuestra nueva plataforma de comunicación interna. Aquí podrás encontrar todas las noticias, comunicados y eventos importantes de la empresa. ¡Mantente conectado con tu equipo!',
      'Comunicado',
      'Alta',
      'https://i.imgur.com/0y8Ftya.png',
      true
    ]);
    
    console.log('\n✅ Boletín creado exitosamente!');
    console.log('\n📋 Detalles del boletín:');
    console.table([{
      ID: boletin.rows[0].id,
      Título: boletin.rows[0].titulo,
      Tipo: boletin.rows[0].tipo,
      Prioridad: boletin.rows[0].prioridad,
      Visible: boletin.rows[0].visible
    }]);
    
    // Verificar el total de publicaciones
    const total = await query('SELECT COUNT(*) as total FROM publicaciones');
    console.log(`\n📊 Total de publicaciones en la BD: ${total.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

crearBoletinPrueba();
