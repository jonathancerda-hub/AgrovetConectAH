import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Grid, Paper, Typography, Divider, Stack, Chip, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const RequestForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Lógica para enviar la solicitud
  };

  return (
    <Grid container spacing={3} alignItems="stretch">
      {/* Columna Izquierda: Formulario */}
      <Grid item xs={12} md={7}>
        <Paper component="form" elevation={24} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: 3, height: '100%',width:690 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EditIcon sx={{ mr: 1 }} />Solicitud de Vacaciones
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="startDate"
                label="Fecha de Inicio"
                type="date"
                sx={{width:300}}
                InputLabelProps={{ shrink: true }}
                {...register('startDate', { required: 'La fecha de inicio es obligatoria' })}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="endDate"
                label="Fecha de Fin"
                type="date"
                sx={{width:300}}
                InputLabelProps={{ shrink: true }}
                {...register('endDate', { required: 'La fecha de fin es obligatoria' })}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="vacType"
                label="Tipo de Vacaciones"
                value="Regulares"
                sx={{width:300}}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="period"
                label="Período Vacacional"
                value="2025-2026"
                sx={{width:300}}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="comments"
                label="Motivo (opcional)"
                placeholder="Describe el motivo de tu solicitud de vacaciones..."
                sx={{width:'325%'}}
                multiline
                rows={3}
                {...register('comments')}
              />
            </Grid>
          </Grid>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(90deg, #7b61ff 0%, #5ee7df 100%)', color: '#fff', fontWeight: 600, px: 4 }} startIcon={<SendIcon />}>
              Enviar Solicitud
            </Button>
            <Button variant="outlined" color="inherit" sx={{ fontWeight: 500 }} startIcon={<ListAltIcon />}>
              Ver mis solicitudes
            </Button>
            <Button variant="outlined" color="primary" sx={{ fontWeight: 500 }} startIcon={<HomeIcon />}>
              Regresar al Inicio
            </Button>
          </Stack>
        </Paper>
      </Grid>

      {/* Columna Derecha: Estado y Políticas */}
      <Grid item xs={12} md={5}>
        <Grid container spacing={3} sx={{ height: '100%', width:450}}>
          <Grid item xs={12} md={6}>
            <Paper elevation={24} sx={{ p: 2, height: '100%',width:500 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={700}>Estado de tus Vacaciones</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight={700}>30</Typography>
                    <Typography variant="body2">Días por Año</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight={700}>0</Typography>
                    <Typography variant="body2">Días Tomados</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight={700}>30</Typography>
                    <Typography variant="body2">Días Restantes</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight={700}>1980</Typography>
                    <Typography variant="body2">Días Antigüedad</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={24} sx={{ p: 2, height: '100%',width:500 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GavelOutlinedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={700}>Políticas y Reglas</Typography>
              </Box>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthOutlinedIcon color="action" fontSize="small" />
                  <Typography variant="body2"><b>POLÍTICA PRINCIPAL:</b> Cada período anual otorga 30 días. Períodos completos: 5, total otorgado: 150 días</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbOutlinedIcon color="warning" fontSize="small" />
                  <Typography variant="body2"><b>RECOMENDACIÓN:</b> Incluye fines de semana en tus vacaciones para cumplir mejor la política anual</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon color="success" fontSize="small" />
                  <Typography variant="body2"><b>FLEXIBILIDAD:</b> Puedes elegir cualquier período de fechas</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthOutlinedIcon color="primary" fontSize="small" />
                  <Typography variant="body2">Mínimo 15 días de aviso previo para solicitudes</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningAmberOutlinedIcon color="warning" fontSize="small" />
                  <Typography variant="body2">Máximo 15 días consecutivos por solicitud</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};


import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';

export default RequestForm;
