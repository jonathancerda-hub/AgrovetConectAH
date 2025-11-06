import { query } from '../db.js';

// Obtener notificaciones del usuario
export const getNotificaciones = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM notificaciones
       WHERE usuario_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Marcar como leída
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE notificaciones 
       SET leido = true 
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Marcar todas como leídas
export const markAllAsRead = async (req, res) => {
  try {
    await query(
      `UPDATE notificaciones 
       SET leido = true 
       WHERE usuario_id = $1 AND leido = false`,
      [req.user.id]
    );

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar todas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar notificación
export const deleteNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM notificaciones 
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación eliminada' });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener no leídas
export const getUnread = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM notificaciones
       WHERE usuario_id = $1 AND leido = false
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener no leídas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear notificación
export const createNotificacion = async (req, res) => {
  try {
    const { usuario_id, titulo, mensaje, tipo } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !titulo || !mensaje) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: usuario_id, titulo, mensaje' 
      });
    }

    const result = await query(
      `INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, leido, created_at)
       VALUES ($1, $2, $3, $4, false, NOW())
       RETURNING *`,
      [usuario_id, titulo, mensaje, tipo || 'informacion']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
