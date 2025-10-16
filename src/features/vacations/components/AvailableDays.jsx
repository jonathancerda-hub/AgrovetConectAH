
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const AvailableDays = ({ available, taken }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Días Disponibles</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Box textAlign="center">
          <Typography variant="h4" color="primary">{available}</Typography>
          <Typography variant="subtitle1">Disponibles</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h4" color="secondary">{taken}</Typography>
          <Typography variant="subtitle1">Tomados</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AvailableDays;
