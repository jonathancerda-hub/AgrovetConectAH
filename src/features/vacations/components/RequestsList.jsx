import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { vacacionesService } from '../../../services/vacaciones.service';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const RequestsList = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetalleDialog, setOpenDetalleDialog] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleOpenDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setOpenDetalleDialog(true);
  };

  const handleCloseDetalle = () => {
    setOpenDetalleDialog(false);
    setSolicitudSeleccionada(null);
  };

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await vacacionesService.obtenerMisSolicitudes();
      console.log('Solicitudes recibidas:', data);
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
      setError('No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoChip = (estado) => {
    const estados = {
      'Pendiente': { color: 'warning', icon: <PendingIcon fontSize="small" /> },
      'Aprobado': { color: 'success', icon: <CheckIcon fontSize="small" /> },
      'Rechazado': { color: 'error', icon: <CancelIcon fontSize="small" /> },
      'Cancelado': { color: 'default', icon: <CancelIcon fontSize="small" /> }
    };

    const config = estados[estado] || estados['Pendiente'];
    
    return (
      <Chip
        icon={config.icon}
        label={estado}
        color={config.color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes solicitudes de vacaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea tu primera solicitud usando el formulario
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Mis Solicitudes de Vacaciones
      </Typography>

      <Stack spacing={2}>
        {solicitudes.map((solicitud) => (
          <Card 
            key={solicitud.id} 
            sx={{ 
              transition: 'all 0.2s',
              '&:hover': { 
                boxShadow: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    {getEstadoChip(solicitud.estado)}
                    <Typography variant="caption" color="text.secondary">
                      Solicitud #{solicitud.id}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight={600}>
                        Fechas de Vacaciones
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Del {moment(solicitud.fecha_inicio).format('DD MMM YYYY')} al{' '}
                      {moment(solicitud.fecha_fin).format('DD MMM YYYY')}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight={700}>
                      {solicitud.dias_solicitados}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      días solicitados
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                    <Tooltip title="Ver detalles">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDetalle(solicitud)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {solicitud.estado === 'Pendiente' && (
                      <Tooltip title="Cancelar">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              {solicitud.comentarios && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Motivo:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {solicitud.comentarios}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ClockIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">
                  Solicitado el {moment(solicitud.created_at).format('DD/MM/YYYY [a las] HH:mm')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Dialog de detalles */}
      <Dialog
        open={openDetalleDialog}
        onClose={handleCloseDetalle}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon color="primary" />
            <Typography variant="h6" component="span">
              Detalles de la Solicitud
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {solicitudSeleccionada && (
            <Stack spacing={3}>
              {/* Información del Empleado */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Información del Empleado
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {solicitudSeleccionada.nombre_completo || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Código de Empleado
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {solicitudSeleccionada.codigo_empleado || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Puesto
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {solicitudSeleccionada.puesto || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Área
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {solicitudSeleccionada.area || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Detalles de Vacaciones */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Detalles de Vacaciones
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {moment(solicitudSeleccionada.fecha_inicio).format('DD/MM/YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Fin
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {moment(solicitudSeleccionada.fecha_fin).format('DD/MM/YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Total de Días
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {solicitudSeleccionada.dias_solicitados} días
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Estado
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {getEstadoChip(solicitudSeleccionada.estado)}
                    </Box>
                  </Grid>
                  {solicitudSeleccionada.comentarios && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Motivo
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {solicitudSeleccionada.comentarios}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Solicitud
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {moment(solicitudSeleccionada.created_at).format('DD/MM/YYYY [a las] HH:mm')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Información de Aprobación */}
              {(solicitudSeleccionada.estado === 'Aprobado' || solicitudSeleccionada.estado === 'Rechazado') && (
                <>
                  <Divider />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CheckIcon color={solicitudSeleccionada.estado === 'Aprobado' ? 'success' : 'error'} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Información de {solicitudSeleccionada.estado === 'Aprobado' ? 'Aprobación' : 'Rechazo'}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          {solicitudSeleccionada.estado === 'Aprobado' ? 'Aprobado por' : 'Rechazado por'}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {solicitudSeleccionada.aprobador_nombre || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Fecha de {solicitudSeleccionada.estado === 'Aprobado' ? 'Aprobación' : 'Rechazo'}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {solicitudSeleccionada.fecha_aprobacion 
                            ? moment(solicitudSeleccionada.fecha_aprobacion).format('DD/MM/YYYY [a las] HH:mm')
                            : 'N/A'}
                        </Typography>
                      </Grid>
                      {solicitudSeleccionada.observaciones && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            Observaciones
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {solicitudSeleccionada.observaciones}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetalle} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestsList;
