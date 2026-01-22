import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import api from '../../../services/api';

const ControlVacacionesEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDetalle, setOpenDetalle] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [detalleVacaciones, setDetalleVacaciones] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/vacaciones/control-rrhh');
      
      setEmpleados(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar el control de vacaciones');
    } finally {
      setLoading(false);
    }
  };

  const filtrarEmpleados = () => {
    if (!searchTerm) return empleados;
    
    return empleados.filter(emp => 
      emp.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.puesto?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getProgressColor = (porcentaje) => {
    if (porcentaje <= 30) return 'error';
    if (porcentaje <= 60) return 'warning';
    return 'success';
  };

  const exportarExcel = () => {
    // Aquí implementarías la exportación a Excel
    console.log('Exportar a Excel');
  };

  const verDetalle = async (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setOpenDetalle(true);
    setLoadingDetalle(true);
    setDetalleVacaciones(null);

    try {
      const response = await api.get(`/vacaciones/detalle-empleado/${empleado.empleado_id}`);
      setDetalleVacaciones(response.data);
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      setError('Error al cargar el detalle de vacaciones');
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarDetalle = () => {
    setOpenDetalle(false);
    setEmpleadoSeleccionado(null);
    setDetalleVacaciones(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const empleadosFiltrados = filtrarEmpleados();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Control de Vacaciones por Empleado
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Actualizar">
            <IconButton onClick={cargarDatos} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar a Excel">
            <IconButton onClick={exportarExcel} color="success">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, área o puesto..."
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
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Área</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Puesto</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Días Totales</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Disponibles</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Usados</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Pendientes</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">% Uso</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleadosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography color="text.secondary" py={3}>
                    No se encontraron empleados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              empleadosFiltrados.map((empleado) => {
                const porcentajeDisponible = empleado.dias_totales > 0 
                  ? (empleado.dias_disponibles / empleado.dias_totales) * 100 
                  : 0;
                
                const necesitaVacaciones = porcentajeDisponible > 70;
                const enRiesgo = porcentajeDisponible > 90;

                return (
                  <TableRow 
                    key={empleado.empleado_id}
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'action.hover' }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>{empleado.nombre_completo}</Typography>
                    </TableCell>
                    <TableCell>{empleado.area || '-'}</TableCell>
                    <TableCell>{empleado.puesto || '-'}</TableCell>
                    <TableCell align="center">
                      <Chip label={empleado.dias_totales} color="primary" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={empleado.dias_disponibles} 
                        color={getProgressColor(porcentajeDisponible)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">{empleado.dias_usados}</TableCell>
                    <TableCell align="center">{empleado.dias_pendientes}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 - porcentajeDisponible}
                            color={getProgressColor(porcentajeDisponible)}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {Math.round(100 - porcentajeDisponible)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {enRiesgo ? (
                        <Tooltip title="Urgente: Debe tomar vacaciones">
                          <Chip 
                            icon={<WarningIcon />}
                            label="Urgente" 
                            color="error" 
                            size="small"
                          />
                        </Tooltip>
                      ) : necesitaVacaciones ? (
                        <Tooltip title="Debe programar vacaciones">
                          <Chip 
                            icon={<WarningIcon />}
                            label="Pendiente" 
                            color="warning" 
                            size="small"
                          />
                        </Tooltip>
                      ) : (
                        <Chip 
                          icon={<CheckIcon />}
                          label="OK" 
                          color="success" 
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle de vacaciones">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => verDetalle(empleado)}
                        >
                          <VisibilityIcon fontSize="small" />
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

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          Total de empleados: {empleadosFiltrados.length}
        </Typography>
      </Box>

      {/* Dialog de Detalle */}
      <Dialog open={openDetalle} onClose={cerrarDetalle} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon color="primary" />
            <Box>
              <Typography variant="h6">Detalle de Vacaciones</Typography>
              {empleadoSeleccionado && (
                <Typography variant="body2" color="text.secondary">
                  {empleadoSeleccionado.nombre_completo}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loadingDetalle ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : detalleVacaciones ? (
            <Box>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip 
                  label={`Total tomado: ${detalleVacaciones.total_dias_tomados} días`}
                  color="primary"
                />
                <Chip 
                  label={`${detalleVacaciones.total_registros} períodos`}
                  color="info"
                />
              </Stack>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Vacaciones por Mes/Año:
              </Typography>

              {detalleVacaciones.detalle_por_mes && detalleVacaciones.detalle_por_mes.length > 0 ? (
                detalleVacaciones.detalle_por_mes.map((mes, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="body1" fontWeight={600}>
                          {mes.mes_nombre}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={`${mes.total_dias} días`} 
                          color="success"
                        />
                        {mes.total_viernes > 0 && (
                          <Chip 
                            size="small" 
                            label={`${mes.total_viernes} viernes`} 
                            color="info"
                            variant="outlined"
                          />
                        )}
                        {mes.total_fines_semana > 0 && (
                          <Chip 
                            size="small" 
                            label={`${mes.total_fines_semana} fin de semana`} 
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          ({mes.solicitudes.length} período{mes.solicitudes.length !== 1 ? 's' : ''})
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      {mes.solicitudes.map((solicitud, idx) => (
                        <Box key={solicitud.id} sx={{ mb: idx < mes.solicitudes.length - 1 ? 2 : 0 }}>
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="body2" fontWeight={500}>
                                📅 {new Date(solicitud.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(solicitud.fecha_fin).toLocaleDateString('es-ES')}
                              </Typography>
                              <Chip size="small" label={`${solicitud.dias_solicitados} días`} />
                            </Stack>
                            
                            {solicitud.dias_especiales && (
                              <Stack direction="row" spacing={1} sx={{ ml: 3 }}>
                                {solicitud.dias_especiales.viernes > 0 && (
                                  <Typography variant="caption" color="info.main">
                                    🗓️ {solicitud.dias_especiales.viernes} viernes
                                  </Typography>
                                )}
                                {solicitud.dias_especiales.sabados > 0 && (
                                  <Typography variant="caption" color="warning.main">
                                    📆 {solicitud.dias_especiales.sabados} sábados
                                  </Typography>
                                )}
                                {solicitud.dias_especiales.domingos > 0 && (
                                  <Typography variant="caption" color="warning.main">
                                    📆 {solicitud.dias_especiales.domingos} domingos
                                  </Typography>
                                )}
                                {(solicitud.dias_especiales.sabados + solicitud.dias_especiales.domingos) > 0 && (
                                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    (Total fin de semana: {solicitud.dias_especiales.finesDeSemana})
                                  </Typography>
                                )}
                              </Stack>
                            )}
                            
                            {solicitud.motivo && (
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 3, display: 'block' }}>
                                💬 Motivo: {solicitud.motivo}
                              </Typography>
                            )}
                          </Stack>
                          {idx < mes.solicitudes.length - 1 && <Divider sx={{ mt: 2 }} />}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Alert severity="info">No hay vacaciones registradas</Alert>
              )}
            </Box>
          ) : (
            <Alert severity="error">No se pudo cargar el detalle</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDetalle}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlVacacionesEmpleado;
