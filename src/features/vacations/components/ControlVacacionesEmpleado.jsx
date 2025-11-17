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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import api from '../../../services/api';

const ControlVacacionesEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
            </TableRow>
          </TableHead>
          <TableBody>
            {empleadosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
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
    </Box>
  );
};

export default ControlVacacionesEmpleado;
