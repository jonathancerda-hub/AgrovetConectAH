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
import NotificationPanel from './NotificationPanel';

const user = {
  name: 'Jorge Luis Jonathan Cerda Piaca',
};

const settings = ['Mi Perfil', 'Mi Cuenta', 'Dashboard', 'Cerrar Sesión'];

export default function TopBar({ onMenuClick, title, breadcrumbs = [] }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchor);

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

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
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
                sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', cursor: 'pointer' }}
                onClick={() => {}}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Inicio
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <Typography
                  key={index}
                  color={index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
                  sx={{ fontWeight: index === breadcrumbs.length - 1 ? 600 : 400 }}
                >
                  {crumb}
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
            <Tooltip title="Guardar">
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
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Zoom>

          <Zoom in timeout={500}>
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
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Zoom>

          <Zoom in timeout={600}>
            <Tooltip title="Ayuda">
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
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Zoom>

          <Zoom in timeout={700}>
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
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coordinador de Proyectos
              </Typography>
            </Box>
            <MenuItem divider />
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={handleCloseUserMenu}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Typography textAlign="center">{setting}</Typography>
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
        <NotificationPanel onClose={handleNotificationClose} />
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
            <Badge badgeContent={2} color="error">
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
    </React.Fragment>
  );
}
