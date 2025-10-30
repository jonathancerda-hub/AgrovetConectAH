
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Box, Collapse, ListItemButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import MiFicha from './features/vacations/components/MiFicha';
import Portal from './features/vacations/components/Portal';
import Login from './features/vacations/components/Login';
import NewCollaboratorForm from './features/vacations/components/NewCollaboratorForm';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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

// Importaciones para Boletines
import NewBulletinForm from './features/vacations/components/NewBulletinForm'; // Corregido
import PortalPage from './features/vacations/components/PortalPage'; // Corregido
import ProcessRequestPage from './features/vacations/components/ProcessRequestPage';

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
const availableDaysData = { available: 10, taken: 5 };
const calendarEvents = [
  { id: 1, title: 'Vacaciones Juan', start: new Date(), end: new Date() },
];
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
const fichaComponent = <MiFicha />;

const vacacionesItems = [
  { text: 'Dashboard', icon: <EventAvailableIcon />, component: <AvailableDays available={availableDaysData.available} taken={availableDaysData.taken} /> },
  { text: 'Formulario de Solicitud', icon: <AssignmentIcon />, component: null }, // Se manejará dinámicamente
  { text: 'Calendario', icon: <CalendarMonthIcon />, component: <VacationCalendar events={calendarEvents} /> },
  { text: 'Lista de Solicitudes', icon: <ListAltIcon />, component: <RequestsList requests={requestsData} /> },
  { text: 'Panel de Aprobación', icon: <SupervisorAccountIcon />, component: null }, // Se manejará dinámicamente
];

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

const rrhhItems = [
  { text: 'Control de Vacaciones', icon: <FactCheckIcon />, component: <ControlVacaciones /> }, // Use the new component
  { text: 'Historiales', icon: <HistoryIcon />, component: <HistorialesComponent /> },
];
// Placeholder component para Gestión de Empleados
const GestionEmpleadosComponent = () => (
  <Box>
    <Typography>Página de Gestión de Empleados</Typography>
    <Button variant="contained" sx={{ mt: 2, background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important', color: 'white !important' }}>
      Añadir Empleado
    </Button>
  </Box>
);

// Placeholder component para Mi Equipo
const SolicitarColaboradorComponent = () => <Typography>Página para Solicitar Colaborador</Typography>;

const equipoItems = [
  { text: 'Solicitar Colaborador', icon: <PersonAddIcon />, component: <NewCollaboratorForm /> },
  { text: 'Equipo', icon: <PeopleIcon />, component: <TeamDashboard /> },
];

// Items para el nuevo menú de Boletines
const boletinesItems = [
  { text: 'Crear Boletín', icon: <AddToPhotosIcon />, component: null },
  { text: 'Vista Preliminar', icon: <DynamicFeedIcon />, component: null },
];


function App() {
  const [selectedMenu, setSelectedMenu] = useState({ main: 'portal', sub: 0 });
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Estado para el usuario logueado
  const [requestToProcess, setRequestToProcess] = useState(null); // Solicitud seleccionada para procesar
  const [stagedBulletins, setStagedBulletins] = useState([]); // Boletines en espera de revisión
  const [vacationRequests, setVacationRequests] = useState(initialVacationRequests); // Estado para las solicitudes de vacaciones
  const [publishedBulletins, setPublishedBulletins] = useState(initialPublicaciones); // Lista de todos los boletines publicados
  const [openSubMenu, setOpenSubMenu] = useState(null); // Controla qué submenú está abierto
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleMenuClick = (main, sub = 0) => {
    setSelectedMenu({ main, sub });
    if (isMobile) setDrawerOpen(false);
  };

  const handleSubMenuToggle = (menuName) => {
    if (!drawerOpen) {
      setDrawerOpen(true);
      setOpenSubMenu(menuName);
    } else {
      setOpenSubMenu(prev => (prev === menuName ? null : menuName));
    }
  };

  const handleLogin = (userId) => {
    const user = users.find(u => u.id === parseInt(userId));
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const handleAddBulletin = (newBulletin) => {
    setStagedBulletins((prevBulletins) => [newBulletin, ...prevBulletins]);
    // En una app real, aquí también harías una llamada a tu backend.
    alert('¡Boletín creado! Ahora está en "Vista Preliminar" para su revisión.');
    handleMenuClick('boletines', 1); // Navega a "Vista Preliminar"
  };

  const handlePublishBulletin = (bulletinId) => {
    const bulletinToPublish = stagedBulletins.find(b => b.id === bulletinId);
    if (bulletinToPublish) {
      const newPublication = {
        id: bulletinToPublish.id,
        autor: 'Portal de Noticias', // O el autor real
        fecha: new Date(bulletinToPublish.createdAt).toLocaleString(),
        titulo: bulletinToPublish.title,
        contenido: bulletinToPublish.content,
        imageUrl: bulletinToPublish.imageUrl,
        reacciones: 0,
      };
      setPublishedBulletins(prev => [newPublication, ...prev]);
      setStagedBulletins(prev => prev.filter(b => b.id !== bulletinId));
      alert('¡Boletín publicado en el portal principal!');
      handleMenuClick('portal'); // Navega al portal para ver el resultado
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
    handleMenuClick('vacaciones', 4); // Navega al panel de aprobación
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
  } else if (selectedMenu.main === 'portal') {
    mainContent = <Portal publicaciones={publishedBulletins} />; // Pasamos toda la lista de publicaciones
    pageTitle = 'Portal';
  } else if (selectedMenu.main === 'ficha') {
    mainContent = <MiFicha />;
  } else if (selectedMenu.main === 'vacaciones') {
    const selectedItem = vacacionesItems[selectedMenu.sub];
    pageTitle = selectedItem.text;
    if (selectedItem.text === 'Formulario de Solicitud') {
      mainContent = <RequestForm onNewRequest={handleNewRequest} />;
    } else if (selectedItem.text === 'Panel de Aprobación') {
      mainContent = <ApprovalDashboard currentUser={currentUser} vacationRequests={vacationRequests} users={users} onSelectRequest={setRequestToProcess} />;
    } else {
      mainContent = selectedItem.component;
    }
  } else if (selectedMenu.main === 'rrhh') {
    mainContent = rrhhItems[selectedMenu.sub].component;
    pageTitle = rrhhItems[selectedMenu.sub].text;
  } else if (selectedMenu.main === 'empleados') {
    mainContent = <GestionEmpleadosComponent />;
    pageTitle = 'Gestión de Empleados';
  } else if (selectedMenu.main === 'equipo') {
    mainContent = equipoItems[selectedMenu.sub].component;
    pageTitle = equipoItems[selectedMenu.sub].text;
  } else if (selectedMenu.main === 'boletines') {
    if (selectedMenu.sub === 0) { // Crear Boletín
      mainContent = <NewBulletinForm onAddBulletin={handleAddBulletin} onGoToPortal={() => handleMenuClick('portal')} />;
      pageTitle = 'Crear Boletín';
    } else { // Vista Preliminar
      mainContent = <PortalPage bulletins={stagedBulletins} onPublish={handlePublishBulletin} />;
      pageTitle = 'Vista Preliminar de Boletines';
    }
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
        <TopBar onMenuClick={handleDrawerToggle} title={pageTitle} />
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
      {/* Top area with sticky logo - the rest of the menu will scroll independently */}
      <Box sx={{ width: '100%' }}>
        {drawerOpen && (
          <Box sx={(theme) => ({
            position: 'sticky',
            top: 0,
            zIndex: 3,
            height: theme.mixins.toolbar.minHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)', // Línea restaurada
            background: 'transparent',
            boxSizing: 'border-box',
          })}>
            <img
              src="/img/conect.png"
              alt="Conecta Logo"
              style={{ width: '90%', maxWidth: 180, display: 'block' }} // Logo más grande
            />
          </Box>
        )}
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
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={selectedMenu.main === 'ficha'}
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
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleSubMenuToggle('equipo')}
                sx={{
                  minHeight: 48,
                  mx: 2,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  borderRadius: 1,
                  backgroundColor: openSubMenu === 'equipo' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                {drawerOpen && (openSubMenu === 'equipo' ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSubMenu === 'equipo' && drawerOpen} timeout="auto" unmountOnExit>
              <Box sx={{ position: 'relative', pl: 0 }}>
                {/* vertical line */}
                <Box sx={{ position: 'absolute', left: drawerOpen ? 40 : 28, top: 12, bottom: 12, width: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                <List component="div" disablePadding>
                  {equipoItems.map((item, idx) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          pl: 4,
                          minHeight: 40,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            '& .MuiListItemText-primary': {
                              color: '#fff',
                              fontWeight: 600,
                            }
                          },
                        }}
                        selected={selectedMenu.main === 'equipo' && selectedMenu.sub === idx}
                        onClick={() => handleMenuClick('equipo', idx)}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', alignItems: 'center' }}>
                          <Box sx={{ width: 8, height: 8, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(255,255,255,0.04)' }} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontSize: '0.875rem', color: 'inherit' } }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleSubMenuToggle('vacaciones')}
                sx={{
                  minHeight: 48,
                  mx: 2,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  borderRadius: 1,
                  backgroundColor: openSubMenu === 'vacaciones' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                {drawerOpen && (openSubMenu === 'vacaciones' ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSubMenu === 'vacaciones' && drawerOpen} timeout="auto" unmountOnExit>
              <Box sx={{ position: 'relative', pl: 0 }}>
                <Box sx={{ position: 'absolute', left: drawerOpen ? 40 : 28, top: 12, bottom: 12, width: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                <List component="div" disablePadding>
                  {vacacionesItems.map((item, idx) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton 
                        sx={{
                          pl: 4,
                          minHeight: 40,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            '& .MuiListItemText-primary': {
                              color: '#fff',
                              fontWeight: 600,
                            }
                          },
                        }}
                        selected={selectedMenu.main === 'vacaciones' && selectedMenu.sub === idx}
                        onClick={() => handleMenuClick('vacaciones', idx)}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', alignItems: 'center' }}>
                          <Box sx={{ width: 8, height: 8, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(255,255,255,0.04)' }} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontSize: '0.875rem', color: 'inherit' } }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleSubMenuToggle('rrhh')}
                sx={{
                  minHeight: 48,
                  mx: 2,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  borderRadius: 1,
                  backgroundColor: openSubMenu === 'rrhh' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                {drawerOpen && (openSubMenu === 'rrhh' ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSubMenu === 'rrhh' && drawerOpen} timeout="auto" unmountOnExit>
              <Box sx={{ position: 'relative', pl: 0 }}>
                <Box sx={{ position: 'absolute', left: drawerOpen ? 40 : 28, top: 12, bottom: 12, width: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                <List component="div" disablePadding>
                  {rrhhItems.map((item, idx) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          pl: 4,
                          minHeight: 40,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            '& .MuiListItemText-primary': {
                              color: '#fff',
                              fontWeight: 600,
                            }
                          },
                        }}
                        selected={selectedMenu.main === 'rrhh' && selectedMenu.sub === idx}
                        onClick={() => handleMenuClick('rrhh', idx)}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', alignItems: 'center' }}>
                          <Box sx={{ width: 8, height: 8, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(255,255,255,0.04)' }} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontSize: '0.875rem', color: 'inherit' } }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>

            {/* Menú Boletines */}
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleSubMenuToggle('boletines')}
                sx={{
                  minHeight: 48,
                  mx: 2,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  borderRadius: 1,
                  backgroundColor: openSubMenu === 'boletines' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <CampaignIcon />
                </ListItemIcon>
                {drawerOpen && <ListItemText primary="Boletines" sx={{ opacity: drawerOpen ? 1 : 0 }} />}
                {drawerOpen && (openSubMenu === 'boletines' ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSubMenu === 'boletines' && drawerOpen} timeout="auto" unmountOnExit>
              <Box sx={{ position: 'relative', pl: 0 }}>
                <Box sx={{ position: 'absolute', left: drawerOpen ? 40 : 28, top: 12, bottom: 12, width: 2, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                <List component="div" disablePadding>
                  {boletinesItems.map((item, idx) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          pl: 4,
                          minHeight: 40,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            '& .MuiListItemText-primary': { color: '#fff', fontWeight: 600 }
                          },
                        }}
                        selected={selectedMenu.main === 'boletines' && selectedMenu.sub === idx}
                        onClick={() => handleMenuClick('boletines', idx)}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', alignItems: 'center' }}>
                          <Box sx={{ width: 8, height: 8, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(255,255,255,0.04)' }} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontSize: '0.875rem', color: 'inherit' } }} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>

            <ListItem disablePadding sx={{ display: 'block' }}>
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
            </ListItem>
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
