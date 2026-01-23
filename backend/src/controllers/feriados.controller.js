import { query as dbQuery } from '../db.js';

/**
 * Obtener todos los feriados
 */
export const obtenerFeriados = async (req, res) => {
  try {
    const { anio } = req.query;
    
    let queryText = `
      SELECT id, fecha, nombre, tipo, pais, anio, fecha_creacion
      FROM feriados
    `;
    
    const params = [];
    if (anio) {
      queryText += ` WHERE anio = $1`;
      params.push(anio);
    }
    
    queryText += ` ORDER BY fecha ASC`;
    
    const result = await dbQuery(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener feriados:', error);
    res.status(500).json({ 
      error: 'Error al obtener feriados',
      detalles: error.message 
    });
  }
};

/**
 * Obtener feriado por ID
 */
export const obtenerFeriadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const queryText = `
      SELECT id, fecha, nombre, tipo, pais, anio, fecha_creacion
      FROM feriados
      WHERE id = $1
    `;
    
    const result = await dbQuery(queryText, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feriado no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener feriado:', error);
    res.status(500).json({ 
      error: 'Error al obtener feriado',
      detalles: error.message 
    });
  }
};

/**
 * Crear nuevo feriado
 */
export const crearFeriado = async (req, res) => {
  try {
    const { fecha, nombre, tipo = 'nacional', pais = 'PE' } = req.body;
    
    // Validaciones
    if (!fecha || !nombre) {
      return res.status(400).json({ 
        error: 'Fecha y nombre son requeridos' 
      });
    }
    
    // Extraer año de la fecha
    const anio = new Date(fecha).getFullYear();
    
    // Verificar si ya existe ese feriado
    const verificarQuery = `
      SELECT id FROM feriados WHERE fecha = $1
    `;
    const existe = await dbQuery(verificarQuery, [fecha]);
    
    if (existe.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe un feriado registrado en esa fecha' 
      });
    }
    
    const queryText = `
      INSERT INTO feriados (fecha, nombre, tipo, pais, anio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, fecha, nombre, tipo, pais, anio, fecha_creacion
    `;
    
    const result = await dbQuery(queryText, [fecha, nombre, tipo, pais, anio]);
    
    res.status(201).json({
      mensaje: 'Feriado creado exitosamente',
      feriado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear feriado:', error);
    res.status(500).json({ 
      error: 'Error al crear feriado',
      detalles: error.message 
    });
  }
};

/**
 * Actualizar feriado
 */
export const actualizarFeriado = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, nombre, tipo, pais } = req.body;
    
    // Verificar que el feriado existe
    const verificar = await dbQuery('SELECT id FROM feriados WHERE id = $1', [id]);
    if (verificar.rows.length === 0) {
      return res.status(404).json({ error: 'Feriado no encontrado' });
    }
    
    // Extraer año de la fecha si se actualiza
    const anio = fecha ? new Date(fecha).getFullYear() : null;
    
    // Construir query dinámico
    const campos = [];
    const valores = [];
    let contador = 1;
    
    if (fecha) {
      campos.push(`fecha = $${contador}`);
      valores.push(fecha);
      contador++;
    }
    if (nombre) {
      campos.push(`nombre = $${contador}`);
      valores.push(nombre);
      contador++;
    }
    if (tipo) {
      campos.push(`tipo = $${contador}`);
      valores.push(tipo);
      contador++;
    }
    if (pais) {
      campos.push(`pais = $${contador}`);
      valores.push(pais);
      contador++;
    }
    if (anio) {
      campos.push(`anio = $${contador}`);
      valores.push(anio);
      contador++;
    }
    
    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    valores.push(id);
    
    const queryText = `
      UPDATE feriados
      SET ${campos.join(', ')}
      WHERE id = $${contador}
      RETURNING id, fecha, nombre, tipo, pais, anio, fecha_creacion
    `;
    
    const result = await dbQuery(queryText, valores);
    
    res.json({
      mensaje: 'Feriado actualizado exitosamente',
      feriado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar feriado:', error);
    res.status(500).json({ 
      error: 'Error al actualizar feriado',
      detalles: error.message 
    });
  }
};

/**
 * Eliminar feriado
 */
export const eliminarFeriado = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el feriado existe
    const verificar = await dbQuery('SELECT id, nombre FROM feriados WHERE id = $1', [id]);
    if (verificar.rows.length === 0) {
      return res.status(404).json({ error: 'Feriado no encontrado' });
    }
    
    const queryText = `DELETE FROM feriados WHERE id = $1`;
    await dbQuery(queryText, [id]);
    
    res.json({
      mensaje: 'Feriado eliminado exitosamente',
      nombre: verificar.rows[0].nombre
    });
  } catch (error) {
    console.error('Error al eliminar feriado:', error);
    res.status(500).json({ 
      error: 'Error al eliminar feriado',
      detalles: error.message 
    });
  }
};

/**
 * Obtener años disponibles
 */
export const obtenerAniosDisponibles = async (req, res) => {
  try {
    const queryText = `
      SELECT DISTINCT anio
      FROM feriados
      ORDER BY anio DESC
    `;
    
    const result = await dbQuery(queryText);
    const anios = result.rows.map(row => row.anio);
    
    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años:', error);
    res.status(500).json({ 
      error: 'Error al obtener años disponibles',
      detalles: error.message 
    });
  }
};
