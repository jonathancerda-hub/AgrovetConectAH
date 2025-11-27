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
      const response = await fetch('http://localhost:3001/api/aprobacion/subordinados', {
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
      
      setTeamMembers(data.subordinados || []);
      setStats({
        totalMiembros: data.subordinados?.length || 0,
        activos: data.subordinados?.length || 0,
        deVacaciones: 0 // Esto se puede calcular si tienes el estado
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
      field: 'puesto',
      headerName: 'Puesto',
      flex: 1,
      minWidth: 180
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
              borderTop: 3, 
              borderColor: 'primary.main',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <GroupsIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'primary.main',
                  mb: 1
                }} 
              />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1.5 }}>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              borderTop: 3, 
              borderColor: 'success.main',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CalendarMonthIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'success.main',
                  mb: 1
                }} 
              />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1.5 }}>
                {stats.activos}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                textTransform="uppercase"
                fontWeight={600}
                letterSpacing={0.5}
              >
                Empleados Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              borderTop: 3, 
              borderColor: 'warning.main',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AccessTimeIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'warning.main',
                  mb: 1
                }} 
              />
              <Typography variant="h3" fontWeight={700} sx={{ my: 1.5 }}>
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
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Mi Equipo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {teamMembers.length} {teamMembers.length === 1 ? 'persona' : 'personas'} a tu cargo
            </Typography>
          </Box>
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