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
  Paper,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notificacionesService } from '../../../services/notificaciones.service';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificacionesService.getAll();
      
      const formattedData = data.map(notif => ({
        id: notif.id,
        type: mapTipoToType(notif.tipo_notificacion),
        title: notif.titulo,
        message: notif.mensaje,
        time: formatRelativeTime(notif.fecha_creacion),
        fullDate: new Date(notif.fecha_creacion),
        read: notif.leida,
        solicitudId: notif.solicitud_id,
      }));
      
      setNotifications(formattedData);
      setError('');
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const mapTipoToType = (tipoNotificacion) => {
    const mapping = {
      'aprobada': 'success',
      'rechazada': 'error',
      'recordatorio': 'info',
      'alerta': 'warning',
      'info': 'info'
    };
    return mapping[tipoNotificacion] || 'info';
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
    
    return date.toLocaleDateString('es-PE', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 32 }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 32 }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main', fontSize: 32 }} />;
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

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount > 0 ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer` : 'No tienes notificaciones sin leer'}
              </Typography>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailReadIcon />}
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </Stack>

        {/* Filtros */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            label="Todas"
            color={filter === 'all' ? 'primary' : 'default'}
            onClick={() => setFilter('all')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`Sin leer (${unreadCount})`}
            color={filter === 'unread' ? 'primary' : 'default'}
            onClick={() => setFilter('unread')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="Leídas"
            color={filter === 'read' ? 'primary' : 'default'}
            onClick={() => setFilter('read')}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lista de notificaciones */}
      {filteredNotifications.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {filter === 'unread' ? 'No tienes notificaciones sin leer' : 
             filter === 'read' ? 'No tienes notificaciones leídas' :
             'No tienes notificaciones'}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Las notificaciones sobre tus vacaciones aparecerán aquí
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  sx={{
                    bgcolor: notif.read ? 'transparent' : 'action.hover',
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notif.read && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleMarkAsRead(notif.id)}
                          title="Marcar como leída"
                        >
                          <MarkEmailReadIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(notif.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {getIcon(notif.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={notif.read ? 500 : 700}
                        >
                          {notif.title}
                        </Typography>
                        {!notif.read && (
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main'
                          }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {notif.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
