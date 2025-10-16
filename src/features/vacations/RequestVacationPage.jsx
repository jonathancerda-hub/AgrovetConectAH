import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import RequestForm from './components/RequestForm';
import PostAddIcon from '@mui/icons-material/PostAdd';

const RequestVacationPage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <PostAddIcon sx={{ mr: 1.5, fontSize: '2.2rem' }} />
        Nueva Solicitud de Vacaciones
      </Typography>
      <Grid container spacing={3} alignItems="stretch">
        <RequestForm />
      </Grid>
    </Container>
  );
};

export default RequestVacationPage;