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
  Person as PersonIcon,
  Warning as WarningIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import aprobacionService from '../../../services/aprobacion.service';

export default function AprobacionSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [esRRHH, setEsRRHH] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetalleDialog, setOpenDetalleDialog] = useState(false); // Modal de detalles
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

  const handleOpenDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setOpenDetalleDialog(true);
  };

  const handleCloseDetalle = () => {
    setOpenDetalleDialog(false);
    setSolicitudSeleccionada(null);
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {solicitud.nombre_empleado}
                          </Typography>
                          {solicitud.conflictos_equipo && solicitud.conflictos_equipo.length > 0 && (
                            <Tooltip 
                              title={`${solicitud.conflictos_equipo.length} miembro(s) del equipo con vacaciones superpuestas`}
                              arrow
                            >
                              <Chip
                                icon={<WarningIcon />}
                                label={solicitud.conflictos_equipo.length}
                                size="small"
                                color="warning"
                                sx={{ height: 20, fontSize: '0.7rem', ml: 0.5 }}
                              />
                            </Tooltip>
                          )}
                        </Box>
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
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetalle(solicitud)}
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

      {/* Dialog de Detalles */}
      <Dialog open={openDetalleDialog} onClose={handleCloseDetalle} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles de la Solicitud
        </DialogTitle>
        <DialogContent>
          {solicitudSeleccionada && (
            <Box sx={{ pt: 2 }}>
              {/* Información del Empleado */}
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  👤 Información del Empleado
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nombre</Typography>
                    <Typography variant="body2" fontWeight="medium">{solicitudSeleccionada.nombre_empleado}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Código</Typography>
                    <Typography variant="body2" fontWeight="medium">{solicitudSeleccionada.codigo_empleado || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Puesto</Typography>
                    <Typography variant="body2">{solicitudSeleccionada.puesto || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Área</Typography>
                    <Typography variant="body2">{solicitudSeleccionada.area || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Detalles de la Solicitud */}
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📅 Detalles de Vacaciones
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de Inicio</Typography>
                    <Typography variant="body2" fontWeight="medium">{formatFecha(solicitudSeleccionada.fecha_inicio)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de Fin</Typography>
                    <Typography variant="body2" fontWeight="medium">{formatFecha(solicitudSeleccionada.fecha_fin)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total de Días</Typography>
                    <Typography variant="body2" fontWeight="medium">{solicitudSeleccionada.dias_solicitados} días</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estado</Typography>
                    <Chip 
                      label={capitalizeEstado(solicitudSeleccionada.estado)} 
                      color={getEstadoColor(solicitudSeleccionada.estado)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Motivo */}
              {solicitudSeleccionada.motivo && (
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    💬 Motivo de la Solicitud
                  </Typography>
                  <Typography variant="body2">{solicitudSeleccionada.motivo}</Typography>
                </Paper>
              )}

              {/* Conflictos con el Equipo */}
              {solicitudSeleccionada.conflictos_equipo && solicitudSeleccionada.conflictos_equipo.length > 0 && (
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <WarningIcon color="warning" />
                    <Typography variant="subtitle2" color="warning.dark" fontWeight={600}>
                      ⚠️ Conflictos de Vacaciones Detectados
                    </Typography>
                  </Box>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Los siguientes miembros del equipo también tienen vacaciones en fechas superpuestas:
                    </Typography>
                  </Alert>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {solicitudSeleccionada.conflictos_equipo.map((conflicto, index) => (
                      <Paper key={index} elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <GroupIcon fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight={600}>
                            {conflicto.nombre_empleado}
                          </Typography>
                          <Chip 
                            label={conflicto.estado === 'aprobada' ? 'Aprobada' : 'Pendiente'} 
                            size="small"
                            color={conflicto.estado === 'aprobada' ? 'success' : 'warning'}
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, mt: 1 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Código</Typography>
                            <Typography variant="body2">{conflicto.codigo_empleado}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Puesto</Typography>
                            <Typography variant="body2">{conflicto.puesto || 'N/A'}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Días</Typography>
                            <Typography variant="body2">{conflicto.dias_solicitados} días</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">Fechas de vacaciones</Typography>
                          <Typography variant="body2">
                            Del {formatFecha(conflicto.fecha_inicio)} al {formatFecha(conflicto.fecha_fin)}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Información de Aprobación */}
              {solicitudSeleccionada.estado !== 'pendiente' && solicitudSeleccionada.estado !== 'Pendiente' && (
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    ✅ Información de {solicitudSeleccionada.estado === 'aprobada' || solicitudSeleccionada.estado === 'Aprobada' ? 'Aprobación' : 'Rechazo'}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {solicitudSeleccionada.nombre_aprobador && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {solicitudSeleccionada.estado === 'aprobada' || solicitudSeleccionada.estado === 'Aprobada' ? 'Aprobado por' : 'Rechazado por'}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">{solicitudSeleccionada.nombre_aprobador}</Typography>
                      </Box>
                    )}
                    {solicitudSeleccionada.fecha_aprobacion && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">Fecha</Typography>
                        <Typography variant="body2" fontWeight="medium">{formatFecha(solicitudSeleccionada.fecha_aprobacion)}</Typography>
                      </Box>
                    )}
                  </Box>
                  {solicitudSeleccionada.observaciones_aprobador && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                      <Typography variant="body2">{solicitudSeleccionada.observaciones_aprobador}</Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Fechas del Sistema */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📆 Fechas del Sistema
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {solicitudSeleccionada.fecha_creacion && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Fecha de Solicitud</Typography>
                      <Typography variant="body2">{formatFecha(solicitudSeleccionada.fecha_creacion)}</Typography>
                    </Box>
                  )}
                  {solicitudSeleccionada.fecha_aprobacion && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Fecha de Decisión</Typography>
                      <Typography variant="body2">{formatFecha(solicitudSeleccionada.fecha_aprobacion)}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetalle}>Cerrar</Button>
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
