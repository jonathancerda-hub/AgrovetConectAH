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
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [tiposTrabajador, setTiposTrabajador] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    puesto_id: '',
    area_id: '',
    supervisor_id: '',
    tipo_trabajador_id: 1,
    fecha_ingreso: new Date().toISOString().split('T')[0],
    fecha_nacimiento: '',
    direccion: '',
    dias_vacaciones: 30
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
      
      console.log('📊 Empleados cargados:', empleadosData.length);
      console.log('📊 Primer empleado:', empleadosData[0]);
      
      setEmpleados(empleadosData);
      setFilteredEmpleados(empleadosData);
      setPuestos(puestosData);
      setAreas(areasData);
      setSupervisores(empleadosData); // Todos los empleados pueden ser supervisores
      
      // Cargar tipos de trabajador
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const tiposResponse = await fetch(`${API_URL}/vacaciones/tipos-trabajador`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const tiposData = await tiposResponse.json();
      setTiposTrabajador(tiposData);
      
      setError('');
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
        supervisor_id: empleado.supervisor_id || '',
        tipo_trabajador_id: empleado.tipo_trabajador_id || 1,
        fecha_ingreso: empleado.fecha_ingreso?.split('T')[0] || '',
        fecha_nacimiento: empleado.fecha_nacimiento?.split('T')[0] || '',
        direccion: empleado.direccion || '',
        dias_vacaciones: empleado.dias_vacaciones || 30,
        activo: empleado.activo !== false
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
        supervisor_id: '',
        tipo_trabajador_id: 1,
        fecha_ingreso: new Date().toISOString().split('T')[0],
        fecha_nacimiento: '',
        direccion: '',
        dias_vacaciones: 30,
        activo: true,
        password: ''
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
      const dataToSend = {
        dni: formData.dni,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono,
        puesto_id: formData.puesto_id,
        area_id: formData.area_id,
        supervisor_id: formData.supervisor_id || null,
        tipo_trabajador_id: formData.tipo_trabajador_id || 1,
        fecha_ingreso: formData.fecha_ingreso,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        direccion: formData.direccion || null,
        dias_vacaciones: formData.dias_vacaciones,
        activo: formData.activo
      };

      if (editingEmpleado) {
        await empleadosService.update(editingEmpleado.id, dataToSend);
        setSuccess('Empleado actualizado correctamente');
      } else {
        await empleadosService.create({ 
          ...dataToSend, 
          password: formData.password || 'temp123', 
          rol: 'empleado' 
        });
        setSuccess('Empleado creado correctamente');
      }
      
      await fetchData();
      handleCloseDialog();
      setTimeout(() => setSuccess(''), 3000);
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
          disabled
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

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
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
                    {empleado.activo && (
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Sección: Datos Personales */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 600 }}>
                📋 Datos Personales
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
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
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
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
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                multiline
                rows={1}
              />
            </Grid>

            {/* Sección: Contacto */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, mt: 2, fontWeight: 600 }}>
                📞 Contacto
              </Typography>
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

            {/* Sección: Información Laboral */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, mt: 2, fontWeight: 600 }}>
                💼 Información Laboral
              </Typography>
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
                <MenuItem value="">
                  <em>Seleccione un puesto</em>
                </MenuItem>
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
                <MenuItem value="">
                  <em>Seleccione un área</em>
                </MenuItem>
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
                label="Jefe Directo"
                name="supervisor_id"
                value={formData.supervisor_id || ''}
                onChange={handleInputChange}
                helperText="Seleccione el supervisor directo del empleado"
              >
                <MenuItem value="">
                  <em>Sin supervisor</em>
                </MenuItem>
                {supervisores.map((supervisor) => (
                  <MenuItem key={supervisor.id} value={supervisor.id}>
                    {supervisor.nombres} {supervisor.apellidos} - {supervisor.puesto || 'Sin puesto'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Trabajador"
                name="tipo_trabajador_id"
                value={formData.tipo_trabajador_id || 1}
                onChange={handleInputChange}
                helperText="Define los días de vacaciones base"
              >
                {tiposTrabajador.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre} ({tipo.dias_vacaciones} días)
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
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
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Días de Vacaciones"
                name="dias_vacaciones"
                type="number"
                value={formData.dias_vacaciones}
                onChange={handleInputChange}
                helperText="Días anuales de vacaciones"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Estado"
                name="activo"
                value={formData.activo ? '1' : '0'}
                onChange={(e) => setFormData({ ...formData, activo: e.target.value === '1' })}
              >
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="0">Inactivo</MenuItem>
              </TextField>
            </Grid>

            {!editingEmpleado && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, mt: 2, fontWeight: 600 }}>
                    🔐 Credenciales de Acceso
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingEmpleado}
                    helperText="Mínimo 6 caracteres"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<PersonIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #238277 0%, #1d3a45 100%)',
              }
            }}
          >
            {editingEmpleado ? 'Guardar Cambios' : 'Crear Empleado'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
