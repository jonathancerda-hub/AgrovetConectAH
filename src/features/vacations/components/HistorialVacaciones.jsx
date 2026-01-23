import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  Cancel as CancelIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import moment from 'moment';
import { empleadosService } from '../../../services/empleados.service';
import api from '../../../services/api';

moment.locale('es');

const HistorialVacaciones = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);

  // Filtros
  const [filtros, setFiltros] = useState({
    empleadoId: '',
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    cargarHistorial();
  }, [page, rowsPerPage, filtros]);

  const cargarEmpleados = async () => {
    try {
      const data = await empleadosService.getAll();
      setEmpleados(data || []);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setEmpleados([]);
    }
  };

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir query params
      const params = {
        page: page + 1, // Backend usa páginas basadas en 1
        limit: rowsPerPage
      };

      if (filtros.empleadoId) params.empleadoId = filtros.empleadoId;
      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
      if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;

      const response = await api.get('/vacaciones/historial', { params });

      // Manejar respuesta exitosa incluso si no hay datos
      if (response.data) {
        setSolicitudes(response.data.data || []);
        setTotalSolicitudes(response.data.total || 0);
      } else {
        setSolicitudes([]);
        setTotalSolicitudes(0);
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
      // Solo mostrar error si es un error de red o servidor, no si simplemente no hay datos
      if (err.response && err.response.status >= 500) {
        setError('Error al cargar el historial de vacaciones. Por favor, intenta de nuevo.');
      } else if (!err.response) {
        setError('No se pudo conectar con el servidor.');
      } else {
        // Si es un error 404 o similar, mostrar que no hay datos pero no error
        setSolicitudes([]);
        setTotalSolicitudes(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPage(0); // Resetear a primera página cuando cambian filtros
  };

  const limpiarFiltros = () => {
    setFiltros({
      empleadoId: '',
      estado: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setPage(0);
  };

  const getEstadoChip = (estado) => {
    const estadoConfig = {
      Aprobado: { color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
      Pendiente: { color: 'warning', icon: <HourglassIcon sx={{ fontSize: 16 }} /> },
      Rechazado: { color: 'error', icon: <CancelIcon sx={{ fontSize: 16 }} /> }
    };

    const config = estadoConfig[estado] || { color: 'default', icon: null };

    return (
      <Chip
        label={estado}
        color={config.color}
        size="small"
        icon={config.icon}
      />
    );
  };

  const exportarExcel = () => {
    try {
      // Preparar datos para exportación con todas las solicitudes cargadas
      const datosExcel = solicitudes.map((sol, index) => ({
        'N°': index + 1,
        'ID': sol.solicitud_id,
        'Empleado': sol.nombre_completo,
        'Área': sol.area || '-',
        'Puesto': sol.puesto || '-',
        'Fecha Inicio': moment(sol.fecha_inicio).format('DD/MM/YYYY'),
        'Fecha Fin': moment(sol.fecha_fin).format('DD/MM/YYYY'),
        'Días Solicitados': sol.dias_solicitados,
        'Estado': sol.estado,
        'Fecha Solicitud': moment(sol.fecha_creacion).format('DD/MM/YYYY HH:mm'),
        'Fecha Aprobación': sol.fecha_aprobacion 
          ? moment(sol.fecha_aprobacion).format('DD/MM/YYYY HH:mm')
          : '-',
        'Aprobado Por': sol.nombre_aprobador || '-',
        'Observaciones': sol.observaciones_aprobador || '-'
      }));

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);

      // Configurar anchos de columnas para mejor legibilidad
      const columnWidths = [
        { wch: 5 },  // N°
        { wch: 8 },  // ID
        { wch: 30 }, // Empleado
        { wch: 25 }, // Área
        { wch: 35 }, // Puesto
        { wch: 12 }, // Fecha Inicio
        { wch: 12 }, // Fecha Fin
        { wch: 15 }, // Días Solicitados
        { wch: 12 }, // Estado
        { wch: 18 }, // Fecha Solicitud
        { wch: 18 }, // Fecha Aprobación
        { wch: 25 }, // Aprobado Por
        { wch: 40 }  // Observaciones
      ];
      ws['!cols'] = columnWidths;

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Historial Vacaciones');

      // Generar información adicional en una segunda hoja
      const resumen = [
        { 'Descripción': 'Total de Solicitudes', 'Valor': totalSolicitudes },
        { 'Descripción': 'Solicitudes Mostradas', 'Valor': solicitudes.length },
        { 'Descripción': 'Fecha de Exportación', 'Valor': moment().format('DD/MM/YYYY HH:mm') },
        { 'Descripción': 'Filtros Aplicados', 'Valor': '' },
        { 'Descripción': '  - Empleado', 'Valor': filtros.empleadoId ? empleados.find(e => e.id === parseInt(filtros.empleadoId))?.nombres + ' ' + empleados.find(e => e.id === parseInt(filtros.empleadoId))?.apellidos : 'Todos' },
        { 'Descripción': '  - Estado', 'Valor': filtros.estado || 'Todos' },
        { 'Descripción': '  - Fecha Inicio Desde', 'Valor': filtros.fechaInicio || 'Sin filtro' },
        { 'Descripción': '  - Fecha Inicio Hasta', 'Valor': filtros.fechaFin || 'Sin filtro' }
      ];

      const wsResumen = XLSX.utils.json_to_sheet(resumen);
      wsResumen['!cols'] = [{ wch: 30 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

      // Generar nombre de archivo con fecha y hora
      const fecha = moment().format('YYYY-MM-DD_HHmm');
      const nombreArchivo = `Historial_Vacaciones_${fecha}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(wb, nombreArchivo);

      console.log(`✅ Archivo ${nombreArchivo} generado exitosamente con ${datosExcel.length} registros`);
    } catch (error) {
      console.error('❌ Error al exportar a Excel:', error);
      alert('Error al generar el archivo Excel. Por favor, intenta de nuevo.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Historial de Vacaciones
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros de Búsqueda
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Empleado"
              value={filtros.empleadoId}
              onChange={(e) => handleFiltroChange('empleadoId', e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todos</MenuItem>
              {empleados.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.nombres} {emp.apellidos}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Estado"
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Aprobado">Aprobado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Rechazado">Rechazado</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Fecha Inicio Desde"
              value={filtros.fechaInicio}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 180 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Fecha Inicio Hasta"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 180 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Buscar" arrow>
                <IconButton
                  color="primary"
                  onClick={() => cargarHistorial()}
                  sx={{ border: 1, borderColor: 'primary.main' }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Limpiar Filtros" arrow>
                <IconButton
                  color="primary"
                  onClick={limpiarFiltros}
                  sx={{ border: 1, borderColor: 'primary.main' }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Actualizar" arrow>
                <IconButton
                  color="primary"
                  onClick={() => cargarHistorial()}
                  sx={{ border: 1, borderColor: 'primary.main' }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar Excel" arrow>
                <IconButton
                  color="success"
                  onClick={exportarExcel}
                  sx={{ border: 1, borderColor: 'success.main' }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Área</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Puesto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha Inicio</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha Fin</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Días</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha Solicitud</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solicitudes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                        No se encontraron solicitudes de vacaciones
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  solicitudes.map((solicitud) => (
                    <TableRow 
                      key={solicitud.solicitud_id} 
                      hover
                      sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>{solicitud.solicitud_id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {solicitud.nombre_completo}
                      </TableCell>
                      <TableCell>{solicitud.area}</TableCell>
                      <TableCell>{solicitud.puesto}</TableCell>
                      <TableCell>
                        {moment(solicitud.fecha_inicio).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {moment(solicitud.fecha_fin).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={solicitud.dias_solicitados}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {getEstadoChip(solicitud.estado)}
                      </TableCell>
                      <TableCell>
                        {moment(solicitud.created_at).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalSolicitudes}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      )}
    </Box>
  );
};

export default HistorialVacaciones;
