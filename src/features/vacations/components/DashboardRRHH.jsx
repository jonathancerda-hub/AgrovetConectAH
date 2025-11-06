import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
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
  Button
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
import { empleadosService } from '../../../services/empleados.service';
import { notificacionesService } from '../../../services/notificaciones.service';

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
      emp.dni?.includes(searchTerm) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.puesto?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmpleados(filtered);
  }, [searchTerm, empleados]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await empleadosService.getAll();
      
      // Filtrar solo empleados activos
      const activos = data.filter(emp => emp.estado === 'Activo' || emp.estado === 'Vacaciones');
      setEmpleados(activos);
      setFilteredEmpleados(activos);

      // Calcular estadísticas
      const sinVacaciones = activos.filter(emp => !emp.dias_vacaciones || emp.dias_vacaciones === 0).length;
      const enVacaciones = activos.filter(emp => emp.estado === 'Vacaciones').length;
      const totalDias = activos.reduce((sum, emp) => sum + (emp.dias_vacaciones || 0), 0);
      const promedio = activos.length > 0 ? Math.round(totalDias / activos.length) : 0;

      setStats({
        totalEmpleados: activos.length,
        sinVacaciones,
        enVacaciones,
        diasPromedio: promedio
      });
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudo cargar la información de empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (empleado) => {
    setSelectedEmpleado(empleado);
    setMensaje(`Estimado/a ${empleado.nombres}, le recordamos que tiene ${empleado.dias_vacaciones || 0} días de vacaciones disponibles. Por favor, coordine con su supervisor para programar su descanso.`);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmpleado(null);
    setMensaje('');
  };

  const handleSendNotification = async () => {
    try {
      // Crear notificación para el empleado
      await notificacionesService.create({
        usuario_id: selectedEmpleado.usuario_id,
        titulo: 'Recordatorio de Vacaciones',
        mensaje: mensaje,
        tipo: 'recordatorio',
        leida: false
      });

      setSuccess(`Notificación enviada exitosamente a ${selectedEmpleado.nombres} ${selectedEmpleado.apellidos}`);
      handleCloseDialog();
      
    } catch (err) {
      console.error('Error al enviar notificación:', err);
      setError('No se pudo enviar la notificación');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'success';
      case 'Vacaciones': return 'warning';
      case 'Cesado': return 'error';
      default: return 'default';
    }
  };

  const getDiasColor = (dias) => {
    if (!dias || dias === 0) return 'error';
    if (dias < 10) return 'warning';
    return 'success';
  };

  const getAlertaChip = (diasRestantes, diasTomados, diasPorAno) => {
    if (diasRestantes === 0) {
      return <Chip label="Días agotados" color="error" size="small" icon={<WarningAmberIcon />} />;
    } else if (diasRestantes < 5) {
      return <Chip label="Pocos días restantes" color="warning" size="small" icon={<WarningAmberIcon />} />;
    } else if (diasTomados === 0) {
      return <Chip label="Sin alertas" color="success" size="small" icon={<CheckCircleIcon />} />;
    }
    return <Chip label="Sin alertas" color="success" size="small" icon={<CheckCircleIcon />} />;
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          <DashboardIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 32 }} />
          Dashboard RRHH - Control de Vacaciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona y supervisa las vacaciones de todo el personal
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderTop: 3, 
              borderColor: 'primary.main',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <BeachAccessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {stats.totalEmpleados}
              </Typography>
              <Typography variant="body2" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                Total Empleados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderTop: 3, 
              borderColor: 'error.main',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <WarningAmberIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {stats.sinVacaciones}
              </Typography>
              <Typography variant="body2" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                Sin Vacaciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderTop: 3, 
              borderColor: 'warning.main',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <PendingActionsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {stats.enVacaciones}
              </Typography>
              <Typography variant="body2" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                En Vacaciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderTop: 3, 
              borderColor: 'success.main',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {stats.diasPromedio}
              </Typography>
              <Typography variant="body2" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                Días Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Título */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Control de Vacaciones por Empleado
        </Typography>
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

      {/* Tabla de Empleados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Empleado</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Antigüedad</TableCell>
              <TableCell align="center">Días<br/>Disponibles</TableCell>
              <TableCell align="center">Días<br/>Tomados</TableCell>
              <TableCell align="center">Días<br/>Restantes</TableCell>
              <TableCell align="center">Pendientes</TableCell>
              <TableCell align="center">Última<br/>Solicitud</TableCell>
              <TableCell align="center">Alertas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmpleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary" py={4}>
                    {searchTerm ? 'No se encontraron resultados' : 'No hay empleados registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmpleados.map((empleado) => {
                const fechaIngreso = new Date(empleado.fecha_ingreso);
                const antiguedad = `${fechaIngreso.getFullYear() - new Date().getFullYear()} días`;
                const diasPorAno = 20; // Asumiendo 20 días por año
                const diasTomados = empleado.dias_vacaciones ? diasPorAno - empleado.dias_vacaciones : diasPorAno;
                const diasRestantes = empleado.dias_vacaciones || 0;
                const porcentajeUsado = diasPorAno > 0 ? (diasTomados / diasPorAno) * 100 : 0;
                
                return (
                  <TableRow key={empleado.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'teal', 
                            width: 40, 
                            height: 40,
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                        >
                          {empleado.nombres?.substring(0, 2).toUpperCase() || 'EM'}
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
                    <TableCell>
                      <Typography variant="body2">
                        {empleado.puesto}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {Math.abs(new Date().getFullYear() - fechaIngreso.getFullYear()) * 365} días
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {diasPorAno}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        por año
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {diasTomados}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        utilizados
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={700}
                          color={diasRestantes < 5 ? 'error.main' : diasRestantes < 10 ? 'warning.main' : 'success.main'}
                        >
                          {diasRestantes}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(porcentajeUsado, 100)}
                          color={getProgressColor(diasRestantes, diasPorAno)}
                          sx={{ 
                            height: 8, 
                            borderRadius: 1,
                            mt: 0.5,
                            minWidth: 60
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        Sin solicitudes
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                        {getAlertaChip(diasRestantes, diasTomados, diasPorAno)}
                        <Tooltip title="Enviar recordatorio">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(empleado)}
                            disabled={empleado.estado === 'Vacaciones'}
                          >
                            <NotificationsActiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumen de Alertas */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChartIcon />
          Resumen de Alertas
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="error.main">
                {stats.sinVacaciones}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Empleados sin vacaciones
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solicitudes pendientes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="info.main">
                {stats.totalEmpleados * 20}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total días disponibles
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog para enviar notificación */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsActiveIcon sx={{ mr: 1, color: 'primary.main' }} />
            Enviar Recordatorio de Vacaciones
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEmpleado && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Empleado:</strong> {selectedEmpleado.nombres} {selectedEmpleado.apellidos}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Puesto:</strong> {selectedEmpleado.puesto}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Días disponibles:</strong> {selectedEmpleado.dias_vacaciones || 0}
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                sx={{ mt: 3 }}
                placeholder="Escribe el mensaje que deseas enviar al empleado..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSendNotification} 
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!mensaje.trim()}
          >
            Enviar Notificación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
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