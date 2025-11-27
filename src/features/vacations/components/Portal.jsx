import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, Chip, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, TextField, IconButton, Link, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CakeIcon from '@mui/icons-material/Cake';
import { publicacionesService } from '../../../services/publicaciones.service';
import { authService } from '../../../services/auth.service';
import { empleadosService } from '../../../services/empleados.service';
import { vacacionesService } from '../../../services/vacaciones.service';

const boletas = [
  { mes: 'Septiembre 2025', url: '#' },
  { mes: 'Agosto 2025', url: '#' },
  { mes: 'Julio 2025', url: '#' },
];

export default function Portal() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [diasVacaciones, setDiasVacaciones] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [empleadoInfo, setEmpleadoInfo] = useState(null);
  const [cumpleaneros, setCumpleaneros] = useState([]);
  const [tabActual, setTabActual] = useState('todo'); // 'todo', 'publicaciones', 'cumpleanos'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener usuario actual
        const currentUser = authService.getCurrentUser();
        
        // Obtener información del empleado (opcional)
        if (currentUser?.empleadoId) {
          try {
            const empleadoData = await empleadosService.getById(currentUser.empleadoId);
            setEmpleadoInfo(empleadoData);
            
            // Obtener días de vacaciones disponibles
            try {
              const vacacionesData = await vacacionesService.getResumenVacaciones(currentUser.empleadoId);
              setDiasVacaciones(vacacionesData.dias_disponibles || 0);
            } catch (vacError) {
              console.warn('No se pudieron cargar días de vacaciones:', vacError);
              setDiasVacaciones(0);
            }
          } catch (empError) {
            console.warn('No se pudo cargar información del empleado:', empError);
            // No mostramos error, simplemente no cargamos la info del empleado
          }
        }
        
        // Obtener publicaciones
        try {
          const data = await publicacionesService.getAll();
          
          // Formatear las publicaciones
          const formattedData = data.map(pub => ({
            id: pub.id,
            autor: `${pub.autor_nombres} ${pub.autor_apellidos}`,
            fecha: new Date(pub.fecha_publicacion).toLocaleDateString('es-PE', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            }),
            titulo: pub.titulo,
            contenido: pub.contenido,
            imageUrl: pub.imagen_url,
            reacciones: pub.total_reacciones || 0,
          }));
          
          setPublicaciones(formattedData);
        } catch (pubError) {
          console.warn('No se pudieron cargar publicaciones:', pubError);
          setPublicaciones([]);
        }
        
        // Obtener cumpleañeros del día
        try {
          const cumpleanerosData = await empleadosService.getCumpleaneros();
          setCumpleaneros(cumpleanerosData);
        } catch (cumpleError) {
          console.warn('No se pudo cargar cumpleañeros:', cumpleError);
          setCumpleaneros([]);
        }
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        // No mostramos error general si las llamadas individuales ya manejaron sus errores
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, width: '100%' }}>
        {/* Publicaciones - columna principal */}
        <Grid size={{ xs: 12, md: 8.5 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button 
              variant={tabActual === 'todo' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setTabActual('todo')}
            >
              Todo
            </Button>
            <Button 
              variant={tabActual === 'publicaciones' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setTabActual('publicaciones')}
            >
              Publicaciones
            </Button>
            <Button 
              variant={tabActual === 'cumpleanos' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setTabActual('cumpleanos')}
            >
              Cumpleaños
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Contenido según la pestaña seleccionada */}
          {tabActual === 'cumpleanos' ? (
            /* Vista de Cumpleaños */
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                🎂 Cumpleaños de Hoy
              </Typography>
              {cumpleaneros.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay cumpleaños hoy
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {cumpleaneros.map((cumpleanero) => (
                    <Box 
                      key={cumpleanero.id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        mb: 2,
                        bgcolor: '#fff3e0',
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Avatar 
                        src={cumpleanero.foto_perfil} 
                        sx={{ bgcolor: '#f57c00', width: 56, height: 56 }}
                      >
                        {!cumpleanero.foto_perfil && <CakeIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {cumpleanero.nombre_completo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <strong>{cumpleanero.puesto || 'Sin puesto'}</strong>
                          {cumpleanero.area && (
                            <>
                              <span>•</span>
                              <span>{cumpleanero.area}</span>
                            </>
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cumpleanero.edad && `${cumpleanero.edad} años`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton color="primary" size="small">
                          <ThumbUpAltOutlinedIcon />
                        </IconButton>
                        <IconButton color="error" size="small">
                          <FavoriteBorderIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          ) : (
            /* Vista de Publicaciones (Todo o Publicaciones) */
            <>
              {publicaciones.length === 0 && !error && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No hay publicaciones disponibles</Typography>
                </Paper>
              )}

              {publicaciones.map((pub) => (
                <Paper key={pub.id} sx={{ mb: 3, p: 2 }}>
                  {/* Autor y fecha primero */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{pub.autor}</Typography>
                      <Typography variant="caption" color="text.secondary">{pub.fecha}</Typography>
                    </Box>
                  </Box>
                  
                  {/* Título y contenido */}
                  <Typography variant="h6" fontWeight={700} gutterBottom>{pub.titulo}</Typography>
                  <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>{pub.contenido}</Typography>
                  
                  {/* Imagen después del texto */}
                  {pub.imageUrl && (
                    <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, mb: 2 }}>
                      <img
                        src={pub.imageUrl}
                        alt="Publicación"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '500px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}
                    
                  {/* Reacciones y comentarios */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FavoriteBorderIcon fontSize="small" />
                    <ThumbUpAltOutlinedIcon fontSize="small" />
                    <Typography variant="caption">{pub.reacciones} reacciones</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField size="small" placeholder="Me gusta" variant="outlined" sx={{ flex: 1 }} />
                    <IconButton color="primary"><SendIcon /></IconButton>
                  </Box>
                </Paper>
              ))}
            </>
          )}
        </Grid>
        
        {/* Panel lateral derecho */}
        <Grid size={{ xs: 12, md: 3.5 }}>
          {/* Tarjeta de Vacaciones Disponibles */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BeachAccessIcon sx={{ fontSize: 32, color: '#1976d2' }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Vacaciones disponibles
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    {diasVacaciones} días
                  </Typography>
                </Box>
              </Box>
              <Button size="small" variant="text" color="primary">
                Solicitar
              </Button>
            </Box>
          </Paper>

          {/* Tarjeta de Cumpleaños */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CakeIcon sx={{ fontSize: 32, color: '#f57c00' }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Hoy <Typography component="span" variant="h5" fontWeight={700} color="primary">{cumpleaneros.length}</Typography> colaboradores celebran su cumpleaños
                  </Typography>
                </Box>
              </Box>
              <Link 
                component="button"
                variant="body2"
                onClick={() => setTabActual('cumpleanos')}
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                Ver
              </Link>
            </Box>
          </Paper>

          {/* Tarjeta de Tareas Pendientes */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>Tareas Pendientes</Typography>
              <Button size="small" variant="outlined">+</Button>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              <Typography>¡Muy bien!</Typography>
              <Typography variant="caption">Nada por el momento</Typography>
            </Box>
          </Paper>

          {/* Tarjeta de Solicitar documento */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ fontSize: 32, color: '#7b1fa2' }} />
              <Typography variant="body2" fontWeight={600}>
                Solicitar certificado o documento
              </Typography>
            </Box>
          </Paper>

          {/* Accesos directos */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>Accesos directos</Typography>
              <Chip label="F1" color="success" size="small" />
            </Box>
            <List dense>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon><AssignmentTurnedInIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Últimas boletas de pago" />
              </ListItem>
              {boletas.map((b) => (
                <ListItem key={b.mes} sx={{ pl: 4 }}>
                  <ListItemIcon><ArrowForwardIosIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={<Link href={b.url}>{b.mes}</Link>} />
                </ListItem>
              ))}
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Generar certificado o documento" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon><CardGiftcardIcon color="warning" /></ListItemIcon>
                <ListItemText primary="Beneficios" />
              </ListItem>
            </List>
          </Paper>
          
          {/* Links de interés */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Links de interés</Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ 
                  mb: 1, 
                  background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
                  color: 'white !important'
                }}>
                Mi Marcación
              </Button>
              <Typography variant="caption" color="text.secondary">¡Ya puedes registrar tu asistencia!</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
