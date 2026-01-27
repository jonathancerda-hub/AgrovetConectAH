
import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Box, ListItemButton, Button, Tooltip } from '@mui/material';
import { authService } from './services/auth.service';
import { publicacionesService } from './services/publicaciones.service';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import MiFicha from './features/vacations/components/MiFicha';
import Portal from './features/vacations/components/Portal';
import Login from './features/vacations/components/Login';
import NewCollaboratorForm from './features/vacations/components/NewCollaboratorForm';
import GestionEmpleados from './features/vacations/components/GestionEmpleados';
import AprobacionSolicitudes from './features/vacations/components/AprobacionSolicitudes';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import AvailableDays from './features/vacations/components/AvailableDays';
import RequestVacationPage from './features/vacations/components/RequestVacationPage'; // Corregido
import RequestForm from './features/vacations/components/RequestForm';
import VacationCalendar from './features/vacations/components/VacationCalendar';
import RequestsList from './features/vacations/components/RequestsList';
import ApprovalDashboard from './features/vacations/components/ApprovalDashboard';
import ControlVacaciones from './features/vacations/components/ControlVacaciones'; // Import the new component
import TeamDashboard from './features/vacations/components/TeamDashboard';
import TopBar from './features/vacations/components/TopBar';
import { CssBaseline, useTheme, useMediaQuery } from '@mui/material';

// Importaciones de páginas con tabs
import VacacionesPage from './features/vacations/components/VacacionesPage';
import RRHHPage from './features/vacations/components/RRHHPage';
import EquipoPage from './features/vacations/components/EquipoPage';
import BoletinesPage from './features/vacations/components/BoletinesPage';
import ProcessRequestPage from './features/vacations/components/ProcessRequestPage';

// Importación para Notificaciones
import NotificationsPage from './features/vacations/components/NotificationsPage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WifiIcon from '@mui/icons-material/Wifi';
import ContactsIcon from '@mui/icons-material/Contacts';

// Importación para Directorio
import DirectorioPage from './features/vacations/components/DirectorioPage';

const drawerWidth = 240;

import GroupIcon from '@mui/icons-material/Group';

// --- SIMULACIÓN DE BASE DE DATOS DE USUARIOS CON JERARQUÍA ---
const users = [
  { id: 1, name: 'Carlos Director', level: 1, supervisorId: null },
  { id: 2, name: 'Ana Gerente', level: 2, supervisorId: 1 },
  { id: 3, name: 'Pedro Jefe', level: 4, supervisorId: 2 },
  { id: 4, name: 'Laura Supervisora', level: 5, supervisorId: 3 },
  { id: 5, name: 'Juan Coordinador', level: 6, supervisorId: 4 },
  { id: 6, name: 'Maria Asistente', level: 7, supervisorId: 5 },
  { id: 7, name: 'Luis Auxiliar', level: 8, supervisorId: 5 },
  { id: 8, name: 'Sofia Coordinadora', level: 6, supervisorId: 4 },
];

const initialVacationRequests = [
  { id: 1, requesterId: 7, approverId: 5, startDate: '2025-11-01', endDate: '2025-11-05', status: 'Pendiente', comments: 'Viaje familiar.' },
  { id: 2, requesterId: 6, approverId: 5, startDate: '2025-12-22', endDate: '2025-12-26', status: 'Pendiente', comments: 'Fiestas de fin de año.' },
  { id: 3, requesterId: 5, approverId: 4, startDate: '2025-10-20', endDate: '2025-10-25', status: 'Aprobado', comments: '' },
];
// ----------------------------------------------------------------

// Datos de ejemplo para mostrar los componentes
const requestsData = [
  { id: 1, requester: 'Juan', startDate: '2025-10-10', endDate: '2025-10-15', status: 'Aprobada' },
  { id: 2, requester: 'Ana', startDate: '2025-11-01', endDate: '2025-11-05', status: 'Pendiente' },
];
const approvalRequests = [
  { id: 1, employee: 'Pedro', startDate: '2025-12-01', endDate: '2025-12-10' },
];

const initialPublicaciones = [
  {
    id: 1,
    autor: 'Agrovet',
    fecha: '13 de octubre | 10:35 AM',
    titulo: '¡Estuvimos presentes en la carrera Perú Champs 10K! 🏃‍♂️🏃‍♀️',
    contenido: '¡Estuvimos presentes en la carrera Perú Champs 10K! Felicitamos a nuestros corredores: Violeta Balbuena, José Montero, Steyci Lebano, Judith Atencio y Ana Gavidia, quienes representaron de gran forma a toda la empresa, corriendo formidablemente los 10 km de la carrera Perú Champs este último domingo. ¡Muy bien chicos, adelante!',
    imageUrl: 'https://i.imgur.com/0y8Ftya.png',
    reacciones: 9,
  },
];


const portalComponent = <Portal />;
// fichaComponent se renderiza dinámicamente con currentUser

// Placeholder components para el nuevo menú de RRHH
const ControlVacacionesComponent = () => (
  <Box>
    <Typography>Página de Control de Vacaciones</Typography>
    <Button variant="contained" sx={{ mt: 2, background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important', color: 'white !important' }}>
      Ejecutar Control
    </Button>
  </Box>
);
const HistorialesComponent = () => <Typography>Página de Historiales</Typography>;

// Placeholder component para Mi Equipo
const SolicitarColaboradorComponent = () => <Typography>Página para Solicitar Colaborador</Typography>;


function App() {
  const [selectedMenu, setSelectedMenu] = useState('portal');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Estado para el usuario logueado
  const [requestToProcess, setRequestToProcess] = useState(null); // Solicitud seleccionada para procesar
  const [stagedBulletins, setStagedBulletins] = useState([]); // Boletines en espera de revisión
  const [vacationRequests, setVacationRequests] = useState(initialVacationRequests); // Estado para las solicitudes de vacaciones
  const [publishedBulletins, setPublishedBulletins] = useState(initialPublicaciones); // Lista de todos los boletines publicados
  const [calendarEvents, setCalendarEvents] = useState([]); // Eventos del calendario
  const [availableDaysData, setAvailableDaysData] = useState({ available: 0, taken: 0 }); // Datos de vacaciones del usuario
  const [vacacionesTab, setVacacionesTab] = useState(0); // Tab activo en VacacionesPage
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Verificar si hay una sesión activa al cargar la app
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && authService.isAuthenticated()) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Cargar datos de vacaciones del usuario
      fetchUserVacationData(user.empleadoId);
    }
  }, []);

  // Cargar eventos del calendario cuando se accede a vacaciones
  useEffect(() => {
    if (selectedMenu === 'vacaciones' && currentUser) {
      fetchCalendarEvents();
    }
  }, [selectedMenu, currentUser]);

  // Función para obtener datos de vacaciones del usuario
  const fetchUserVacationData = async (empleadoId) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/vacaciones/resumen/${empleadoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableDaysData({
          available: data.dias_disponibles || 0,
          taken: data.dias_usados || 0
        });
      } else {
        console.warn('No se pudieron cargar los datos de vacaciones');
        setAvailableDaysData({ available: 0, taken: 0 });
      }
    } catch (error) {
      console.error('Error al cargar datos de vacaciones:', error);
      setAvailableDaysData({ available: 0, taken: 0 });
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/aprobacion/solicitudes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Convertir solicitudes a eventos del calendario
        const events = data.solicitudes
          .filter(s => s.estado === 'aprobada')
          .map(solicitud => ({
            id: solicitud.id,
            title: `${solicitud.nombre_empleado} - Vacaciones`,
            start: new Date(solicitud.fecha_inicio),
            end: new Date(solicitud.fecha_fin),
            empleado: solicitud.nombre_empleado,
            dias: solicitud.dias_solicitados
          }));
        setCalendarEvents(events);
      }
    } catch (error) {
      console.error('Error al cargar eventos del calendario:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName);
    if (isMobile) setDrawerOpen(false);
  };

  const handleLogin = (user) => {
    // Ahora recibimos el objeto user directamente del servicio
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Cargar datos de vacaciones del usuario
    if (user.empleadoId) {
      fetchUserVacationData(user.empleadoId);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSelectedMenu('portal');
  };

  const handleAddBulletin = (newBulletin) => {
    setStagedBulletins((prevBulletins) => [newBulletin, ...prevBulletins]);
    // En una app real, aquí también harías una llamada a tu backend.
    alert('¡Boletín creado! Ahora está en "Vista Preliminar" para su revisión.');
  };

  const handlePublishBulletin = async (bulletinId) => {
    const bulletinToPublish = stagedBulletins.find(b => b.id === bulletinId);
    if (bulletinToPublish) {
      try {
        // Publicar en la API
        const publicacionData = {
          titulo: bulletinToPublish.title,
          contenido: bulletinToPublish.content,
          tipo: bulletinToPublish.tipo || 'Noticia',
          prioridad: bulletinToPublish.prioridad || 'Media',
          imagenUrl: bulletinToPublish.imageUrl || null,
          visible: true
        };
        
        const publicacionCreada = await publicacionesService.create(publicacionData);
        
        // Actualizar el estado local con la publicación real
        setPublishedBulletins(prev => [publicacionCreada, ...prev]);
        setStagedBulletins(prev => prev.filter(b => b.id !== bulletinId));
        
        alert('¡Boletín publicado exitosamente en el portal!');
        handleMenuClick('portal'); // Navega al portal para ver el resultado
      } catch (error) {
        console.error('Error al publicar boletín:', error);
        
        // Si la tabla de publicaciones no existe, mover el boletín localmente
        if (error.response?.status === 404 || error.message?.includes('404')) {
          alert('El módulo de publicaciones está en desarrollo. El boletín se guardó localmente.');
          
          // Mover el boletín de staged a published localmente
          setPublishedBulletins(prev => [{
            ...bulletinToPublish,
            id: Date.now(), // Generar nuevo ID
            fecha_publicacion: new Date().toISOString()
          }, ...prev]);
          setStagedBulletins(prev => prev.filter(b => b.id !== bulletinId));
          
          handleMenuClick('portal');
        } else {
          alert('Error al publicar el boletín. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  const handleNewRequest = (requestData) => {
    const newRequest = {
      id: Date.now(),
      requesterId: currentUser.id,
      approverId: currentUser.supervisorId, // La solicitud va al supervisor directo
      days: Math.ceil((new Date(requestData.endDate) - new Date(requestData.startDate)) / (1000 * 60 * 60 * 24)) + 1,
      status: 'Pendiente',
      ...requestData,
    };
    setVacationRequests(prev => [...prev, newRequest]);
    alert(`Solicitud enviada a tu supervisor para aprobación.`);
    handleMenuClick('portal'); // Volver al portal
  };

  const handleProcessRequest = (requestId, decision, comment) => {
    setVacationRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: decision, approverComment: comment } : req
      )
    );
    alert(`La solicitud ha sido ${decision.toLowerCase()} con éxito.`);
    setRequestToProcess(null); // Vuelve al panel de aprobación
    handleMenuClick('vacaciones'); // Navega a vacaciones
  };

  let mainContent;
  let pageTitle = 'Portal'; // Título por defecto

  if (requestToProcess) {
    const requester = users.find(u => u.id === requestToProcess.requesterId);
    mainContent = <ProcessRequestPage 
      request={requestToProcess} 
      requester={requester}
      onProcess={handleProcessRequest}
      onGoBack={() => setRequestToProcess(null)}
    />;
    pageTitle = `Procesando Solicitud #${requestToProcess.id}`;
  } else if (selectedMenu === 'portal') {
    mainContent = <Portal publicaciones={publishedBulletins} onNavigate={handleMenuClick} />; // Pasamos toda la lista de publicaciones
    pageTitle = 'Portal';
  } else if (selectedMenu === 'ficha') {
    mainContent = <MiFicha currentUser={currentUser} />;
    pageTitle = 'Mi Ficha';
  } else if (selectedMenu === 'vacaciones') {
    mainContent = (
      <VacacionesPage 
        availableDaysData={availableDaysData}
        calendarEvents={calendarEvents}
        onNewRequest={handleNewRequest}
        initialTab={vacacionesTab}
      />
    );
    pageTitle = 'Vacaciones';
  } else if (selectedMenu === 'rrhh') {
    mainContent = <RRHHPage />;
    pageTitle = 'Dashboard RRHH';
  } else if (selectedMenu === 'empleados') {
    mainContent = <GestionEmpleados />;
    pageTitle = 'Gestión de Empleados';
  } else if (selectedMenu === 'notificaciones') {
    mainContent = <NotificationsPage onNavigate={(menu, tab) => {
      setSelectedMenu(menu);
      if (menu === 'vacaciones') {
        setActiveView('vacaciones');
        setVacacionesTab(tab || 0);
      }
    }} />;
    pageTitle = 'Notificaciones';
  } else if (selectedMenu === 'directorio') {
    mainContent = <DirectorioPage />;
    pageTitle = 'Directorio';
  } else if (selectedMenu === 'equipo') {
    mainContent = <EquipoPage />;
    pageTitle = 'Mi Equipo';
  } else if (selectedMenu === 'boletines') {
    mainContent = (
      <BoletinesPage 
        stagedBulletins={stagedBulletins}
        onAddBulletin={handleAddBulletin}
        onPublish={handlePublishBulletin}
        onGoToPortal={() => handleMenuClick('portal')}
      />
    );
    pageTitle = 'Boletines';
  }

  // Si el usuario no está autenticado, muestra solo el componente Login.
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  // Si el usuario está autenticado, muestra el layout completo de la aplicación.
  return (
    <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 60}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 60}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}>
        <TopBar 
          onMenuClick={handleDrawerToggle} 
          title={pageTitle} 
          onNavigate={handleMenuClick}
          onLogout={handleLogout}
        />
      </AppBar>
    <Drawer
      id="app-drawer"
      variant={isMobile ? 'temporary' : 'permanent'}
      open={drawerOpen || !isMobile}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        transition: 'width 0.2s',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerOpen ? drawerWidth : '60px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s',
          borderRight: 'none',
          background: 'linear-gradient(180deg, #264653 0%, #2a9d8f 100%)',
          color: 'rgba(255, 255, 255, 0.8)',
          '& .MuiListItemIcon-root': {
            color: 'rgba(255, 255, 255, 0.8)',
          },
        },
      }}
    >
      {/* Logo sticky - visible tanto abierto como cerrado */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 3,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: drawerOpen ? 3 : 1,
          py: 0.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(38, 70, 83, 0.95)',
          backdropFilter: 'blur(8px)',
          boxSizing: 'border-box',
        }}>
          {drawerOpen ? (
            <img
              src="/img/conect.png"
              alt="Conecta Logo"
              style={{ 
                height: '100px', 
                width: 'auto', 
                maxWidth: '100%', 
                display: 'block',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Tooltip title="ConectAH" placement="right" arrow>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <WifiIcon sx={{ fontSize: 24 }} />
              </Box>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List>
          {/* Sección GENERAL */}
          {drawerOpen && (
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 600,
                px: 3,
                letterSpacing: 1,
                display: 'block',
                mt: 2,
                mb: 1,
              }}
            >
              GENERAL
            </Typography>
          )}
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Portal" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu.main === 'portal'}
                  onClick={() => handleMenuClick('portal')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <HomeIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Portal" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Mi ficha" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu === 'ficha'}
                  onClick={() => handleMenuClick('ficha')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <PersonIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Mi ficha" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Notificaciones" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu === 'notificaciones'}
                  onClick={() => handleMenuClick('notificaciones')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <NotificationsIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Notificaciones" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Directorio" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu === 'directorio'}
                  onClick={() => handleMenuClick('directorio')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <ContactsIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Directorio" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Mi Equipo" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu === 'equipo'}
                  onClick={() => handleMenuClick('equipo')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    transition: (theme) => theme.transitions.create('margin', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  }}>
                  <GroupsIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Mi Equipo" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
              </ListItemButton>
              </Tooltip>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Vacaciones" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu === 'vacaciones'}
                  onClick={() => handleMenuClick('vacaciones')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Vacaciones" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {/* Solo mostrar Dashboard RRHH para usuarios RRHH */}
            {currentUser?.esRrhh && (
              <ListItem disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!drawerOpen ? "Dashboard RRHH" : ""} placement="right" arrow>
                  <ListItemButton
                    selected={selectedMenu === 'rrhh'}
                    onClick={() => handleMenuClick('rrhh')}
                    sx={{
                      minHeight: 48,
                      mx: 2,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-selected': {
                        color: '#fff',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        '& .MuiListItemIcon-root': {
                          color: '#fff',
                        },
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Dashboard RRHH" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
              </ListItem>
            )}

            {/* Menú Boletines - Solo para usuarios RRHH */}
            {currentUser?.esRrhh && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Boletines" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu === 'boletines'}
                  onClick={() => handleMenuClick('boletines')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                    transition: (theme) => theme.transitions.create('margin', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  }}>
                  <CampaignIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Boletines" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
              </ListItemButton>
              </Tooltip>
            </ListItem>
            )}

            {/* Solo mostrar Gestión de Empleados para usuarios RRHH */}
            {currentUser?.esRrhh && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!drawerOpen ? "Gestión de Empleados" : ""} placement="right" arrow>
                <ListItemButton
                  selected={selectedMenu.main === 'empleados'}
                  onClick={() => handleMenuClick('empleados')}
                  sx={{
                    minHeight: 48,
                    mx: 2,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      transition: (theme) => theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                    }}>
                    <GroupIcon />
                  </ListItemIcon>
                  {drawerOpen && <ListItemText primary="Gestión de Empleados" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            )}
          </List>
        </Box>
      </Box>
      </Drawer>
      <Box
        component="main"
        sx={theme => ({
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: !isMobile ? (drawerOpen ? `${drawerWidth}px` : '60px') : 0,
        })}
      >
        <Toolbar />
        {mainContent}
      </Box>
    </Box>
  );
}

export default App;
