import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

export default function DashboardRRHH() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', p: 2, margin: 'auto', mt: 4, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
        <DashboardIcon sx={{ verticalAlign: 'middle', mr: 1 }}/>
        Dashboard RRHH
      </Typography>
      <Divider />
      <nav aria-label="menú de rrhh">
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/crear-boletin">
              <ListItemIcon>
                <AddToPhotosIcon />
              </ListItemIcon>
              <ListItemText primary="Crear Boletín" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/portal">
              <ListItemIcon>
                <DynamicFeedIcon />
              </ListItemIcon>
              <ListItemText primary="Ver Portal" />
            </ListItemButton>
          </ListItem>
          {/* Aquí puedes agregar más enlaces a futuro */}
        </List>
      </nav>
    </Box>
  );
}