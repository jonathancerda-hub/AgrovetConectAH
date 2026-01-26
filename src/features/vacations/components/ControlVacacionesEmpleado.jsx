import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
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
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import api from '../../../services/api';

const ControlVacacionesEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [openDetalle, setOpenDetalle] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [detalleVacaciones, setDetalleVacaciones] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);

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

  // Obtener áreas únicas
  const areasUnicas = useMemo(() => {
    const areas = [...new Set(empleados.map(emp => emp.area).filter(Boolean))];
    return areas.sort();
  }, [empleados]);

  // Función para determinar el estado de un empleado
  const getEstadoEmpleado = (empleado) => {
    const diasTotales = empleado.dias_totales || 0;
    const diasDisponibles = empleado.dias_disponibles || 0;
    const diasProgramados = empleado.dias_programados || 0;
    const diasSinProgramar = diasDisponibles - diasProgramados;
    
    if (diasTotales === 0) return 'Sin período';
    
    // Calcular días hasta el próximo aniversario
    let diasHastaAniversario = null;
    if (empleado.fecha_ingreso) {
      const fechaIngreso = new Date(empleado.fecha_ingreso);
      const hoy = new Date();
      
      // Próximo aniversario en el año actual o siguiente
      let proximoAniversario = new Date(hoy.getFullYear(), fechaIngreso.getMonth(), fechaIngreso.getDate());
      if (proximoAniversario < hoy) {
        proximoAniversario = new Date(hoy.getFullYear() + 1, fechaIngreso.getMonth(), fechaIngreso.getDate());
      }
      
      diasHastaAniversario = Math.ceil((proximoAniversario - hoy) / (1000 * 60 * 60 * 24));
    }
    
    // Lógica mejorada considerando días sin programar Y proximidad al aniversario
    // 🔴 CRÍTICO: Muchos días sin programar Y cerca del aniversario (< 60 días)
    if (diasSinProgramar >= 15 && diasHastaAniversario !== null && diasHastaAniversario <= 60) {
      return 'Crítico';
    }
    
    // 🟡 ADVERTENCIA: Días acumulados sin programar Y quedan varios meses (< 120 días)
    if (diasSinProgramar >= 10 && diasHastaAniversario !== null && diasHastaAniversario <= 120) {
      return 'Moderado';
    }
    
    // 🟡 ADVERTENCIA: Muchos días sin programar (independiente del tiempo)
    if (diasSinProgramar >= 20) {
      return 'Moderado';
    }
    
    // Lógica anterior por porcentaje disponible (fallback)
    const porcentaje = (diasDisponibles / diasTotales) * 100;
    
    if (porcentaje === 0) return 'Agotado';
    if (porcentaje <= 30) return 'Crítico';
    if (porcentaje <= 60) return 'Moderado';
    return 'Disponible';
  };

  // Función para filtrar empleados
  const filtrarEmpleados = () => {
    let filtrados = empleados;

    // Filtro por búsqueda
    if (searchTerm) {
      filtrados = filtrados.filter(emp => 
        emp.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.puesto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por área
    if (filtroArea) {
      filtrados = filtrados.filter(emp => emp.area === filtroArea);
    }

    // Filtro por estado
    if (filtroEstado) {
      filtrados = filtrados.filter(emp => getEstadoEmpleado(emp) === filtroEstado);
    }

    return filtrados;
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroArea('');
    setFiltroEstado('');
  };

  const getProgressColor = (porcentaje) => {
    if (porcentaje <= 30) return 'error';
    if (porcentaje <= 60) return 'warning';
    return 'success';
  };

  const exportarExcel = () => {
    try {
      // Obtener empleados filtrados
      const empleadosFiltrados = filtrarEmpleados();

      // Preparar datos para exportación
      const datosExcel = empleadosFiltrados.map((emp, index) => {
        const porcentajeDisponible = emp.dias_totales > 0 
          ? (emp.dias_disponibles / emp.dias_totales) * 100 
          : 0;
        const estado = getEstadoEmpleado(emp);

        return {
          'N°': index + 1,
          'Código': emp.codigo_empleado || '-',
          'Empleado': emp.nombre_completo,
          'Área': emp.area || '-',
          'Puesto': emp.puesto || '-',
          'Días Totales': emp.dias_totales,
          'Disponibles': emp.dias_disponibles,
          'Usados': emp.dias_usados,
          'Viernes Usados': `${emp.viernes_usados || 0}/5`,
          'Fines Semana': emp.fines_semana_usados || 0,
          'Programados': emp.dias_programados || 0,
          'Pendientes': emp.dias_pendientes || 0,
          '% Uso': `${(100 - porcentajeDisponible).toFixed(1)}%`,
          'Estado': estado
        };
      });

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);

      // Configurar anchos de columnas
      const columnWidths = [
        { wch: 5 },  // N°
        { wch: 10 }, // Código
        { wch: 30 }, // Empleado
        { wch: 25 }, // Área
        { wch: 35 }, // Puesto
        { wch: 12 }, // Días Totales
        { wch: 12 }, // Disponibles
        { wch: 10 }, // Usados
        { wch: 14 }, // Viernes Usados
        { wch: 13 }, // Fines Semana
        { wch: 13 }, // Programados
        { wch: 12 }, // Pendientes
        { wch: 10 }, // % Uso
        { wch: 12 }  // Estado
      ];
      ws['!cols'] = columnWidths;

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Control de Vacaciones');

      // Generar nombre de archivo con fecha
      const fecha = new Date().toLocaleDateString('es-PE').replace(/\//g, '-');
      const nombreArchivo = `Control_Vacaciones_${fecha}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(wb, nombreArchivo);

      console.log(`✅ Archivo ${nombreArchivo} generado exitosamente`);
    } catch (error) {
      console.error('❌ Error al exportar a Excel:', error);
      alert('Error al generar el archivo Excel. Por favor, intenta de nuevo.');
    }
  };

  const verDetalle = async (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setOpenDetalle(true);
    setLoadingDetalle(true);
    setDetalleVacaciones(null);
    setPeriodoSeleccionado(null);

    try {
      const response = await api.get(`/vacaciones/periodos-empleado/${empleado.empleado_id}`);
      setDetalleVacaciones(response.data);
      // Seleccionar el primer período por defecto (más reciente)
      if (response.data.periodos && response.data.periodos.length > 0) {
        setPeriodoSeleccionado(response.data.periodos[0].id);
      }
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
    setPeriodoSeleccionado(null);
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
          <Grid container spacing={2} alignItems="center">
            {/* Búsqueda por nombre */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
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
            </Grid>

            {/* Filtro por Área */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Área</InputLabel>
                <Select
                  value={filtroArea}
                  label="Área"
                  onChange={(e) => setFiltroArea(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todas las áreas</em>
                  </MenuItem>
                  {areasUnicas.map(area => (
                    <MenuItem key={area} value={area}>{area}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro por Estado */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtroEstado}
                  label="Estado"
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todos los estados</em>
                  </MenuItem>
                  <MenuItem value="Crítico">🔴 Crítico</MenuItem>
                  <MenuItem value="Moderado">🟡 Moderado</MenuItem>
                  <MenuItem value="Disponible">🟢 Disponible</MenuItem>
                  <MenuItem value="Agotado">⚫ Agotado</MenuItem>
                  <MenuItem value="Sin período">⚪ Sin período</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Botón Limpiar */}
            {(searchTerm || filtroArea || filtroEstado) && (
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={limpiarFiltros}
                  sx={{ height: 40 }}
                >
                  Limpiar filtros
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ tableLayout: 'fixed', minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 600, width: '15%', maxWidth: 200 }}>Empleado</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '8%', maxWidth: 100, fontSize: '0.875rem' }}>Área</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%', maxWidth: 150 }}>Puesto</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Días Totales</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Disponibles</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Usados</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Programados
                  <Tooltip title="Días de vacaciones aprobadas que aún no se han gozado (futuras o en curso)" arrow>
                    <InfoIcon sx={{ fontSize: 16, color: 'info.main', cursor: 'help' }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Pendientes
                  <Tooltip title="Días en solicitudes que están esperando aprobación" arrow>
                    <InfoIcon sx={{ fontSize: 16, color: 'warning.main', cursor: 'help' }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">% Uso</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleadosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
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
                
                const estado = getEstadoEmpleado(empleado);
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
                    <TableCell sx={{ width: '15%', maxWidth: 200 }}>
                      <Typography fontWeight={600}>{empleado.nombre_completo}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: '8%', maxWidth: 100, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {empleado.area || '-'}
                    </TableCell>
                    <TableCell sx={{ width: '12%', maxWidth: 150, fontSize: '0.875rem' }}>{empleado.puesto || '-'}</TableCell>
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
                    <TableCell align="center">
                      <Chip 
                        label={empleado.dias_programados || 0} 
                        color="info" 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={empleado.dias_pendientes || 0} 
                        color="warning" 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
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
                      {estado === 'Agotado' ? (
                        <Chip 
                          label="Agotado" 
                          color="error" 
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : estado === 'Crítico' ? (
                        <Tooltip title="Urgente: Debe tomar vacaciones">
                          <Chip 
                            icon={<WarningIcon />}
                            label="Urgente" 
                            color="error" 
                            size="small"
                          />
                        </Tooltip>
                      ) : estado === 'Moderado' ? (
                        <Tooltip title="Debe programar vacaciones">
                          <Chip 
                            icon={<WarningIcon />}
                            label="Moderado" 
                            color="warning" 
                            size="small"
                          />
                        </Tooltip>
                      ) : estado === 'Disponible' ? (
                        <Chip 
                          icon={<CheckIcon />}
                          label="Disponible" 
                          color="success" 
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Sin período" 
                          color="default" 
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

      {/* Dialog de Detalle - Períodos Vacacionales */}
      <Dialog open={openDetalle} onClose={cerrarDetalle} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon color="primary" />
            <Box sx={{ flex: 1 }}>
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
              {/* Selector de Período */}
              {detalleVacaciones.periodos && detalleVacaciones.periodos.length > 0 ? (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      value={periodoSeleccionado || ''}
                      onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                      displayEmpty
                    >
                      {detalleVacaciones.periodos.map((periodo) => (
                        <MenuItem key={periodo.id} value={periodo.id}>
                          Período {periodo.anio_generacion}
                          {periodo.fecha_inicio_periodo && periodo.fecha_fin_periodo && (
                            ` (${new Date(periodo.fecha_inicio_periodo).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - ${new Date(periodo.fecha_fin_periodo).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })})`
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Detalle del Período Seleccionado */}
                  {(() => {
                    const periodo = detalleVacaciones.periodos.find(p => p.id === periodoSeleccionado);
                    if (!periodo) return null;

                    return (
                      <Box>
                        {/* Resumen del Período */}
                        <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'background.default' }}>
                          <Grid container spacing={1.5} alignItems="center">
                            <Grid item xs={2}>
                              <Typography variant="caption" color="text.secondary" display="block">Días Totales</Typography>
                              <Typography variant="h6" color="primary">{periodo.dias_totales}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption" color="text.secondary" display="block">Disponibles</Typography>
                              <Typography variant="h6" color="success.main">{periodo.dias_disponibles}</Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                              <Typography variant="caption" color="text.secondary" display="block">Usados</Typography>
                              <Typography variant="h6" color="error.main">{periodo.dias_usados}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption" color="text.secondary" display="block">Viernes usados</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {periodo.viernes_usados || 0} de 5
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption" color="text.secondary" display="block">Fines de semana</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {periodo.fines_semana_usados || 0} usados
                              </Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                              <Typography variant="caption" color="text.secondary" display="block">Estado</Typography>
                              <Chip 
                                label={periodo.estado} 
                                size="small" 
                                color={periodo.estado === 'activo' ? 'success' : 'default'}
                              />
                            </Grid>
                            {periodo.tiene_bloque_7dias && (
                              <Grid item xs={1}>
                                <Chip 
                                  label="✓ 7d" 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Paper>

                        {/* Solicitudes del Período */}
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                          Solicitudes de este período:
                        </Typography>

                        {periodo.solicitudes && periodo.solicitudes.length > 0 ? (
                          <Stack spacing={1}>
                            {periodo.solicitudes.map((solicitud) => (
                              <Paper key={solicitud.id} variant="outlined" sx={{ p: 1.5 }}>
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                  <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                                    <Typography variant="body2" fontWeight={500}>
                                      📅 {new Date(solicitud.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - 
                                      {new Date(solicitud.fecha_fin).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </Typography>
                                    <Chip size="small" label={`${solicitud.dias_solicitados} días`} color="primary" />
                                    {solicitud.dias_especiales && solicitud.dias_especiales.viernes > 0 && (
                                      <Typography variant="caption" color="info.main">
                                        🗓️ {solicitud.dias_especiales.viernes} viernes
                                      </Typography>
                                    )}
                                    {solicitud.dias_especiales && solicitud.dias_especiales.fines_semana > 0 && (
                                      <Typography variant="caption" color="warning.main">
                                        📅 {solicitud.dias_especiales.fines_semana} f.s.
                                      </Typography>
                                    )}
                                  </Stack>
                                  <Chip 
                                    size="small" 
                                    label={solicitud.estado} 
                                    color={
                                      solicitud.estado === 'aprobada' ? 'success' :
                                      solicitud.estado === 'pendiente' ? 'warning' :
                                      solicitud.estado === 'rechazada' ? 'error' : 'default'
                                    }
                                  />
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>
                        ) : (
                          <Alert severity="info">No hay solicitudes registradas en este período</Alert>
                        )}
                      </Box>
                    );
                  })()}
                </>
              ) : (
                <Alert severity="info">
                  Este empleado aún no tiene períodos vacacionales generados.
                  {detalleVacaciones.empleado?.fecha_ingreso && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Fecha de ingreso: {new Date(detalleVacaciones.empleado.fecha_ingreso).toLocaleDateString('es-ES')}
                    </Typography>
                  )}
                </Alert>
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
