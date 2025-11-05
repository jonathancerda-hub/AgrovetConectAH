import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Solicitud aprobada',
    message: 'Tu solicitud de vacaciones del 15-20 Nov ha sido aprobada',
    time: 'Hace 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Nuevo boletín publicado',
    message: 'Se ha publicado: "Beneficios 2025"',
    time: 'Hace 1 hora',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Solicitud pendiente',
    message: 'Tienes 2 solicitudes por aprobar',
    time: 'Hace 3 horas',
    read: true,
  },
];

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'warning':
        return <InfoIcon sx={{ color: 'warning.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box
      sx={{
        width: 360,
        maxHeight: 500,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Notificaciones
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              color="error"
              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Typography>
        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<MarkEmailReadIcon />}
            onClick={handleMarkAllAsRead}
          >
            Marcar todas
          </Button>
        )}
      </Box>

      {/* Lista de notificaciones */}
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">No tienes notificaciones</Typography>
          </Box>
        ) : (
          notifications.map((notif, index) => (
            <React.Fragment key={notif.id}>
              <ListItem
                sx={{
                  bgcolor: notif.read ? 'transparent' : 'action.hover',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                  cursor: 'pointer',
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDelete(notif.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                onClick={() => handleMarkAsRead(notif.id)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {getIcon(notif.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      fontWeight={notif.read ? 400 : 600}
                    >
                      {notif.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {notif.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Button fullWidth size="small" onClick={onClose}>
          Ver todas las notificaciones
        </Button>
      </Box>
    </Box>
  );
}
