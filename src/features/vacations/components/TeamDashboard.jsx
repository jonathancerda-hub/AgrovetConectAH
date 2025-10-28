import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Button, Avatar, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';

// Datos de ejemplo
const stats = [
  { label: 'Miembros del Equipo', value: 8, icon: <GroupsIcon fontSize="large" color="primary" /> },
  { label: 'Solicitudes Pendientes', value: 3, icon: <AccessTimeIcon fontSize="large" color="warning" /> },
  { label: 'Solicitudes Aprobadas', value: 12, icon: <CalendarMonthIcon fontSize="large" color="success" /> },
];

const teamMembers = [
  { id: 1, name: 'Ana García', position: 'Desarrollador Frontend', email: 'ana.garcia@example.com', hireDate: '2022-01-15', vacationDays: 12, status: 'Activo' },
  { id: 2, name: 'Carlos Martinez', position: 'Desarrollador Backend', email: 'carlos.martinez@example.com', hireDate: '2021-11-20', vacationDays: 8, status: 'Activo' },
  { id: 3, name: 'Laura Rodriguez', position: 'Diseñadora UI/UX', email: 'laura.rodriguez@example.com', hireDate: '2022-03-10', vacationDays: 15, status: 'De Vacaciones' },
  { id: 4, name: 'Pedro Sanchez', position: 'QA Tester', email: 'pedro.sanchez@example.com', hireDate: '2022-05-01', vacationDays: 10, status: 'Activo' },
  { id: 5, name: 'Sofia Lopez', position: 'Project Manager', email: 'sofia.lopez@example.com', hireDate: '2020-08-22', vacationDays: 5, status: 'Inactivo' },
];

const columns = [
  {
    field: 'name',
    headerName: 'Empleado',
    flex: 1.5,
    minWidth: 250,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{params.row.name.charAt(0)}</Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>{params.row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.position}</Typography>
        </Box>
      </Box>
    ),
  },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  { field: 'hireDate', headerName: 'Contratación', width: 130 },
  {
    field: 'vacationDays',
    headerName: 'Vacaciones',
    width: 120,
    renderCell: (params) => (
      <Chip label={`${params.value} días`} color="info" variant="outlined" size="small" />
    ),
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 120,
    renderCell: (params) => {
      let color;
      switch (params.value) {
        case 'Activo': color = 'success'; break;
        case 'De Vacaciones': color = 'warning'; break;
        case 'Inactivo': color = 'error'; break;
        default: color = 'default';
      }
      return <Chip label={params.value} color={color} size="small" />;
    },
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 220,
    sortable: false,
    renderCell: () => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" startIcon={<VisibilityIcon />}>
          Solicitudes
        </Button>
        <Button variant="outlined" size="small" color="secondary" startIcon={<PersonIcon />}>
          Perfil
        </Button>
      </Box>
    ),
  },
];

export default function TeamDashboard() {
  return (
    <Box>
      {/* Sección de Bienvenida */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Mi Equipo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestiona y supervisa a los miembros de tu equipo de trabajo.
        </Typography>
      </Box>

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                {stat.icon}
                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" textTransform="uppercase">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección de Miembros del Equipo */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Miembros del Equipo
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              color: 'white',
            }}
          >
            Asignar Trabajador
          </Button>
        </Box>

        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={teamMembers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}