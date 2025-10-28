import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Grid, Paper, Typography, Stack, Chip, Grow } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';

const RequestForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [dayCount, setDayCount] = useState(0);

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        // Se suma 1 para incluir el día de inicio en el conteo
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDayCount(diffDays);
      } else {
        setDayCount(0); // Si la fecha de fin es anterior a la de inicio, se resetea
      }
    } else {
      setDayCount(0);
    }
  }, [startDate, endDate]);

  const onSubmit = (data) => {
    console.log(data);
    // Lógica para enviar la solicitud
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'auto',
        gap: 3,
      }}
    >
      {/* Columna Izquierda: Formulario */}
      <Paper
        component="form"
        elevation={24}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          p: 3,
          gridColumn: { xs: 'span 5', md: 'span 3' },
          gridRow: { xs: 'auto', md: 'span 2' },
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', // Cambiado de 5 a 4 columnas para una división equitativa
          gap: 2,
          alignItems: 'start',
        }}
      >
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1, gridColumn: 'span 5' }}>
            <EditIcon sx={{ mr: 1 }} />Solicitud de Vacaciones
          </Typography>
          
          {/* Fila 1 */}
          <TextField
            required
            fullWidth
            id="startDate"
            label="Fecha de Inicio"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('startDate', { required: 'La fecha de inicio es obligatoria' })}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            sx={{ gridColumn: { xs: 'span 4', sm: 'span 2' } }} // Ahora ocupa 2 de 4 columnas
          />
          <TextField
            required
            fullWidth
            id="endDate"
            label="Fecha de Fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('endDate', { required: 'La fecha de fin es obligatoria' })}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
            sx={{ gridColumn: { xs: 'span 4', sm: 'span 2' } }} // Ahora ocupa 2 de 4 columnas
          />

          {/* Fila 2 */}
          <Box sx={{ gridColumn: 'span 4', justifySelf: 'start' }}>
            <Grow in={dayCount > 0}>
              <Chip
                icon={<EventAvailableIcon />}
                label={`Total: ${dayCount} día(s) solicitados`}
                color="primary"
                variant="filled"
                sx={{
                  fontSize: '1rem',
                  padding: '16px 12px',
                  fontWeight: 500,
                  boxShadow: 3,
                }}
              />
            </Grow>
          </Box>

          {/* Fila 3 */}
          <TextField
            fullWidth
            id="vacType"
            label="Tipo de Vacaciones"
            value="Regulares"
            InputProps={{ readOnly: true }}
            sx={{ gridColumn: { xs: 'span 4', sm: 'span 2' } }} // Ahora ocupa 2 de 4 columnas
          />
          <TextField
            fullWidth
            id="period"
            label="Período Vacacional"
            value="2025-2026"
            InputProps={{ readOnly: true }}
            sx={{ gridColumn: { xs: 'span 4', sm: 'span 2' } }} // Ahora ocupa 2 de 4 columnas
          />

          {/* Fila 4 */}
          <TextField
            fullWidth
            id="comments"
            label="Motivo (opcional)"
            placeholder="Describe el motivo de tu solicitud de vacaciones..."
            multiline
            rows={3}
            {...register('comments')}
            sx={{ gridColumn: 'span 4' }} // Ahora ocupa 4 columnas
          />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1, gridColumn: 'span 4' }}>
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

      {/* Columna Derecha: Estado y Políticas */}
      <Paper elevation={24} sx={{ p: 2, gridColumn: { xs: 'span 5', md: 'span 2' } }}>
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

      <Paper elevation={24} sx={{ p: 2, gridColumn: { xs: 'span 5', md: 'span 2' } }}>
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
    </Box>
  );
};

export default RequestForm;
