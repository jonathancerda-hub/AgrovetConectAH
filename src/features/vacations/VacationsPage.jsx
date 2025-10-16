import React from 'react';
import VacationCalendar from './components/VacationCalendar';
import RequestForm from './components/RequestForm';
import RequestsList from './components/RequestsList';
import AvailableDays from './components/AvailableDays';
import ApprovalDashboard from './components/ApprovalDashboard';
import { Grid, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Función para obtener los datos de vacaciones desde la API
const fetchVacations = async () => {
  // Simulación de una llamada a la API. Reemplaza la URL con tu endpoint real.
  // const { data } = await axios.get('/api/vacations');
  // Usaremos datos de ejemplo por ahora, simulando la respuesta de la API.
  const data = {
    requests: [
      { id: 1, user: { name: 'Juan Pérez' }, startDate: '2025-10-20', endDate: '2025-10-25', status: 'Aprobado' },
      { id: 2, user: { name: 'Maria García' }, startDate: '2025-10-27', endDate: '2025-10-31', status: 'Aprobado' },
      { id: 3, user: { name: 'Ana Gómez' }, startDate: '2025-11-10', endDate: '2025-11-15', status: 'Pendiente' },
      { id: 4, user: { name: 'Juan Pérez' }, startDate: '2025-12-22', endDate: '2025-12-26', status: 'Pendiente' },
    ],
    currentUser: {
        availableDays: 15,
        takenDays: 5
    }
  };
  return data;
};

// Asume que el usuario es un mánager para mostrar el dashboard
const isManager = true;

const VacationsPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['vacations'],
    queryFn: fetchVacations,
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Error al cargar los datos: {error.message}</Alert>
      </Container>
    );
  }

  // Transforma los datos para el calendario
  const calendarEvents = data.requests
    .filter(req => req.status === 'Aprobado')
    .map(req => ({
      id: req.id,
      title: `Vacaciones ${req.user.name}`,
      start: new Date(req.startDate),
      end: new Date(req.endDate),
    }));

  // Filtra las solicitudes pendientes para el dashboard de aprobación
  const pendingApprovals = data.requests
    .filter(req => req.status === 'Pendiente')
    .map(req => ({
        id: req.id,
        employee: req.user.name,
        startDate: req.startDate,
        endDate: req.endDate,
    }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
            Gestión de Vacaciones
        </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <VacationCalendar events={calendarEvents} />
          <RequestsList requests={data.requests.map(r => ({...r, requester: r.user.name}))} />
        </Grid>
        <Grid item xs={12} md={4}>
          <AvailableDays available={data.currentUser.availableDays} taken={data.currentUser.takenDays} />
          {isManager && <ApprovalDashboard pendingRequests={pendingApprovals} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default VacationsPage;