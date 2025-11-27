import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  CheckCircle as ApprobarIcon,
  Cancel as RechazarIcon,
  Visibility as VerIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import aprobacionService from '../../../services/aprobacion.service';

export default function AprobacionSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [esRRHH, setEsRRHH] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [accion, setAccion] = useState(null); // 'aprobar' o 'rechazar'
  const [comentarios, setComentarios] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await aprobacionService.getSolicitudes();
      setSolicitudes(data.solicitudes || []);
      setEsRRHH(data.esRRHH || false);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
      setError('No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (solicitud, accionParam) => {
    setSolicitudSeleccionada(solicitud);
    setAccion(accionParam);
    setComentarios('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSolicitudSeleccionada(null);
    setAccion(null);
    setComentarios('');
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      if (accion === 'rechazar' && !comentarios.trim()) {
        setError('Los comentarios son obligatorios al rechazar una solicitud');
        return;
      }

      if (accion === 'aprobar') {
        await aprobacionService.aprobarSolicitud(solicitudSeleccionada.id, comentarios);
        setSuccess('Solicitud aprobada exitosamente');
      } else {
        await aprobacionService.rechazarSolicitud(solicitudSeleccionada.id, comentarios);
        setSuccess('Solicitud rechazada');
      }

      handleCloseDialog();
      fetchSolicitudes(); // Recargar lista
    } catch (err) {
      console.error('Error al procesar solicitud:', err);
      setError(err.response?.data?.error || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase();
    switch (estadoLower) {
      case 'pendiente': return 'warning';
      case 'aprobada':
      case 'aprobado': return 'success';
      case 'rechazada':
      case 'rechazado': return 'error';
      default: return 'default';
    }
  };

  const capitalizeEstado = (estado) => {
    if (!estado) return '';
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {esRRHH ? 'Seguimiento de Solicitudes (RRHH)' : 'Aprobación de Solicitudes'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {esRRHH 
            ? 'Como usuario de RRHH, puedes ver todas las solicitudes pero no aprobarlas. Solo los supervisores directos pueden aprobar/rechazar.' 
            : 'Como supervisor, puedes aprobar o rechazar las solicitudes de tus subordinados directos.'}
        </Typography>
      </Box>

      {/* Tabla de Solicitudes */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Puesto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Área</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha Inicio</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha Fin</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Días</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha Solicitud</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No hay solicitudes {esRRHH ? 'registradas' : 'de tus subordinados'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              solicitudes.map((solicitud) => (
                <TableRow 
                  key={solicitud.id}
                  hover
                  sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                      >
                        {solicitud.nombre_empleado?.charAt(0) || <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {solicitud.nombre_empleado}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Código: {solicitud.codigo_empleado || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{solicitud.puesto || 'N/A'}</TableCell>
                  <TableCell>{solicitud.area || 'N/A'}</TableCell>
                  <TableCell>{formatFecha(solicitud.fecha_inicio)}</TableCell>
                  <TableCell>{formatFecha(solicitud.fecha_fin)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={solicitud.dias_solicitados} 
                      color="primary" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={capitalizeEstado(solicitud.estado)} 
                      color={getEstadoColor(solicitud.estado)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{formatFecha(solicitud.fecha_creacion)}</TableCell>
                  <TableCell align="center">
                    {solicitud.estado?.toLowerCase() === 'pendiente' && !esRRHH ? (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Aprobar">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleOpenDialog(solicitud, 'aprobar')}
                          >
                            <ApprobarIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDialog(solicitud, 'rechazar')}
                          >
                            <RechazarIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Tooltip title={solicitud.estado !== 'Pendiente' ? 'Ver detalles' : 'Solo supervisores pueden aprobar'}>
                        <IconButton
                          size="small"
                          disabled={esRRHH && solicitud.estado === 'Pendiente'}
                        >
                          <VerIcon />
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

      {/* Dialog de Confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {accion === 'aprobar' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
        </DialogTitle>
        <DialogContent>
          {solicitudSeleccionada && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Empleado: <strong>{solicitudSeleccionada.nombre_empleado}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Período: <strong>
                  {formatFecha(solicitudSeleccionada.fecha_inicio)} - {formatFecha(solicitudSeleccionada.fecha_fin)}
                </strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Días solicitados: <strong>{solicitudSeleccionada.dias_solicitados}</strong>
              </Typography>
              {solicitudSeleccionada.motivo && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Motivo: <em>{solicitudSeleccionada.motivo}</em>
                </Typography>
              )}
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label={accion === 'rechazar' ? 'Comentarios (obligatorio)' : 'Comentarios (opcional)'}
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            variant="outlined"
            required={accion === 'rechazar'}
            error={accion === 'rechazar' && !comentarios.trim()}
            helperText={accion === 'rechazar' && !comentarios.trim() ? 'Los comentarios son obligatorios al rechazar' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            color={accion === 'aprobar' ? 'success' : 'error'}
            disabled={submitting || (accion === 'rechazar' && !comentarios.trim())}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Procesando...' : (accion === 'aprobar' ? 'Aprobar' : 'Rechazar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
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
