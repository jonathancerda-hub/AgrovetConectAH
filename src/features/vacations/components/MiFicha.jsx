import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import FlightIcon from '@mui/icons-material/Flight';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { empleadosService } from '../../../services/empleados.service';

const MiFicha = ({ currentUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosEmpleado = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 MiFicha - currentUser:', currentUser);
        console.log('🔍 MiFicha - empleadoId:', currentUser?.empleadoId);
        
        if (!currentUser?.empleadoId) {
          throw new Error('No se encontró el ID del empleado');
        }

        const data = await empleadosService.getById(currentUser.empleadoId);
        setEmpleado(data);
      } catch (err) {
        console.error('Error al cargar datos del empleado:', err);
        setError(err.message || 'Error al cargar los datos del empleado');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEmpleado();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const calcularAntiguedad = (fechaIngreso) => {
    if (!fechaIngreso) return 'N/A';
    
    const inicio = new Date(fechaIngreso);
    const hoy = new Date();
    
    let años = hoy.getFullYear() - inicio.getFullYear();
    let meses = hoy.getMonth() - inicio.getMonth();
    
    if (meses < 0) {
      años--;
      meses += 12;
    }
    
    return `${años} años, ${meses} meses`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!empleado) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        No se encontraron datos del empleado
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* COLUMNA IZQUIERDA - Foto y Menú de Navegación */}
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            bgcolor: '#f5f5f5',
            minHeight: '100vh',
            borderRadius: 0,
            width: 280
          }}
        >
            {/* Foto de perfil */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 140,
                    height: 140,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    border: '4px solid white',
                    boxShadow: 2
                  }}
                >
                  <PersonIcon sx={{ fontSize: '4rem' }} />
                </Avatar>
                
                {/* Botón para subir foto */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid white',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white', fontSize: '20px' }}>
                    📷
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {empleado.nombres?.split(' ')[0] || 'Usuario'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {empleado.puesto || 'Sin puesto'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Menú de navegación */}
            <List sx={{ p: 0 }}>
              <ListItemButton 
                selected={tabValue === 0}
                onClick={() => setTabValue(0)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Datos Personales" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 1}
                onClick={() => setTabValue(1)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <ContactEmergencyIcon />
                </ListItemIcon>
                <ListItemText primary="Contacto" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 2}
                onClick={() => setTabValue(2)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <FamilyRestroomIcon />
                </ListItemIcon>
                <ListItemText primary="Dependientes" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 3}
                onClick={() => setTabValue(3)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <FlightIcon />
                </ListItemIcon>
                <ListItemText primary="Inmigración" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 4}
                onClick={() => setTabValue(4)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Trabajo" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 5}
                onClick={() => setTabValue(5)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary="Salario" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 6}
                onClick={() => setTabValue(6)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Reporta a" />
              </ListItemButton>

              <Divider sx={{ my: 2 }} />
              
              <ListItemButton 
                selected={tabValue === 7}
                onClick={() => setTabValue(7)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Boletas de Pago" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 8}
                onClick={() => setTabValue(8)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Documentos" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 9}
                onClick={() => setTabValue(9)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Bitácora" />
              </ListItemButton>
              
              <ListItemButton 
                selected={tabValue === 10}
                onClick={() => setTabValue(10)}
                sx={{ 
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText primary="Talento" />
              </ListItemButton>
            </List>
          </Paper>
        </Box>

        {/* COLUMNA DERECHA - Contenido */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={0} sx={{ minHeight: '100vh', borderRadius: 0, p: 5, bgcolor: '#fafafa' }}>
            
            {/* Tab 0 - Datos Personales */}
            
            {/* Tab 0 - Datos Personales */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom color="primary.main" sx={{ mb: 4 }}>
                  Datos Personales
                </Typography>
                  
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Nombre Completo del Empleado*
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Box 
                      sx={{ 
                        flex: 1,
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.nombres?.split(' ')[0] || 'N/A'}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        flex: 1,
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.nombres?.split(' ')[1] || ''}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        flex: 1,
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.apellidos || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Código de Empleado
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5,
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.codigo_empleado || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      DNI
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5,
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.dni || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Correo Electrónico
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 1.5,
                      mt: 1
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {empleado.email || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Fecha de Nacimiento
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5,
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.fecha_nacimiento ? formatearFecha(empleado.fecha_nacimiento) : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Género
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5,
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.genero || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 1 - Contacto */}
            {tabValue === 1 && (
              <Box textAlign="center" py={5}>
                <ContactEmergencyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Contacto en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 2 - Dependientes */}
            {tabValue === 2 && (
              <Box textAlign="center" py={5}>
                <FamilyRestroomIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Dependientes en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 3 - Inmigración */}
            {tabValue === 3 && (
              <Box textAlign="center" py={5}>
                <FlightIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Inmigración en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 4 - Trabajo */}
            {tabValue === 4 && (
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom color="primary.main" sx={{ mb: 4 }}>
                  Información de Trabajo
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Puesto
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 1.5,
                      mt: 1
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {empleado.puesto || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Área / Departamento
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 1.5,
                      mt: 1
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {empleado.area || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Fecha de Ingreso
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5,
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {formatearFecha(empleado.fecha_ingreso)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Tipo de Contrato
                    </Typography>
                    <Box 
                      sx={{ 
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1.5,
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {empleado.tipo_contrato || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Antigüedad
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 1.5,
                      mt: 1
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {calcularAntiguedad(empleado.fecha_ingreso)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Días de Vacaciones Disponibles
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: '#e8f5e9',
                      border: '1px solid #4caf50',
                      borderRadius: 1,
                      p: 1.5,
                      mt: 1
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="success.main">
                      {empleado.dias_vacaciones || 0} días
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Tab 5 - Salario */}
            {tabValue === 5 && (
              <Box textAlign="center" py={5}>
                <AttachMoneyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Salario en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 6 - Reporta a */}
            {tabValue === 6 && (
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom color="primary.main" sx={{ mb: 4 }}>
                  Reporta a
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Supervisor Directo
                  </Typography>
                  <Box 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 1.5,
                      mt: 1
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {empleado.supervisor_nombre || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Tab 7 - Boletas de Pago */}
            {tabValue === 7 && (
              <Box textAlign="center" py={5}>
                <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Boletas de Pago en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 8 - Documentos */}
            {tabValue === 8 && (
              <Box textAlign="center" py={5}>
                <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Documentos en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 9 - Bitácora */}
            {tabValue === 9 && (
              <Box textAlign="center" py={5}>
                <HistoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Bitácora en desarrollo
                </Typography>
              </Box>
            )}

            {/* Tab 10 - Talento */}
            {tabValue === 10 && (
              <Box textAlign="center" py={5}>
                <EmojiEventsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Módulo de Talento en desarrollo
                </Typography>
              </Box>
            )}

          </Paper>
        </Box>
      </Box>
  );
};

export default MiFicha;
