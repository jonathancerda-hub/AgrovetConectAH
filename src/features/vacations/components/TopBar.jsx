import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  InputBase,
  Popover,
  Breadcrumbs,
  Link,
  Fade,
  Zoom,
  alpha,
  Divider,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationPanel from './NotificationPanel';
import { authService } from '../../../services/auth.service';
import { notificacionesService } from '../../../services/notificaciones.service';

const settings = [
  { text: 'Mi Perfil', icon: <PersonIcon fontSize="small" />, action: 'profile' },
  { text: 'Mi Cuenta', icon: <SettingsIcon fontSize="small" />, action: 'account' },
  { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, action: 'dashboard' },
  { text: 'Cerrar Sesión', icon: <LogoutIcon fontSize="small" />, action: 'logout' },
];

export default function TopBar({ onMenuClick, title, breadcrumbs = [], onNavigate, onLogout }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchor);

  // Obtener usuario actual
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.nombre || currentUser?.email || 'Usuario';
  const userRole = currentUser?.rol || 'Colaborador';

  // Cargar contador de notificaciones no leídas
  React.useEffect(() => {
    fetchUnreadCount();
    // Recargar cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await notificacionesService.getUnread();
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error('Error al cargar contador de notificaciones:', error);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuAction = (action) => {
    handleCloseUserMenu();
    
    switch (action) {
      case 'profile':
        // Navegar a Mi Ficha
        if (onNavigate) {
          onNavigate('ficha');
        }
        break;
      case 'account':
        // Por ahora, mostrar alert. Después podemos crear un componente de configuración
        alert('Configuración de cuenta - Próximamente');
        break;
      case 'dashboard':
        // Navegar al portal
        if (onNavigate) {
          onNavigate('portal');
        }
        break;
      case 'logout':
        // Abrir dialog de confirmación
        setLogoutDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
    // Recargar el contador al cerrar el panel
    fetchUnreadCount();
  };

  const handleHelpClick = () => {
    // Abrir el manual de usuario en una nueva ventana
    window.open('/docs/manual-usuario.html', '_blank');
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    // Aquí puedes implementar la lógica de búsqueda
  };

  // Funciones para manejar el Dialog de Logout
  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  // Atajo de teclado Ctrl+K para búsqueda
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        handleSearchToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <React.Fragment>
      <Toolbar sx={{ minHeight: 56, px: 2, bgcolor: 'background.paper', color: 'text.primary' }}>
        <Zoom in timeout={300}>
          <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2, color: 'text.primary' }}>
            <MenuIcon />
          </IconButton>
        </Zoom>

        {/* Breadcrumbs */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexGrow: 1 }}>
          {breadcrumbs.length > 0 ? (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ color: 'text.primary' }}
            >
              <Link
                underline="hover"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'text.secondary', 
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
                onClick={() => onNavigate && onNavigate('portal')}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Inicio
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <Typography
                  key={index}
                  color={index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
                  sx={{ 
                    fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                    cursor: index === breadcrumbs.length - 1 ? 'default' : 'pointer',
                    '&:hover': index === breadcrumbs.length - 1 ? {} : {
                      color: 'primary.main',
                    }
                  }}
                  onClick={() => {
                    if (index < breadcrumbs.length - 1 && crumb.action && onNavigate) {
                      onNavigate(crumb.action);
                    }
                  }}
                >
                  {crumb.text || crumb}
                </Typography>
              ))}
            </Breadcrumbs>
          ) : (
            <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary' }}>
              {title}
            </Typography>
          )}
        </Box>

        {/* Barra de búsqueda con animación */}
        <Fade in={searchOpen} timeout={300}>
          <Box
            sx={{
              display: searchOpen ? 'flex' : 'none',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              px: 2,
              py: 0.5,
              boxShadow: 2,
              minWidth: 300,
              alignItems: 'center',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              id="search-input"
              placeholder="Buscar en toda la app..."
              value={searchValue}
              onChange={handleSearchChange}
              sx={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchOpen(false);
                  setSearchValue('');
                }
              }}
            />
          </Box>
        </Fade>

        <Box sx={{ flexGrow: searchOpen ? 0 : 1 }} />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Zoom in timeout={300}>
            <Tooltip title="Buscar (Ctrl + K)">
              <IconButton
                color="inherit"
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: 'primary.main',
                  },
                }}
                onClick={handleSearchToggle}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </Zoom>

          <Zoom in timeout={400}>
            <Tooltip title="Notificaciones">
              <IconButton
                color="inherit"
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: 'primary.main',
                  },
                }}
                onClick={handleNotificationClick}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Zoom>

          <Zoom in timeout={500}>
            <Tooltip title="Abrir ajustes">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0,
                  ml: 2,
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <AccountCircleIcon fontSize="medium" />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Zoom>

          {/* Menu de usuario */}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar-user"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                minWidth: 220,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                borderRadius: 2,
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {userName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {userRole}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            {settings.map((setting) => (
              <MenuItem
                key={setting.text}
                onClick={() => handleMenuAction(setting.action)}
                sx={{
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: setting.action === 'logout' ? 'error.light' : 'primary.light',
                    color: setting.action === 'logout' ? 'error.contrastText' : 'primary.contrastText',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: setting.action === 'logout' ? 'error.contrastText' : 'primary.contrastText',
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: setting.action === 'logout' ? 'error.main' : 'inherit' }}>
                  {setting.icon}
                </ListItemIcon>
                <Typography>{setting.text}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Botón móvil */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Panel de notificaciones */}
      <Popover
        open={isNotificationOpen}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        sx={{ mt: 1 }}
      >
        <NotificationPanel 
          onClose={handleNotificationClose} 
          onNavigate={onNavigate}
        />
      </Popover>

      {/* Menu móvil */}
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <SaveIcon />
          </IconButton>
          <p>Guardar</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notificaciones</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <HelpOutlineIcon />
          </IconButton>
          <p>Ayuda</p>
        </MenuItem>
      </Menu>

      {/* Dialog de Confirmación de Cierre de Sesión */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleCancelLogout}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: { xs: '90%', sm: 420 },
            background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }
        }}
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 1,
          pt: 3
        }}>
          <Box 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              borderRadius: '50%', 
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogoutIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h6" component="span" fontWeight="600">
            Cerrar Sesión
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText sx={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '1.05rem',
            mb: 2
          }}>
            ¿Estás seguro de que deseas cerrar sesión?
          </DialogContentText>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'rgba(0,0,0,0.25)', 
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PersonIcon fontSize="small" />
              <strong>Usuario:</strong> {userName}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.85)', 
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <SettingsIcon fontSize="small" />
              <strong>Rol:</strong> {userRole}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
          <Button 
            onClick={handleCancelLogout}
            variant="outlined"
            sx={{ 
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              borderWidth: 2,
              px: 3,
              fontWeight: 600,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.15)',
                borderWidth: 2,
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmLogout}
            variant="contained"
            startIcon={<LogoutIcon />}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.25)',
              color: 'white',
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.35)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
              }
            }}
            autoFocus
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
