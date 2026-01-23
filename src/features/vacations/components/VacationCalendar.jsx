
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  IconButton, 
  Stack,
  Card,
  CardContent,
  Divider,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { authService } from '../../../services/auth.service';
import { feriadosService } from '../../../services/feriados.service';

// Configurar moment en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY HH:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Hoy a las] LT',
    nextDay: '[Mañana a las] LT',
    nextWeek: 'dddd [a las] LT',
    lastDay: '[Ayer a las] LT',
    lastWeek: '[el] dddd [pasado a las] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    ss: '%d segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Lunes es el primer día de la semana
    doy: 4
  }
});

const localizer = momentLocalizer(moment);

// Días festivos y feriados de Perú 2025
const feriadosPeru2025 = [
  { date: '2025-01-01', name: 'Año Nuevo', tipo: 'feriado' },
  { date: '2025-04-17', name: 'Jueves Santo', tipo: 'feriado' },
  { date: '2025-04-18', name: 'Viernes Santo', tipo: 'feriado' },
  { date: '2025-04-19', name: 'Sábado de Gloria', tipo: 'feriado' },
  { date: '2025-05-01', name: 'Día del Trabajo', tipo: 'feriado' },
  { date: '2025-06-29', name: 'San Pedro y San Pablo', tipo: 'feriado' },
  { date: '2025-07-28', name: 'Día de la Independencia', tipo: 'feriado' },
  { date: '2025-07-29', name: 'Fiestas Patrias', tipo: 'feriado' },
  { date: '2025-08-30', name: 'Santa Rosa de Lima', tipo: 'feriado' },
  { date: '2025-10-08', name: 'Combate de Angamos', tipo: 'feriado' },
  { date: '2025-11-01', name: 'Día de Todos los Santos', tipo: 'feriado' },
  { date: '2025-12-08', name: 'Inmaculada Concepción', tipo: 'feriado' },
  { date: '2025-12-25', name: 'Navidad', tipo: 'feriado' },
];

// Días festivos adicionales (no feriados oficiales)
const diasFestivos2025 = [
  { date: '2025-02-14', name: 'Día de San Valentín', tipo: 'festivo' },
  { date: '2025-05-11', name: 'Día de la Madre', tipo: 'festivo' },
  { date: '2025-06-15', name: 'Día del Padre', tipo: 'festivo' },
  { date: '2025-10-31', name: 'Halloween', tipo: 'festivo' },
  { date: '2025-12-24', name: 'Nochebuena', tipo: 'festivo' },
  { date: '2025-12-31', name: 'Fin de Año', tipo: 'festivo' },
];

const VacationCalendar = ({ events: propEvents }) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [vacacionesUsuario, setVacacionesUsuario] = useState([]);
  const [vacacionesEquipo, setVacacionesEquipo] = useState([]);
  const [feriadosData, setFeriadosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar vacaciones del usuario y su equipo
  useEffect(() => {
    const fetchVacaciones = async () => {
      try {
        setLoading(true);
        
        // Cargar feriados desde la API
        try {
          const feriados = await feriadosService.getAll();
          setFeriadosData(feriados);
        } catch (feriadosError) {
          console.error('Error al cargar feriados:', feriadosError);
          // Continuar aunque falle la carga de feriados
        }
        
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.empleadoId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

        // 1. Cargar mis solicitudes aprobadas
        const misSolicitudesResponse = await fetch(`${API_URL}/vacaciones/solicitudes/${currentUser.empleadoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (misSolicitudesResponse.ok) {
          const misSolicitudes = await misSolicitudesResponse.json();
          const misVacaciones = misSolicitudes
            .filter(s => s.estado === 'aprobada')
            .map(solicitud => ({
              id: `usuario-${solicitud.id}`,
              title: `Mis Vacaciones (${solicitud.dias_solicitados} días)`,
              start: new Date(solicitud.fecha_inicio),
              end: new Date(solicitud.fecha_fin),
              empleado: 'Yo',
              dias: solicitud.dias_solicitados,
              tipo: 'vacacion-usuario'
            }));
          setVacacionesUsuario(misVacaciones);
        }

        // 2. Cargar vacaciones de mi equipo (si tengo subordinados)
        const equipoResponse = await fetch(`${API_URL}/aprobacion/subordinados`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (equipoResponse.ok) {
          const { subordinados } = await equipoResponse.json();
          
          if (subordinados && subordinados.length > 0) {
            // Cargar solicitudes de cada subordinado
            const vacacionesEquipoPromises = subordinados.map(async (subordinado) => {
              try {
                const solicitudesResponse = await fetch(`${API_URL}/vacaciones/solicitudes/${subordinado.id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (solicitudesResponse.ok) {
                  const solicitudes = await solicitudesResponse.json();
                  return solicitudes
                    .filter(s => s.estado === 'aprobada')
                    .map(solicitud => ({
                      id: `equipo-${solicitud.id}`,
                      title: `${subordinado.nombres} ${subordinado.apellidos} (${solicitud.dias_solicitados} días)`,
                      start: new Date(solicitud.fecha_inicio),
                      end: new Date(solicitud.fecha_fin),
                      empleado: `${subordinado.nombres} ${subordinado.apellidos}`,
                      dias: solicitud.dias_solicitados,
                      tipo: 'vacacion-equipo'
                    }));
                }
                return [];
              } catch (err) {
                console.error(`Error cargando vacaciones de ${subordinado.nombres}:`, err);
                return [];
              }
            });

            const vacacionesEquipoArrays = await Promise.all(vacacionesEquipoPromises);
            const vacacionesEquipoFlat = vacacionesEquipoArrays.flat();
            setVacacionesEquipo(vacacionesEquipoFlat);
          }
        }

      } catch (err) {
        console.error('Error al cargar vacaciones:', err);
        setError('No se pudieron cargar las vacaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchVacaciones();
  }, []);

  // Combinar eventos de vacaciones con feriados
  const feriadosEvents = feriadosData
    .filter(f => f.tipo === 'nacional' || f.tipo === 'regional')
    .map(feriado => {
      const fechaDate = new Date(feriado.fecha + 'T00:00:00');
      return {
        id: `feriado-${feriado.id}`,
        title: feriado.nombre,
        start: fechaDate,
        end: fechaDate,
        tipo: 'feriado',
        allDay: true,
      };
    });

  const festivosEvents = feriadosData
    .filter(f => f.tipo === 'festivo')
    .map(festivo => {
      const fechaDate = new Date(festivo.fecha + 'T00:00:00');
      return {
        id: `festivo-${festivo.id}`,
        title: festivo.nombre,
      start: new Date(year, month - 1, day), // Usar fecha local
      end: new Date(year, month - 1, day),
      tipo: 'festivo',
      allDay: true,
    };
  });

  // Combinar todos los eventos evitando duplicados
  // Solo usar propEvents si no hay vacaciones cargadas desde la API
  const allEvents = [
    ...vacacionesUsuario,
    ...vacacionesEquipo,
    ...feriadosEvents,
    ...festivosEvents
  ];

  // Personalizar estilos de los eventos
  const eventStyleGetter = (event) => {
    let backgroundColor = '#1976d2';
    let borderColor = '#1565c0';
    
    if (event.tipo === 'feriado') {
      backgroundColor = '#d32f2f';
      borderColor = '#c62828';
    } else if (event.tipo === 'festivo') {
      backgroundColor = '#f57c00';
      borderColor = '#ef6c00';
    } else if (event.tipo === 'vacacion-usuario') {
      backgroundColor = '#2e7d32'; // Verde para mis vacaciones
      borderColor = '#1b5e20';
    } else if (event.tipo === 'vacacion-equipo') {
      backgroundColor = '#1976d2'; // Azul para vacaciones del equipo
      borderColor = '#1565c0';
    } else if (event.tipo === 'vacacion') {
      backgroundColor = '#1976d2';
      borderColor = '#1565c0';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: `2px solid ${borderColor}`,
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
      }
    };
  };

  // Personalizar el día en el calendario
  const dayPropGetter = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const isFeriado = feriadosData.some(f => 
      moment(f.fecha).format('YYYY-MM-DD') === dateStr && 
      (f.tipo === 'nacional' || f.tipo === 'regional')
    );
    const isFestivo = feriadosData.some(f => 
      moment(f.fecha).format('YYYY-MM-DD') === dateStr && 
      f.tipo === 'festivo'
    );
    
    if (isFeriado) {
      return {
        style: {
          backgroundColor: '#ffebee',
        }
      };
    }
    
    if (isFestivo) {
      return {
        style: {
          backgroundColor: '#fff3e0',
        }
      };
    }
    
    return {};
  };

  // Obtener eventos del mes actual
  const currentMonthEvents = allEvents.filter(event => 
    moment(event.start).isSame(date, 'month')
  );

  const vacacionesUsuarioCount = currentMonthEvents.filter(e => e.tipo === 'vacacion-usuario').length;
  const vacacionesEquipoCount = currentMonthEvents.filter(e => e.tipo === 'vacacion-equipo').length;
  const vacacionesCount = currentMonthEvents.filter(e => e.tipo === 'vacacion').length;
  const feriadosCount = currentMonthEvents.filter(e => e.tipo === 'feriado').length;
  const festivosCount = currentMonthEvents.filter(e => e.tipo === 'festivo').length;

  // Toolbar personalizado
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => onNavigate('PREV')} color="primary">
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton onClick={() => onNavigate('TODAY')} color="primary">
          <TodayIcon />
        </IconButton>
        <IconButton onClick={() => onNavigate('NEXT')} color="primary">
          <NavigateNextIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ ml: 2 }}>
          {label}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        {vacacionesUsuarioCount > 0 && (
          <Chip 
            label={`${vacacionesUsuarioCount} Mis Vacaciones`}
            size="small"
            icon={<BeachAccessIcon />}
            sx={{ bgcolor: '#2e7d32', color: 'white' }}
          />
        )}
        {vacacionesEquipoCount > 0 && (
          <Chip 
            label={`${vacacionesEquipoCount} Equipo`}
            size="small"
            icon={<BeachAccessIcon />}
            sx={{ bgcolor: '#1976d2', color: 'white' }}
          />
        )}
        {vacacionesCount > 0 && (
          <Chip 
            label={`${vacacionesCount} Otras`}
            size="small"
            icon={<BeachAccessIcon />}
            sx={{ bgcolor: '#1976d2', color: 'white' }}
          />
        )}
        <Chip 
          label={`${feriadosCount} Feriados`}
          size="small"
          icon={<CelebrationIcon />}
          sx={{ bgcolor: '#d32f2f', color: 'white' }}
        />
        <Chip 
          label={`${festivosCount} Festivos`}
          size="small"
          icon={<EventIcon />}
          sx={{ bgcolor: '#f57c00', color: 'white' }}
        />
      </Stack>
    </Box>
  );

  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango',
    showMore: total => `+ Ver más (${total})`,
    tomorrow: 'Mañana',
    yesterday: 'Ayer',
    work_week: 'Semana laboral',
  };

  return (
    <Card>
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                📅 Calendario de Vacaciones y Feriados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vacacionesEquipo.length > 0 
                  ? 'Tus vacaciones y las de tu equipo' 
                  : 'Planifica tu tiempo libre y consulta los días feriados de Perú'}
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Leyenda */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 3, 
              flexWrap: 'wrap',
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 2
            }}>
              {vacacionesUsuario.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    bgcolor: '#2e7d32', 
                    borderRadius: 1,
                    border: '2px solid #1b5e20'
                  }} />
                  <Typography variant="body2" fontWeight={600}>Mis Vacaciones</Typography>
                </Box>
              )}
              {vacacionesEquipo.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    bgcolor: '#1976d2', 
                    borderRadius: 1,
                    border: '2px solid #1565c0'
                  }} />
                  <Typography variant="body2" fontWeight={600}>Vacaciones del Equipo</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  bgcolor: '#d32f2f', 
                  borderRadius: 1,
                  border: '2px solid #c62828'
                }} />
                <Typography variant="body2" fontWeight={600}>Feriados Nacionales</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  bgcolor: '#f57c00', 
                  borderRadius: 1,
                  border: '2px solid #ef6c00'
                }} />
                <Typography variant="body2" fontWeight={600}>Días Festivos</Typography>
              </Box>
            </Box>

        {/* Calendario */}
        <Box sx={{ 
          height: 600,
          '& .rbc-calendar': {
            fontFamily: 'inherit',
          },
          '& .rbc-header': {
            padding: '12px 4px',
            fontWeight: 700,
            fontSize: '0.9rem',
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #1976d2',
          },
          '& .rbc-today': {
            backgroundColor: '#e3f2fd',
          },
          '& .rbc-off-range-bg': {
            backgroundColor: '#fafafa',
          },
          '& .rbc-month-view': {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
          },
          '& .rbc-date-cell': {
            padding: '4px',
            fontSize: '0.9rem',
            fontWeight: 600,
          },
          '& .rbc-event': {
            padding: '2px 4px',
            margin: '1px',
          },
          '& .rbc-toolbar': {
            display: 'none', // Usamos toolbar personalizado
          },
        }}>
          <CustomToolbar
            label={moment(date).format('MMMM [de] YYYY').charAt(0).toUpperCase() + moment(date).format('MMMM [de] YYYY').slice(1)}
            onNavigate={(action) => {
              if (action === 'PREV') {
                setDate(moment(date).subtract(1, 'month').toDate());
              } else if (action === 'NEXT') {
                setDate(moment(date).add(1, 'month').toDate());
              } else if (action === 'TODAY') {
                setDate(new Date());
              }
            }}
            onView={setView}
          />
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            date={date}
            onNavigate={setDate}
            view={view}
            onView={setView}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            messages={messages}
            culture='es'
            formats={{
              dateFormat: 'D',
              dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd', culture),
              weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
              monthHeaderFormat: (date, culture, localizer) => localizer.format(date, 'MMMM YYYY', culture),
              dayHeaderFormat: (date, culture, localizer) => localizer.format(date, 'dddd, D [de] MMMM', culture),
              dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                localizer.format(start, 'D [de] MMMM', culture) + ' – ' + localizer.format(end, 'D [de] MMMM', culture),
            }}
            popup
            showMultiDayTimes
          />
        </Box>

        {/* Próximos feriados */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            🎉 Próximos Feriados de Perú
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
            {feriadosData
              .filter(f => 
                (f.tipo === 'nacional' || f.tipo === 'regional') && 
                moment(f.fecha).isAfter(moment())
              )
              .slice(0, 6)
              .map((feriado) => (
                <Tooltip key={feriado.id} title={`Feriado ${feriado.tipo === 'nacional' ? 'Nacional' : 'Regional'}`} arrow>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: '#ffebee', 
                    borderRadius: 1,
                    border: '1px solid #ef5350',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {feriado.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {moment(feriado.fecha).format('dddd, D [de] MMMM')}
                      </Typography>
                    </Box>
                    <CelebrationIcon sx={{ color: '#d32f2f' }} />
                  </Box>
                </Tooltip>
              ))}
          </Box>
        </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VacationCalendar;
