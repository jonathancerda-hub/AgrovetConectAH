import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import NewBulletinForm from './NewBulletinForm';

export default function BoletinesPage({ onGoToPortal }) {
  return (
    <Box sx={{ width: '100%', height: '100%', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CampaignIcon sx={{ mr: 1, fontSize: '2.5rem', color: '#2a9d8f' }} />
          Gestión de Boletines
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crea y publica boletines que serán visibles para todos los empleados en el Portal
        </Typography>
      </Paper>
      
      <NewBulletinForm onGoToPortal={onGoToPortal} />
    </Box>
  );
}
