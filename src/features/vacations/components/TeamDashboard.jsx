import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Button, Avatar, Chip, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import { empleadosService } from '../../../services/empleados.service';
import { authService } from '../../../services/auth.service';

export default function TeamDashboard() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [empleadosDeVacaciones, setEmpleadosDeVacaciones] = useState([]);
  const [stats, setStats] = useState({
    totalMiembros: 0,
    activos: 0,
    deVacaciones: 0
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Obtener subordinados directos del usuario actual
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      // 🔍 DEBUG: Ver información del usuario actual
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔍 DEBUG TeamDashboard:');
      console.log('  - API_URL:', API_URL);
      console.log('  - Usuario local:', userData);
      console.log('  - Token existe:', !!token);
      
      const response = await fetch(`${API_URL}/aprobacion/subordinados`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar subordinados');
      }
      
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      console.log('📊 Subordinados:', data.subordinados);
      console.log('📊 Estadísticas:', data.estadisticas);
      
      const subordinados = data.subordinados || [];
      setTeamMembers(subordinados);

      // Mostrar estadísticas si están disponibles
      if (data.estadisticas) {
        console.log(`👥 Equipo completo: ${data.estadisticas.total} personas`);
        console.log(`   - Directos: ${data.estadisticas.directos}`);
        console.log(`   - Indirectos: ${data.estadisticas.indirectos}`);
        console.log(`   - Niveles de jerarquía: ${data.estadisticas.niveles}`);
      }

      // Obtener vacaciones de CADA subordinado (igual que el calendario)
      let empleadosEnVacaciones = [];
      
      if (subordinados.length > 0) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        console.log('📅 Fecha HOY:', hoy.toISOString().split('T')[0]);

        // Cargar solicitudes de cada subordinado
        const vacacionesPromises = subordinados.map(async (subordinado) => {
          try {
            const solicitudesResponse = await fetch(`${API_URL}/vacaciones/solicitudes/${subordinado.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (solicitudesResponse.ok) {
              const solicitudes = await solicitudesResponse.json();
              
              // Filtrar solo aprobadas y activas HOY
              const activas = solicitudes.filter(sol => {
                if (sol.estado !== 'aprobada') return false;
                
                const inicio = new Date(sol.fecha_inicio);
                const fin = new Date(sol.fecha_fin);
                inicio.setHours(0, 0, 0, 0);
                fin.setHours(0, 0, 0, 0);
                
                return hoy >= inicio && hoy <= fin;
              });

              if (activas.length > 0) {
                console.log(`🏖️ ${subordinado.nombres} ${subordinado.apellidos} está de vacaciones:`, activas);
                return {
                  nombre: `${subordinado.nombres} ${subordinado.apellidos}`,
                  solicitudes: activas
                };
              }
            }
          } catch (err) {
            console.error(`Error al cargar vacaciones de ${subordinado.nombres}:`, err);
          }
          return null;
        });

        const resultados = await Promise.all(vacacionesPromises);
        empleadosEnVacaciones = resultados.filter(r => r !== null);
        
        console.log('👥 Empleados de vacaciones HOY:', empleadosEnVacaciones);
      }

      setEmpleadosDeVacaciones(empleadosEnVacaciones);
      
      setStats({
        totalMiembros: subordinados.length,
        activos: subordinados.length - empleadosEnVacaciones.length,
        deVacaciones: empleadosEnVacaciones.length
      });
    } catch (err) {
      console.error('Error al cargar equipo:', err);
      setError('No se pudo cargar la información del equipo');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'empleado',
      headerName: 'Empleado',
      flex: 1.5,
      minWidth: 280,
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%',
          py: 0
        }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2,
              width: 40,
              height: 40,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {params.row.nombres?.charAt(0) || 'E'}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
              {params.row.nivel_jerarquico > 1 ? '   '.repeat(params.row.nivel_jerarquico - 1) + '└─ ' : ''}
              {params.row.nombres} {params.row.apellidos}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              {params.row.puesto}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1.2,
      minWidth: 220
    },
    { 
      field: 'area', 
      headerName: 'Área', 
      flex: 1,
      minWidth: 180
    },
    {
      field: 'nivel_jerarquico',
      headerName: 'Nivel',
      width: 80,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`N${params.value}`} 
          size="small"
          color={params.value === 1 ? 'primary' : 'default'}
          sx={{ fontWeight: 600 }}
        />
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError('')}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Sección de Bienvenida */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Mi Equipo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona y supervisa a tus subordinados directos.
        </Typography>
      </Box>

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              borderLeft: 4, 
              borderColor: 'primary.main',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <GroupsIcon 
                sx={{ 
                  fontSize: 56, 
                  color: 'primary.main'
                }} 
              />
              <Box>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {stats.totalMiembros}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  textTransform="uppercase"
                  fontWeight={600}
                  letterSpacing={0.5}
                >
                  Miembros del Equipo
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              borderLeft: 4, 
              borderColor: 'warning.main',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon 
                  sx={{ 
                    fontSize: 56, 
                    color: 'warning.main'
                  }} 
                />
                <Box>
                  <Typography variant="h3" fontWeight={700} color="warning.main">
                    {stats.deVacaciones}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    textTransform="uppercase"
                    fontWeight={600}
                    letterSpacing={0.5}
                  >
                    De Vacaciones
                  </Typography>
                </Box>
              </Box>
              {empleadosDeVacaciones.length > 0 && (
                <Box sx={{ mt: 1, pl: 1 }}>
                  {empleadosDeVacaciones.map((emp, idx) => (
                    <Chip
                      key={idx}
                      label={emp.nombre}
                      size="small"
                      sx={{ 
                        mb: 0.5, 
                        mr: 0.5,
                        bgcolor: 'warning.light',
                        color: 'warning.dark',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sección de Miembros del Equipo */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary">
            {teamMembers.length} {teamMembers.length === 1 ? 'persona' : 'personas'} a tu cargo
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          {teamMembers.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes subordinados directos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los empleados que reporten directamente a ti aparecerán aquí.
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={teamMembers}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              autoHeight
              disableSelectionOnClick
              getRowId={(row) => row.id}
              rowHeight={60}
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#333',
                  borderBottom: '2px solid #e0e0e0'
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row': {
                  maxHeight: '60px !important',
                  minHeight: '60px !important'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer'
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '2px solid #e0e0e0',
                  backgroundColor: '#fafafa'
                }
              }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}