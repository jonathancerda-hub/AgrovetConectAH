import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';

// Dummy Data
const empleadosVacaciones = [
  {
    id: 1,
    empleado: {
      id: 101,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      puesto: 'Desarrollador Frontend',
      jerarquia: 'Senior'
    },
    antiguedad_dias: 1200, // ~3.3 años
    dias_por_antiguedad: 20, // Días de vacaciones que le corresponden por año
    dias_tomados: 8,
    dias_restantes: 12,
    solicitudes_pendientes: 2,
    dias_pendientes: 5,
    ultima_solicitud: {
      fecha_solicitud: '2024-05-10',
      estado: 'Pendiente'
    },
    alertas: ['⚠️ Pocos días restantes', '🔄 Solicitud en revisión']
  },
  {
    id: 2,
    empleado: {
      id: 102,
      nombre: 'María',
      apellido: 'García',
      email: 'maria.garcia@example.com',
      puesto: 'Diseñadora UI/UX',
      jerarquia: 'Mid'
    },
    antiguedad_dias: 700, // ~1.9 años
    dias_por_antiguedad: 15,
    dias_tomados: 15,
    dias_restantes: 0,
    solicitudes_pendientes: 0,
    dias_pendientes: 0,
    ultima_solicitud: {
      fecha_solicitud: '2024-03-01',
      estado: 'Aprobada'
    },
    alertas: ['🚨 Días agotados']
  },
  {
    id: 3,
    empleado: {
      id: 103,
      nombre: 'Pedro',
      apellido: 'López',
      email: 'pedro.lopez@example.com',
      puesto: 'Gerente de Proyecto',
      jerarquia: 'Lead'
    },
    antiguedad_dias: 2000, // ~5.5 años
    dias_por_antiguedad: 25,
    dias_tomados: 5,
    dias_restantes: 20,
    solicitudes_pendientes: 0,
    dias_pendientes: 0,
    ultima_solicitud: null,
    alertas: []
  },
  {
    id: 4,
    empleado: {
      id: 104,
      nombre: 'Laura',
      apellido: 'Martínez',
      email: 'laura.martinez@example.com',
      puesto: 'QA Tester',
      jerarquia: 'Junior'
    },
    antiguedad_dias: 300, // ~0.8 años
    dias_por_antiguedad: 10,
    dias_tomados: 2,
    dias_restantes: 8,
    solicitudes_pendientes: 1,
    dias_pendientes: 3,
    ultima_solicitud: {
      fecha_solicitud: '2024-06-01',
      estado: 'Pendiente'
    },
    alertas: ['⚠️ Solicitud pendiente de aprobación']
  }
];

// Helper para calcular el color del progreso
const getProgressColor = (diasRestantes) => {
  if (diasRestantes <= 5) return 'error';
  if (diasRestantes <= 10) return 'warning';
  return 'success';
};

// Helper para obtener el color de la alerta
const getAlertChipColor = (alerta) => {
  if (alerta.includes('🚨')) return { bgcolor: '#f8d7da', color: '#721c24' }; // critico
  if (alerta.includes('⚠️')) return { bgcolor: '#fff3cd', color: '#856404' }; // alerta
  if (alerta.includes('🔄')) return { bgcolor: '#d1ecf1', color: '#0c5460' }; // info
  return { bgcolor: '#d4edda', color: '#155724' }; // ok
};

export default function ControlVacaciones() {
  const theme = useTheme();

  // Resumen de Alertas (adaptado del HTML)
  const totalEmpleados = empleadosVacaciones.length;
  const diasMinimosRestantes = empleadosVacaciones.length > 0 ? Math.min(...empleadosVacaciones.map(ev => ev.dias_restantes)) : 0;
  const antiguedadMinimaDias = empleadosVacaciones.length > 0 ? Math.min(...empleadosVacaciones.map(ev => ev.antiguedad_dias)) : 0;

  return (
    <Box sx={{ maxWidth: 1400, margin: '32px auto', px: 2 }}>
      <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: theme.spacing(1.5),
            flexWrap: 'wrap',
            p: 2,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
          }}
        >
          <Typography variant="h6" component="h4" sx={{ mb: 0, color: 'inherit' }}>
            Control de Vacaciones por Empleado
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: theme.palette.background.paper, // White background
              color: theme.palette.primary.main, // Primary color text
              '&:hover': {
                background: theme.palette.grey[100], // Lighter white on hover
              },
            }}
            startIcon={<ArrowBackIcon />}
            // onClick={() => navigate('/rrhh-dashboard')} // Assuming a navigation function
          >
            Regresar al Dashboard
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }} aria-label="control de vacaciones">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Empleado</TableCell>
                  <TableCell sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Puesto</TableCell> {/* Changed from Area to Puesto */}
                  <TableCell align="center" sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Antigüedad</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Días Disponibles</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Días Tomados</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Días Restantes</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Pendientes</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Última Solicitud</TableCell>
                  <TableCell sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Alertas</TableCell>
                  <TableCell sx={{ textTransform: 'uppercase', fontSize: '.8rem', letterSpacing: '.4px', color: 'text.secondary', whiteSpace: 'nowrap' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empleadosVacaciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No hay empleados registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  empleadosVacaciones.map((ev) => (
                    <TableRow key={ev.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', color: 'white', width: 32, height: 32, fontSize: '.8rem', fontWeight: 600 }}>
                            {ev.empleado.nombre.charAt(0)}{ev.empleado.apellido.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{ev.empleado.nombre} {ev.empleado.apellido}</Typography>
                            <Typography variant="caption" color="text.secondary">{ev.empleado.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{ev.empleado.puesto}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{ev.antiguedad_dias}</Typography>
                        <Typography variant="caption" color="text.muted">días</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{ev.dias_por_antiguedad}</Typography>
                        <Typography variant="caption" color="text.muted">por año</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{ev.dias_tomados}</Typography>
                        <Typography variant="caption" color="text.muted">utilizados</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600} color={getProgressColor(ev.dias_restantes)}>
                          {ev.dias_restantes}
                        </Typography>
                        <Box sx={{ width: 60, margin: '0 auto', mt: 1 }}>
                          {ev.dias_por_antiguedad > 0 && (
                            <LinearProgress
                              variant="determinate"
                              value={(ev.dias_restantes / ev.dias_por_antiguedad) * 100}
                              color={getProgressColor(ev.dias_restantes)}
                              sx={{ height: 8, borderRadius: '999px' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {ev.solicitudes_pendientes > 0 ? (
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="warning.main">{ev.solicitudes_pendientes}</Typography>
                            <Typography variant="caption" color="text.muted">{ev.dias_pendientes} días</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {ev.ultima_solicitud ? (
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{new Date(ev.ultima_solicitud.fecha_solicitud).toLocaleDateString()}</Typography>
                            <Typography variant="caption" color="text.muted">{ev.ultima_solicitud.estado}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Sin solicitudes</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {ev.alertas && ev.alertas.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {ev.alertas.slice(0, 3).map((alerta, i) => (
                              <Chip
                                key={i}
                                label={alerta}
                                size="small"
                                sx={{ fontSize: '.75rem', height: 'auto', '& .MuiChip-label': { py: 0.25 }, ...getAlertChipColor(alerta) }}
                              />
                            ))}
                            {ev.alertas.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{ev.alertas.length - 3} más
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Chip label="✅ Sin alertas" size="small" sx={{ fontSize: '.75rem', ...getAlertChipColor('✅') }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {ev.alertas && ev.alertas.length > 0 && (
                            <Button variant="contained" size="small" color="warning" title="Notificar al Manager">
                              <EmailIcon fontSize="small" />
                            </Button>
                          )}
                          <Button variant="outlined" size="small" color="primary" title="Ver historial">
                            <HistoryIcon fontSize="small" />
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Resumen de Alertas */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'action.hover', borderRadius: '12px' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>📊 Resumen de Alertas</Typography>
            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight={600} color="error.main">{totalEmpleados}</Typography>
                <Typography variant="caption" color="text.secondary">Total Empleados</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight={600} color="warning.main">{diasMinimosRestantes}</Typography>
                <Typography variant="caption" color="text.secondary">Días Mínimos Restantes</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight={600} color="info.main">{antiguedadMinimaDias}</Typography>
                <Typography variant="caption" color="text.secondary">Antigüedad Mínima (días)</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}