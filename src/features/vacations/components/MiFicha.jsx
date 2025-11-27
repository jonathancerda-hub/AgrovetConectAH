import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import { empleadosService } from '../../../services/empleados.service';

const MiFicha = ({ currentUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosEmpleado = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 MiFicha - currentUser:', currentUser);
        console.log('🔍 MiFicha - empleadoId:', currentUser?.empleadoId);
        
        if (!currentUser?.empleadoId) {
          throw new Error('No se encontró el ID del empleado');
        }

        const data = await empleadosService.getById(currentUser.empleadoId);
        setEmpleado(data);
      } catch (err) {
        console.error('Error al cargar datos del empleado:', err);
        setError(err.message || 'Error al cargar los datos del empleado');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEmpleado();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const calcularAntiguedad = (fechaIngreso) => {
    if (!fechaIngreso) return 'N/A';
    
    const inicio = new Date(fechaIngreso);
    const hoy = new Date();
    
    let años = hoy.getFullYear() - inicio.getFullYear();
    let meses = hoy.getMonth() - inicio.getMonth();
    
    if (meses < 0) {
      años--;
      meses += 12;
    }
    
    return `${años} años, ${meses} meses`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!empleado) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        No se encontraron datos del empleado
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header con información básica */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              <PersonIcon sx={{ fontSize: '4rem' }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {empleado.nombres} {empleado.apellidos}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <WorkIcon color="primary" />
              <Typography variant="h6" color="text.secondary">
                {empleado.puesto || 'Sin puesto asignado'}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <BadgeIcon color="primary" />
              <Typography variant="body1" color="text.secondary">
                {empleado.area || 'Sin área asignada'}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="body2" align="center">
                Código de Empleado
              </Typography>
              <Typography variant="h5" align="center" fontWeight="bold">
                {empleado.codigo_empleado || 'N/A'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs de información */}
      <Paper elevation={3}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Resumen" />
          <Tab label="Boletas de Pago" />
          <Tab label="Documentos" />
          <Tab label="Bitácora" />
          <Tab label="Talento" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Información Personal */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Personal
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nombres Completos
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.nombres} {empleado.apellidos}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.email || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Código de Empleado
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.codigo_empleado || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              {/* Información Laboral */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Laboral
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cargo
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.puesto || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Área
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.area || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo de Contrato
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.tipo_contrato || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Supervisor
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {empleado.supervisor_nombre || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Ingreso
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon color="primary" fontSize="small" />
                    <Typography variant="body1" fontWeight="500">
                      {formatearFecha(empleado.fecha_ingreso)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Antigüedad
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {calcularAntiguedad(empleado.fecha_ingreso)}
                  </Typography>
                </Box>
              </Grid>

              {/* Información de Vacaciones */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información de Vacaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
                      <Typography variant="body2" align="center">
                        Días Disponibles
                      </Typography>
                      <Typography variant="h4" align="center" fontWeight="bold">
                        {empleado.dias_vacaciones || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'info.light', color: 'white' }}>
                      <Typography variant="body2" align="center">
                        Estado
                      </Typography>
                      <Typography variant="h6" align="center" fontWeight="bold">
                        {empleado.activo ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Módulo de Boletas de Pago en desarrollo
              </Typography>
            </Box>
          )}

          {tabValue === 2 && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Módulo de Documentos en desarrollo
              </Typography>
            </Box>
          )}

          {tabValue === 3 && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Módulo de Bitácora en desarrollo
              </Typography>
            </Box>
          )}

          {tabValue === 4 && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Módulo de Talento en desarrollo
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MiFicha;
