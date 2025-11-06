import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { notificacionesService } from '../../../services/notificaciones.service';

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificacionesService.getAll();
      
      // Formatear notificaciones para que coincidan con la estructura esperada
      const formattedData = data.map(notif => ({
        id: notif.id,
        type: notif.tipo, // 'success', 'info', 'warning', 'error'
        title: notif.titulo,
        message: notif.mensaje,
        time: formatRelativeTime(notif.fecha_creacion),
        read: notif.leido,
      }));
      
      setNotifications(formattedData);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  };

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

  const handleMarkAsRead = async (id) => {
    try {
      await notificacionesService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificacionesService.delete(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificacionesService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <Box sx={{ width: 360, p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

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
