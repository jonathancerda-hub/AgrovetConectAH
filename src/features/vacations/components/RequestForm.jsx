import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  BeachAccess as VacationIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  CalendarMonth as CalendarIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment/locale/es';
import vacacionesService from '../../../services/vacaciones.service';

moment.locale('es');

const RequestForm = ({ onSuccess }) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [motivo, setMotivo] = useState('');
  
  const [validando, setValidando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [validacion, setValidacion] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [solicitudesExistentes, setSolicitudesExistentes] = useState([]);
  
  // Estados para dialogs y snackbars
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialogExito, setDialogExito] = useState(false);
  const [dialogError, setDialogError] = useState({ open: false, message: '' });
  
  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);
  
  const cargarDatos = async () => {
    try {
      const [periodosData, resumenData, solicitudesData] = await Promise.all([
        vacacionesService.obtenerPeriodos().catch(() => []),
        vacacionesService.obtenerResumen().catch(() => ({
          dias_disponibles: 0,
          dias_usados: 0,
          dias_pendientes: 0
        })),
        vacacionesService.obtenerMisSolicitudes().catch(() => [])
      ]);
      setPeriodos(periodosData);
      setResumen(resumenData);
      setSolicitudesExistentes(solicitudesData || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Datos por defecto si falla
      setPeriodos([]);
      setResumen({
        dias_disponibles: 0,
        dias_usados: 0,
        dias_pendientes: 0
      });
      setSolicitudesExistentes([]);
    }
  };
  
  // Validar automáticamente cuando cambian las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin && fechaInicio.isSameOrBefore(fechaFin)) {
      validarSolicitud();
    } else {
      setValidacion(null);
    }
  }, [fechaInicio, fechaFin]);
  
  const validarSolicitud = async () => {
    setValidando(true);
    try {
      const inicio = fechaInicio.clone().startOf('day');
      const fin = fechaFin.clone().startOf('day');
      
      // 1. VALIDACIÓN FRONTEND: Verificar cruce con solicitudes existentes
      const solicitudesCruzadas = solicitudesExistentes.filter(sol => {
        // Solo verificar solicitudes pendientes o aprobadas
        if (sol.estado === 'rechazada' || sol.estado === 'cancelada') {
          return false;
        }
        
        const solInicio = moment(sol.fecha_inicio).startOf('day');
        const solFin = moment(sol.fecha_fin).startOf('day');
        
        // Detectar cualquier tipo de solapamiento:
        // Caso 1: Nueva solicitud empieza durante una existente
        // Caso 2: Nueva solicitud termina durante una existente
        // Caso 3: Nueva solicitud envuelve completamente una existente
        // Caso 4: Nueva solicitud está dentro de una existente
        return (
          (inicio.isSameOrAfter(solInicio) && inicio.isSameOrBefore(solFin)) || // empieza durante
          (fin.isSameOrAfter(solInicio) && fin.isSameOrBefore(solFin)) ||       // termina durante
          (inicio.isSameOrBefore(solInicio) && fin.isSameOrAfter(solFin)) ||    // envuelve
          (inicio.isSameOrAfter(solInicio) && fin.isSameOrBefore(solFin))       // está dentro
        );
      });
      
      if (solicitudesCruzadas.length > 0) {
        const mensajesCruce = solicitudesCruzadas.map(sol => {
          const estadoTexto = sol.estado === 'pendiente' ? 'pendiente de aprobación' : 'aprobada';
          return `Ya tienes una solicitud ${estadoTexto} del ${moment(sol.fecha_inicio).format('DD/MM/YYYY')} al ${moment(sol.fecha_fin).format('DD/MM/YYYY')}`;
        });
        
        setValidacion({
          valida: false,
          errores: [
            'Las fechas seleccionadas se cruzan con solicitudes existentes:',
            ...mensajesCruce
          ],
          advertencias: [],
          alertas: []
        });
        setValidando(false);
        return;
      }
      
      // 2. VALIDACIÓN BACKEND: Reglas de negocio
      const diasSolicitados = fin.diff(inicio, 'days') + 1;
      
      const resultado = await vacacionesService.validarSolicitud({
        fecha_inicio: fechaInicio.format('YYYY-MM-DD'),
        fecha_fin: fechaFin.format('YYYY-MM-DD'),
        dias_solicitados: diasSolicitados
      });
      setValidacion(resultado);
    } catch (error) {
      console.error('Error al validar:', error);
      console.error('Error response:', error.response?.data);
      setValidacion({
        valida: false,
        errores: [error.response?.data?.detalles || error.message || 'Error al validar la solicitud. Intente nuevamente.'],
        advertencias: [],
        alertas: []
      });
    } finally {
      setValidando(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validacion || !validacion.valida) {
      return;
    }
    
    if (!motivo.trim()) {
      setDialogError({
        open: true,
        message: 'Debe ingresar un motivo para la solicitud'
      });
      return;
    }
    
    // Prevenir doble envío
    if (enviando) {
      return;
    }
    
    setEnviando(true);
    try {
      await vacacionesService.crearSolicitud({
        fecha_inicio: fechaInicio.format('YYYY-MM-DD'),
        fecha_fin: fechaFin.format('YYYY-MM-DD'),
        motivo: motivo.trim()
      });
      
      // Limpiar formulario
      setFechaInicio(null);
      setFechaFin(null);
      setMotivo('');
      setValidacion(null);
      
      // Recargar solicitudes para actualizar la lista
      await cargarDatos();
      
      // Mostrar dialog de éxito
      setDialogExito(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      const errorMsg = error.response?.data?.detalles || error.response?.data?.error || error.message;
      
      // Si el error es por tablas faltantes, mostrar mensaje específico
      if (errorMsg && errorMsg.includes('does not exist')) {
        setDialogError({
          open: true,
          message: 'El sistema de vacaciones aún no está configurado en la base de datos. Por favor, contacte al administrador para ejecutar las migraciones.'
        });
      } else {
        setDialogError({
          open: true,
          message: errorMsg || 'Error al crear la solicitud. Intente nuevamente.'
        });
      }
    } finally {
      setEnviando(false);
    }
  };
  
  const calcularDias = () => {
    if (!fechaInicio || !fechaFin || !fechaInicio.isSameOrBefore(fechaFin)) {
      return 0;
    }
    return fechaFin.diff(fechaInicio, 'days') + 1;
  };
  
  const contarViernesEnSeleccion = () => {
    if (!fechaInicio || !fechaFin || !fechaInicio.isSameOrBefore(fechaFin)) {
      return 0;
    }
    
    let count = 0;
    let current = fechaInicio.clone();
    while (current.isSameOrBefore(fechaFin)) {
      if (current.day() === 5) { // 5 = Viernes
        count++;
      }
      current.add(1, 'days');
    }
    return count;
  };
  
  const contarFinesSemanaEnSeleccion = () => {
    if (!fechaInicio || !fechaFin || !fechaInicio.isSameOrBefore(fechaFin)) {
      return 0;
    }
    
    let sabados = 0;
    let domingos = 0;
    let current = fechaInicio.clone();
    while (current.isSameOrBefore(fechaFin)) {
      if (current.day() === 6) sabados++; // 6 = Sábado
      if (current.day() === 0) domingos++; // 0 = Domingo
      current.add(1, 'days');
    }
    return Math.min(sabados, domingos); // Fines de semana completos
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={3}>
          {/* Formulario */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <VacationIcon color="primary" />
                Nueva Solicitud de Vacaciones
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Fechas */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <DatePicker
                      label="Fecha de Inicio"
                      value={fechaInicio}
                      onChange={setFechaInicio}
                      format="DD/MM/YYYY"
                      minDate={moment()}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          error: fechaInicio && fechaFin && fechaInicio.isAfter(fechaFin)
                        }
                      }}
                    />
                    
                    <DatePicker
                      label="Fecha de Fin"
                      value={fechaFin}
                      onChange={setFechaFin}
                      format="DD/MM/YYYY"
                      minDate={fechaInicio || moment()}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          error: fechaInicio && fechaFin && fechaFin.isBefore(fechaInicio)
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Días calculados */}
                  {fechaInicio && fechaFin && fechaInicio.isSameOrBefore(fechaFin) && (
                    <>
                      <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                        <CardContent sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CalendarIcon color="primary" />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Días solicitados
                                </Typography>
                                <Typography variant="h6" color="primary">
                                  {calcularDias()} días
                                </Typography>
                              </Box>
                              {validando && <CircularProgress size={20} />}
                            </Box>
                            
                            {/* Contador de viernes */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  🗓️ Viernes incluidos
                                </Typography>
                                <Typography variant="body1" fontWeight="medium" color={contarViernesEnSeleccion() > 0 ? 'warning.main' : 'text.primary'}>
                                  {contarViernesEnSeleccion()}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  📅 Fines de semana
                                </Typography>
                                <Typography variant="body1" fontWeight="medium" color={contarFinesSemanaEnSeleccion() > 0 ? 'info.main' : 'text.primary'}>
                                  {contarFinesSemanaEnSeleccion()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                      
                      {/* Alerta de exceso de viernes */}
                      {(() => {
                        const viernesActuales = contarViernesEnSeleccion();
                        if (viernesActuales > 0 && periodos.length > 0) {
                          const periodoActivo = periodos.find(p => p.estado === 'activo');
                          if (periodoActivo) {
                            const viernesUsados = periodoActivo.viernes_usados || 0;
                            const viernesTotal = viernesUsados + viernesActuales;
                            if (viernesTotal > 5) {
                              return (
                                <Alert severity="error" icon={<ErrorIcon />}>
                                  <AlertTitle>⚠️ Límite de viernes excedido</AlertTitle>
                                  Ya tienes <strong>{viernesUsados} viernes usados</strong> en el período {periodoActivo.anio_generacion}.
                                  Esta solicitud incluye <strong>{viernesActuales} viernes más</strong>, lo que totalizaría <strong>{viernesTotal} viernes</strong>.
                                  <br />
                                  <strong>Máximo permitido: 5 viernes por período de 30 días.</strong>
                                </Alert>
                              );
                            } else if (viernesTotal === 5) {
                              return (
                                <Alert severity="warning" icon={<WarningIcon />}>
                                  <AlertTitle>📊 Alcanzando límite de viernes</AlertTitle>
                                  Con esta solicitud alcanzarás el límite de <strong>5 viernes</strong> permitidos en el período {periodoActivo.anio_generacion}
                                  (actualmente tienes {viernesUsados} viernes usados).
                                </Alert>
                              );
                            } else if (viernesActuales > 0) {
                              return (
                                <Alert severity="info" icon={<InfoIcon />}>
                                  <AlertTitle>ℹ️ Viernes incluidos</AlertTitle>
                                  Esta solicitud incluye <strong>{viernesActuales} viernes</strong>. 
                                  Después de esta solicitud tendrás <strong>{viernesTotal} de 5 viernes usados</strong> en el período {periodoActivo.anio_generacion}.
                                </Alert>
                              );
                            }
                          }
                        }
                        return null;
                      })()}
                    </>
                  )}
                  
                  {/* Resultados de validación */}
                  {validacion && !validando && (
                    <Stack spacing={2}>
                      {/* Errores */}
                      {validacion.errores && validacion.errores.length > 0 && (
                        <Alert severity="error" icon={<ErrorIcon />}>
                          <AlertTitle>No se puede procesar la solicitud</AlertTitle>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {validacion.errores.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </Alert>
                      )}
                      
                      {/* Advertencias */}
                      {validacion.advertencias && validacion.advertencias.length > 0 && (
                        <Alert severity="warning" icon={<WarningIcon />}>
                          <AlertTitle>Advertencias</AlertTitle>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {validacion.advertencias.map((adv, idx) => (
                              <li key={idx}>{adv}</li>
                            ))}
                          </ul>
                        </Alert>
                      )}
                      
                      {/* Alertas informativas */}
                      {validacion.alertas && validacion.alertas.length > 0 && (
                        <Alert severity="info" icon={<InfoIcon />}>
                          <AlertTitle>Información</AlertTitle>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {validacion.alertas.map((alerta, idx) => (
                              <li key={idx}>{alerta}</li>
                            ))}
                          </ul>
                        </Alert>
                      )}
                      
                      {/* Éxito */}
                      {validacion.valida && (
                        <Alert severity="success" icon={<SuccessIcon />}>
                          <AlertTitle>Solicitud válida</AlertTitle>
                          La solicitud cumple con todas las reglas de negocio
                        </Alert>
                      )}
                    </Stack>
                  )}
                  
                  {/* Motivo */}
                  <TextField
                    label="Motivo de la solicitud"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Describa el motivo de su solicitud de vacaciones..."
                  />
                  
                  <Divider />
                  
                  {/* Botón enviar */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={enviando ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={!validacion || !validacion.valida || enviando || !motivo.trim()}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Solicitud'}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>
          
          {/* Información lateral */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Resumen de días */}
              {resumen && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Saldo de Vacaciones
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Días disponibles:
                        </Typography>
                        <Chip 
                          label={resumen.dias_disponibles || 0} 
                          color="success" 
                          size="small" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Días tomados:
                        </Typography>
                        <Chip 
                          label={resumen.dias_usados || 0} 
                          color="default" 
                          size="small" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Pendientes:
                        </Typography>
                        <Chip 
                          label={resumen.dias_pendientes || 0} 
                          color="warning" 
                          size="small" 
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
              
              {/* Períodos disponibles */}
              {periodos && periodos.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Períodos Activos
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={1.5}>
                      {periodos.map((periodo) => (
                        <Box 
                          key={periodo.id}
                          sx={{ 
                            p: 1.5, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            Período {periodo.anio_generacion}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Disponibles:
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {periodo.dias_disponibles} días
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Viernes usados:
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {periodo.viernes_usados || 0} de 5
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Fines de semana:
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {periodo.fines_semana_usados || 0} usados
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              
              {/* Reglas importantes */}
              <Card sx={{ bgcolor: 'info.50' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="info.main">
                    <InfoIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Reglas Importantes
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      • Solicitudes antes del día 20 de cada mes
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Máximo 5 viernes por período de 30 días
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Si incluye viernes, debe tomar sábado y domingo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Se recomienda tomar al menos 2 bloques de 7 días continuos
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
        
        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Dialog de éxito */}
        <Dialog
          open={dialogExito}
          onClose={() => setDialogExito(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <SuccessIcon />
            Solicitud Enviada
          </DialogTitle>
          <DialogContent>
            <Typography>
              Su solicitud de vacaciones ha sido enviada exitosamente y está pendiente de aprobación.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Recibirá una notificación cuando su solicitud sea revisada.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogExito(false)} variant="contained">
              Entendido
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de error */}
        <Dialog
          open={dialogError.open}
          onClose={() => setDialogError({ open: false, message: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <ErrorIcon />
            Error
          </DialogTitle>
          <DialogContent>
            <Typography>{dialogError.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDialogError({ open: false, message: '' })} 
              variant="contained"
              color="error"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default RequestForm;
