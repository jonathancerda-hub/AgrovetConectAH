import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon
} from '@mui/icons-material';
import moment from 'moment';
import { feriadosService } from '../../../services/feriados.service';

moment.locale('es');

const GestionFeriados = () => {
  const [feriados, setFeriados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [aniosDisponibles, setAniosDisponibles] = useState([]);
  
  // Estado del diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [feriadoActual, setFeriadoActual] = useState({
    id: null,
    fecha: '',
    nombre: '',
    tipo: 'nacional'
  });

  // Estado del diálogo de confirmación
  const [openConfirm, setOpenConfirm] = useState(false);
  const [feriadoEliminar, setFeriadoEliminar] = useState(null);

  useEffect(() => {
    cargarAniosDisponibles();
    cargarFeriados();
  }, [anioSeleccionado]);

  const cargarAniosDisponibles = async () => {
    try {
      const anios = await feriadosService.getAnios();
      const anioActual = new Date().getFullYear();
      const aniosSugeridos = [anioActual - 1, anioActual, anioActual + 1];
      const todosLosAnios = [...new Set([...anios, ...aniosSugeridos])].sort((a, b) => b - a);
      setAniosDisponibles(todosLosAnios);
    } catch (err) {
      console.error('Error al cargar años:', err);
    }
  };

  const cargarFeriados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feriadosService.getAll(anioSeleccionado);
      setFeriados(data);
    } catch (err) {
      console.error('Error al cargar feriados:', err);
      setError('Error al cargar los feriados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (feriado = null) => {
    if (feriado) {
      setModoEdicion(true);
      setFeriadoActual({
        id: feriado.id,
        fecha: moment(feriado.fecha).format('YYYY-MM-DD'),
        nombre: feriado.nombre,
        tipo: feriado.tipo
      });
    } else {
      setModoEdicion(false);
      setFeriadoActual({
        id: null,
        fecha: `${anioSeleccionado}-01-01`,
        nombre: '',
        tipo: 'nacional'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFeriadoActual({
      id: null,
      fecha: '',
      nombre: '',
      tipo: 'nacional'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeriadoActual(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (!feriadoActual.fecha || !feriadoActual.nombre) {
        setError('Fecha y nombre son requeridos');
        return;
      }

      if (modoEdicion) {
        await feriadosService.update(feriadoActual.id, {
          fecha: feriadoActual.fecha,
          nombre: feriadoActual.nombre,
          tipo: feriadoActual.tipo
        });
        setSuccess('Feriado actualizado exitosamente');
      } else {
        await feriadosService.create({
          fecha: feriadoActual.fecha,
          nombre: feriadoActual.nombre,
          tipo: feriadoActual.tipo
        });
        setSuccess('Feriado creado exitosamente');
      }

      handleCloseDialog();
      await cargarFeriados();
      await cargarAniosDisponibles();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error al guardar feriado:', err);
      setError(err.response?.data?.error || 'Error al guardar el feriado');
    }
  };

  const handleOpenConfirm = (feriado) => {
    setFeriadoEliminar(feriado);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setFeriadoEliminar(null);
  };

  const handleDelete = async () => {
    try {
      await feriadosService.delete(feriadoEliminar.id);
      setSuccess(`Feriado "${feriadoEliminar.nombre}" eliminado exitosamente`);
      handleCloseConfirm();
      await cargarFeriados();
      await cargarAniosDisponibles();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error al eliminar feriado:', err);
      setError('Error al eliminar el feriado');
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'nacional': return 'error';
      case 'regional': return 'warning';
      case 'festivo': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon /> Gestión de Feriados
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Feriado
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Año</InputLabel>
          <Select
            value={anioSeleccionado}
            label="Año"
            onChange={(e) => setAnioSeleccionado(e.target.value)}
          >
            {aniosDisponibles.map(anio => (
              <MenuItem key={anio} value={anio}>{anio}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Día</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : feriados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" py={3}>
                    No hay feriados registrados para {anioSeleccionado}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              feriados.map((feriado) => (
                <TableRow key={feriado.id} hover>
                  <TableCell>{moment(feriado.fecha).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={moment(feriado.fecha).format('dddd')} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{feriado.nombre}</TableCell>
                  <TableCell>
                    <Chip 
                      label={feriado.tipo} 
                      color={getTipoColor(feriado.tipo)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(feriado)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenConfirm(feriado)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para agregar/editar feriado */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modoEdicion ? 'Editar Feriado' : 'Agregar Nuevo Feriado'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={feriadoActual.fecha}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Nombre del Feriado"
              name="nombre"
              value={feriadoActual.nombre}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Ej: Día de la Independencia"
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="tipo"
                value={feriadoActual.tipo}
                label="Tipo"
                onChange={handleChange}
              >
                <MenuItem value="nacional">Nacional</MenuItem>
                <MenuItem value="regional">Regional</MenuItem>
                <MenuItem value="festivo">Festivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!feriadoActual.fecha || !feriadoActual.nombre}
          >
            {modoEdicion ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar el feriado "{feriadoEliminar?.nombre}" 
            del {moment(feriadoEliminar?.fecha).format('DD/MM/YYYY')}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionFeriados;
