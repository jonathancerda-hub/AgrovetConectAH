import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  InputAdornment,
  LinearProgress,
  Button,
  Stack
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import { empleadosService } from '../../../services/empleados.service';
import { notificacionesService } from '../../../services/notificaciones.service';
import api from '../../../services/api';

export default function DashboardRRHH() {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    sinVacaciones: 0,
    enVacaciones: 0,
    diasPromedio: 0
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
      console.log('📊 Cargando datos de control de vacaciones...');
      
      // Usar api de axios que ya tiene la configuración correcta
      const response = await api.get('/vacaciones/control-rrhh');
      const data = response.data;
      
      console.log('📊 Datos recibidos:', data);
      console.log('📊 Total empleados:', data?.length);
      console.log('📊 Primer empleado (muestra):', data[0]);
      
      setEmpleados(data);
      setFilteredEmpleados(data);

      // Calcular estadísticas
      const sinVacaciones = data.filter(emp => (emp.dias_disponibles || 0) === 0).length;
      const enVacaciones = 0; // Por implementar
      const totalDias = data.reduce((sum, emp) => sum + (emp.dias_totales || 0), 0);
      const promedio = data.length > 0 ? Math.round(totalDias / data.length) : 0;

      setStats({
        totalEmpleados: data.length,
        sinVacaciones,
        enVacaciones,
        diasPromedio: promedio
      });
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      console.error('❌ Error response:', err.response);
      setError('No se pudo cargar la información de empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (empleado) => {
    setSelectedEmpleado(empleado);
    const nombreCompleto = empleado.nombre_completo || `${empleado.nombres || ''} ${empleado.apellidos || ''}`.trim();
    const diasDisponibles = empleado.dias_disponibles || 0;
    setMensaje(`Estimado/a ${nombreCompleto}, le recordamos que tiene ${diasDisponibles} días de vacaciones disponibles. Por favor, coordine con su supervisor para programar su descanso.`);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmpleado(null);
    setMensaje('');
  };

  const handleSendNotification = async () => {
    try {
      if (!selectedEmpleado) {
        setError('No hay empleado seleccionado');
        return;
      }

      // Crear notificación en la base de datos
      await notificacionesService.create({
        empleado_id: selectedEmpleado.empleado_id,
        titulo: 'Recordatorio de Vacaciones',
        mensaje: mensaje,
        tipo: 'recordatorio',
        prioridad: 'normal'
      });

      setSuccess(`Notificación enviada exitosamente a ${selectedEmpleado.nombre_completo}`);
      handleCloseDialog();
      
    } catch (err) {
      console.error('Error al enviar notificación:', err);
      setError(err.response?.data?.detalles || 'No se pudo enviar la notificación');
    }
  };

  const getEstadoColor = (activo) => {
    return activo ? 'success' : 'error';
  };

  const getEstadoLabel = (activo) => {
    return activo ? 'Activo' : 'Inactivo';
  };

  const getDiasColor = (dias) => {
    if (!dias || dias === 0) return 'error';
    if (dias < 10) return 'warning';
    return 'success';
  };

  const getAlertaChip = (diasRestantes, diasTomados) => {
    if (diasRestantes === 0) {
      return <Chip label="Días agotados" color="error" size="small" icon={<WarningAmberIcon />} />;
    } else if (diasRestantes < 5) {
      return <Chip label="Pocos días" color="warning" size="small" icon={<WarningAmberIcon />} />;
    } else if (diasTomados === 0) {
      return <Chip label="OK" color="success" size="small" icon={<CheckCircleIcon />} />;
    }
    return <Chip label="OK" color="success" size="small" icon={<CheckCircleIcon />} />;
  };

  const getProgressColor = (diasRestantes, diasPorAno) => {
    const porcentaje = (diasRestantes / diasPorAno) * 100;
    if (porcentaje <= 20) return 'error';
    if (porcentaje <= 50) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DashboardIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard de Recursos Humanos
        </Typography>
      </Box>

      {/* Tarjetas de Estadísticas */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        sx={{ mb: 4 }}
      >
        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Empleados
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalEmpleados}
                  </Typography>
                </Box>
                <BeachAccessIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: 'error.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Sin Vacaciones
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.sinVacaciones}
                  </Typography>
                </Box>
                <WarningAmberIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    En Vacaciones
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.enVacaciones}
                  </Typography>
                </Box>
                <PendingActionsIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: 'success.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Días Promedio
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.diasPromedio}
                  </Typography>
                </Box>
                <BarChartIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Buscador */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, código, email o puesto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'white' }}
        />
      </Box>

      {/* Tabla de Empleados */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Puesto</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Días por Año</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Días Tomados</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Días Restantes</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uso de Vacaciones</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Alerta</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmpleados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron empleados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmpleados.map((empleado) => {
                  const diasPorAno = empleado.dias_totales || 30;
                  const diasTomados = empleado.dias_tomados || empleado.dias_usados || 0;
                  const diasRestantes = empleado.dias_disponibles || 0;
                  const porcentajeUso = diasPorAno > 0 ? ((diasTomados / diasPorAno) * 100) : 0;

                  return (
                    <TableRow 
                      key={empleado.empleado_id}
                      hover
                      sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {empleado.nombre_completo?.charAt(0) || <PersonIcon />}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {empleado.nombre_completo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              EMP-{String(empleado.empleado_id).padStart(3, '0')}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{empleado.puesto || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Activo" 
                          color="success" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {diasPorAno}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {diasTomados}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={diasRestantes} 
                          color={getDiasColor(diasRestantes)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: '100%', minWidth: 120 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(porcentajeUso, 100)}
                              color={getProgressColor(diasRestantes, diasPorAno)}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                            />
                            <Typography variant="caption" sx={{ minWidth: 40 }}>
                              {Math.round(porcentajeUso)}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getAlertaChip(diasRestantes, diasTomados)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Enviar recordatorio">
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleOpenDialog(empleado)}
                          >
                            <NotificationsActiveIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog para enviar notificación */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActiveIcon color="primary" />
            <Typography variant="h6">Enviar Recordatorio</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEmpleado && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Empleado: <strong>{selectedEmpleado.nombres} {selectedEmpleado.apellidos}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Días disponibles: <strong>{selectedEmpleado.dias_vacaciones || 0}</strong>
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSendNotification} 
            variant="contained" 
            startIcon={<SendIcon />}
            disabled={!mensaje.trim()}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Snackbar de error */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
