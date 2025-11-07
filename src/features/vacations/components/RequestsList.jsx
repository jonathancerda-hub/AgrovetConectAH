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
  Grid
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { vacacionesService } from '../../../services/vacaciones.service';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const RequestsList = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

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
                      <IconButton size="small" color="primary">
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
    </Box>
  );
};

export default RequestsList;
