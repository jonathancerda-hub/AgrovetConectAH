import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Badge, Tooltip, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';

const user = {
  name: 'Jorge Luis Jonathan Cerda Piaca',
};

const settings = ['Mi Perfil', 'Mi Cuenta', 'Dashboard', 'Cerrar Sesión'];

export default function TopBar({ onMenuClick, title }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <React.Fragment>
      <Toolbar sx={{ minHeight: 56, px: 2, bgcolor: 'background.paper', color: 'text.primary' }}>
        <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2, color: 'text.primary' }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1, color: 'text.primary' }}>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Tooltip title="Guardar">
            <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notificaciones">
            <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Ayuda">
            <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Abrir ajustes">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2, color: 'text.secondary' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <AccountCircleIcon fontSize="medium" />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar-user"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* Se añade un div con el nombre del usuario y un divider */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">Coordinador de Proyectos</Typography>
            </Box>
            <MenuItem divider />
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
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
