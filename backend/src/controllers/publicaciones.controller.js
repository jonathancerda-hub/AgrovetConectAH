import { query } from '../db.js';

// Obtener todas las publicaciones
export const getPublicaciones = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, u.email as autor_email, e.nombres as autor_nombres, 
              e.apellidos as autor_apellidos,
              (SELECT COUNT(*) FROM reacciones_publicaciones WHERE publicacion_id = p.id) as total_reacciones,
              (SELECT COUNT(*) FROM comentarios_publicaciones WHERE publicacion_id = p.id) as total_comentarios
       FROM publicaciones p
       JOIN usuarios u ON p.autor_id = u.id
       LEFT JOIN empleados e ON u.empleado_id = e.id
       WHERE p.visible = true
       ORDER BY p.fecha_publicacion DESC
       LIMIT 50`,
      []
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear publicación
export const createPublicacion = async (req, res) => {
  try {
    const { titulo, contenido, tipo, prioridad, imagenUrl } = req.body;
    
    const result = await query(
      `INSERT INTO publicaciones (autor_id, titulo, contenido, tipo, prioridad, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, titulo, contenido, tipo || 'Noticia', prioridad || 'Media', imagenUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Agregar reacción
export const addReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoReaccion } = req.body;

    const result = await query(
      `INSERT INTO reacciones_publicaciones (publicacion_id, usuario_id, tipo_reaccion)
       VALUES ($1, $2, $3)
       ON CONFLICT (publicacion_id, usuario_id) 
       DO UPDATE SET tipo_reaccion = $3
       RETURNING *`,
      [id, req.user.id, tipoReaccion || 'like']
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar reacción:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Agregar comentario
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;

    const result = await query(
      `INSERT INTO comentarios_publicaciones (publicacion_id, usuario_id, contenido)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, req.user.id, contenido]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener comentarios de una publicación
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT c.*, u.email, e.nombres, e.apellidos
       FROM comentarios_publicaciones c
       JOIN usuarios u ON c.usuario_id = u.id
       LEFT JOIN empleados e ON u.empleado_id = e.id
       WHERE c.publicacion_id = $1
       ORDER BY c.created_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
