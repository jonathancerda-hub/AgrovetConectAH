
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Componente de ejemplo para rellenar el grid
const PlaceholderCard = ({ title, sx, children }) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', ...sx }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    {children}
  </Paper>
);

const AvailableDays = ({ available, taken }) => {
  const data = {
    labels: ['Disponibles', 'Tomados'],
    datasets: [
      {
        label: 'Días de Vacaciones',
        data: [available, taken],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)', // Color para 'Disponibles'
          'rgba(255, 99, 132, 0.8)',  // Color para 'Tomados'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '8px', // theme.spacing(1)
        height: 'calc(100vh - 100px)', // Ajusta la altura para ocupar la pantalla
      }}
    >
      <Box sx={{ gridColumn: { xs: 'span 5', md: '1 / span 4' }, gridRow: '1' }}>
        <Typography variant="h4" fontWeight={700}>Dashboard de Vacaciones</Typography>
      </Box>

      {/* .div5 */}
      <PlaceholderCard
        title="Resumen Gráfico"
        sx={{
          gridColumn: { xs: 'span 5', md: '1 / span 4' },
          gridRow: { xs: 'auto', md: '2 / span 2' },
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box sx={{ position: 'relative', height: '100%', width: '100%', maxWidth: '400px' }}>
           <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </PlaceholderCard>

      {/* .div6 */}
      <PlaceholderCard
        title="Estado Actual"
        sx={{
          gridColumn: { xs: 'span 5', md: '5 / 6' },
          gridRow: { xs: 'auto', md: '1 / span 3' },
        }}
      >
        <Typography variant="h4" color="primary">Disponibles: {available}</Typography>
        <Typography variant="h4" color="secondary">Tomados: {taken}</Typography>
      </PlaceholderCard>

      {/* .div7 */}
      <PlaceholderCard
        title="Notificaciones"
        sx={{
          gridColumn: { xs: 'span 5', md: '1 / span 2' },
          gridRow: { xs: 'auto', md: '4 / span 2' },
        }}
      />

      {/* .div8 */}
      <PlaceholderCard
        title="Historial Reciente"
        sx={{
          gridColumn: { xs: 'span 5', md: '3 / span 3' },
          gridRow: { xs: 'auto', md: '4 / span 2' },
        }}
      />
    </Box>
  );
};

export default AvailableDays;
