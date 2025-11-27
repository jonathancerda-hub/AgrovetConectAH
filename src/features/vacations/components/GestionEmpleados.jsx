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
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
  Tooltip,
  Switch
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import { empleadosService } from '../../../services/empleados.service';

export default function GestionEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [areas, setAreas] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    puesto_id: '',
    area_id: '',
    tipo_contrato: 'Indefinido',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    dias_vacaciones: 15
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar empleados por búsqueda
    const filtered = empleados.filter(emp =>
      emp.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.codigo_empleado?.includes(searchTerm) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.puesto?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmpleados(filtered);
  }, [searchTerm, empleados]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empleadosData, puestosData, areasData] = await Promise.all([
        empleadosService.getAll(),
        empleadosService.getPuestos(),
        empleadosService.getAreas()
      ]);
      
      setEmpleados(empleadosData);
      setFilteredEmpleados(empleadosData);
      setPuestos(puestosData);
      setAreas(areasData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (empleado = null) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      setFormData({
        dni: empleado.dni || '',
        nombres: empleado.nombres || '',
        apellidos: empleado.apellidos || '',
        email: empleado.email || '',
        telefono: empleado.telefono || '',
        puesto_id: empleado.puesto_id || '',
        area_id: empleado.area_id || '',
        tipo_contrato: empleado.tipo_contrato || 'Indefinido',
        fecha_ingreso: empleado.fecha_ingreso?.split('T')[0] || '',
        dias_vacaciones: empleado.dias_vacaciones || 15
      });
    } else {
      setEditingEmpleado(null);
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        puesto_id: '',
        area_id: '',
        tipo_contrato: 'Indefinido',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        dias_vacaciones: 15
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmpleado(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleRRHH = async (empleadoId, currentValue) => {
    try {
      await empleadosService.setRolRRHH(empleadoId, !currentValue);
      // Actualizar la lista
      setEmpleados(prevEmpleados =>
        prevEmpleados.map(emp =>
          emp.id === empleadoId ? { ...emp, es_rrhh: !currentValue } : emp
        )
      );
      setFilteredEmpleados(prevFiltered =>
        prevFiltered.map(emp =>
          emp.id === empleadoId ? { ...emp, es_rrhh: !currentValue } : emp
        )
      );
      setError(''); // Limpiar error si había
    } catch (err) {
      console.error('Error al cambiar rol RRHH:', err);
      setError('No se pudo actualizar el rol de RRHH');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingEmpleado) {
        await empleadosService.update(editingEmpleado.id, formData);
      } else {
        await empleadosService.create({ ...formData, password: 'temp123', rol: 'empleado' });
      }
      
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error('Error al guardar empleado:', err);
      setError(err.response?.data?.error || 'Error al guardar el empleado');
    }
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm('¿Está seguro de desactivar este empleado?')) return;
    
    try {
      await empleadosService.desactivar(id, { fecha_salida: new Date().toISOString() });
      await fetchData();
    } catch (err) {
      console.error('Error al desactivar empleado:', err);
      setError('Error al desactivar el empleado');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'success';
      case 'Inactivo':
        return 'error';
      case 'Vacaciones':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Empleados
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)',
            color: 'white'
          }}
        >
          Nuevo Empleado
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, DNI, email o puesto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Empleado</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Área</TableCell>
              <TableCell>Tipo Contrato</TableCell>
              <TableCell>Días Vac.</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">RRHH</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmpleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay empleados registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmpleados.map((empleado) => (
                <TableRow key={empleado.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {empleado.nombres} {empleado.apellidos}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {empleado.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{empleado.codigo_empleado || '-'}</TableCell>
                  <TableCell>{empleado.puesto || '-'}</TableCell>
                  <TableCell>{empleado.area || '-'}</TableCell>
                  <TableCell>{empleado.tipo_contrato || '-'}</TableCell>
                  <TableCell align="center">{empleado.dias_vacaciones || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={empleado.activo ? 'Activo' : 'Inactivo'}
                      color={empleado.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={empleado.es_rrhh ? 'Usuario de RRHH' : 'Empleado normal'}>
                      <Switch
                        checked={empleado.es_rrhh || false}
                        onChange={() => handleToggleRRHH(empleado.id, empleado.es_rrhh)}
                        color="primary"
                        size="small"
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(empleado)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {empleado.estado === 'Activo' && (
                      <Tooltip title="Desactivar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDesactivar(empleado.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar empleado */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!editingEmpleado}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Puesto"
                name="puesto_id"
                value={formData.puesto_id}
                onChange={handleInputChange}
                required
              >
                {puestos.map((puesto) => (
                  <MenuItem key={puesto.id} value={puesto.id}>
                    {puesto.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Área"
                name="area_id"
                value={formData.area_id}
                onChange={handleInputChange}
                required
              >
                {areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Contrato"
                name="tipo_contrato"
                value={formData.tipo_contrato}
                onChange={handleInputChange}
              >
                <MenuItem value="Indefinido">Indefinido</MenuItem>
                <MenuItem value="Plazo Fijo">Plazo Fijo</MenuItem>
                <MenuItem value="Prácticas">Prácticas</MenuItem>
                <MenuItem value="Temporal">Temporal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Ingreso"
                name="fecha_ingreso"
                type="date"
                value={formData.fecha_ingreso}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Días de Vacaciones"
                name="dias_vacaciones"
                type="number"
                value={formData.dias_vacaciones}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)',
              color: 'white'
            }}
          >
            {editingEmpleado ? 'Guardar Cambios' : 'Crear Empleado'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
