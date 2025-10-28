
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Box, Collapse, ListItemButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import AvailableDays from './features/vacations/components/AvailableDays';
import RequestVacationPage from './features/vacations/RequestVacationPage';
import RequestForm from './features/vacations/components/RequestForm';
import VacationCalendar from './features/vacations/components/VacationCalendar';
import RequestsList from './features/vacations/components/RequestsList';
import ApprovalDashboard from './features/vacations/components/ApprovalDashboard';
import TopBar from './features/vacations/components/TopBar';
import { CssBaseline, useTheme, useMediaQuery } from '@mui/material';

const drawerWidth = 240;

import GroupIcon from '@mui/icons-material/Group';

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



const portalComponent = <Portal />;
const fichaComponent = <MiFicha />;

const vacacionesItems = [
  { text: 'Dashboard', icon: <EventAvailableIcon />, component: <AvailableDays available={availableDaysData.available} taken={availableDaysData.taken} /> },
  { text: 'Formulario de Solicitud', icon: <AssignmentIcon />, component: <RequestVacationPage /> },
  { text: 'Calendario', icon: <CalendarMonthIcon />, component: <VacationCalendar events={calendarEvents} /> },
  { text: 'Lista de Solicitudes', icon: <ListAltIcon />, component: <RequestsList requests={requestsData} /> },
  { text: 'Panel de Aprobación', icon: <SupervisorAccountIcon />, component: <ApprovalDashboard requests={approvalRequests} /> },
];

// Placeholder components para el nuevo menú de RRHH
const ControlVacacionesComponent = () => <Typography>Página de Control de Vacaciones</Typography>;
const HistorialesComponent = () => <Typography>Página de Historiales</Typography>;

const rrhhItems = [
  { text: 'Control de Vacaciones', icon: <FactCheckIcon />, component: <ControlVacacionesComponent /> },
  { text: 'Historiales', icon: <HistoryIcon />, component: <HistorialesComponent /> },
];

// Placeholder component para Gestión de Empleados
const GestionEmpleadosComponent = () => <Typography>Página de Gestión de Empleados</Typography>;

// Placeholder component para Mi Equipo
const SolicitarColaboradorComponent = () => <Typography>Página para Solicitar Colaborador</Typography>;

const equipoItems = [
  { text: 'Solicitar Colaborador', icon: <PersonAddIcon />, component: <NewCollaboratorForm /> },
];


function App() {
  const [selectedMenu, setSelectedMenu] = useState({ main: 'portal', sub: 0 });
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState('vacaciones'); // Controla qué submenú está abierto
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

  let mainContent;
  let pageTitle = 'Portal'; // Título por defecto
  if (selectedMenu.main === 'portal') {
    mainContent = portalComponent;
  } else if (selectedMenu.main === 'ficha') {
    mainContent = fichaComponent;
  } else if (selectedMenu.main === 'vacaciones') {
    mainContent = vacacionesItems[selectedMenu.sub].component;
    pageTitle = vacacionesItems[selectedMenu.sub].text;
  } else if (selectedMenu.main === 'rrhh') {
    mainContent = rrhhItems[selectedMenu.sub].component;
    pageTitle = rrhhItems[selectedMenu.sub].text;
  } else if (selectedMenu.main === 'empleados') {
    mainContent = <GestionEmpleadosComponent />;
    pageTitle = 'Gestión de Empleados';
  } else if (selectedMenu.main === 'equipo') {
    mainContent = equipoItems[selectedMenu.sub].component;
    pageTitle = equipoItems[selectedMenu.sub].text;
  }

  // Si el usuario no está autenticado, muestra solo el componente Login.
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Si el usuario está autenticado, muestra el layout completo de la aplicación.
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          overflowX: 'hidden',
          transition: 'width 0.2s',
          borderRight: 'none',
          background: '#2a3f54',
          color: 'rgba(255, 255, 255, 0.8)',
          '& .MuiListItemIcon-root': {
            color: 'rgba(255, 255, 255, 0.8)',
          },
        },
      }}
    >
      <Toolbar />
      <Box>
        {drawerOpen && (
          <Box sx={{ textAlign: 'center', p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <img
              src="/img/conect.png"
              alt="Conecta Logo"
              style={{ width: '80%', maxWidth: 150 }}
            />
          </Box>
        )}
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
                <ListItemText primary="Portal" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
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
                <ListItemText primary="Mi ficha" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
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
                <ListItemText primary="Mi Equipo" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
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
                <ListItemText primary="Vacaciones" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
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
                <ListItemText primary="Dashboard RRHH" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
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
                <ListItemText primary="Gestión de Empleados" sx={{ opacity: drawerOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={theme => ({
          flexGrow: 1,
          bgcolor: '#f7f7f7',
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
