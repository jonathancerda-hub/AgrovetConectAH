import React from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Paper, Typography, TextField, Button, Stack } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';

export default function NewCollaboratorForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log('Nueva solicitud:', data);

  return (
    <Paper component="form" elevation={24} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PersonAddIcon sx={{ mr: 1 }} />
        Solicitud de Nuevo Colaborador
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Información del Solicitante</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Área Solicitante" defaultValue="Gerente de Talento Humano y SST | HHR" {...register('area')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Persona Responsable" defaultValue="Ursula Huamancaja" {...register('responsable')} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Datos del Nuevo Colaborador</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="DNI del Colaborador" placeholder="12345678" {...register('dni')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Nombre del Colaborador" placeholder="Ingrese el nombre completo" {...register('nombre')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Apellido del Colaborador" placeholder="Ingrese los apellidos" {...register('apellido')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Email del Colaborador" placeholder="usuario@empresa.com" {...register('email')} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Detalles del Puesto</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Fecha de inicio de labores" type="date" InputLabelProps={{ shrink: true }} {...register('fechaInicio')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Puesto a Solicitud" {...register('puesto')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Denominación del Puesto" placeholder="--------" {...register('denominacion')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Grupo Ocupacional" placeholder="--------" {...register('grupo')} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Detalles de la Contratación</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Motivo de la contratación" placeholder="--------" {...register('motivo')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Modalidad de Contratación" defaultValue="Indefinido" {...register('modalidad')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Especificar Tiempo (Meses)" {...register('tiempo')} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            fontWeight: 600, px: 4
          }}
          startIcon={<SendIcon />}>
          Enviar Solicitud
        </Button>
        <Button
          variant="outlined"
          sx={{
            fontWeight: 500,
            color: '#6c757d',
            borderColor: '#6c757d',
            '&:hover': {
              color: '#fff',
              backgroundColor: '#6c757d',
              borderColor: '#6c757d',
            },
          }}
          startIcon={<ListAltIcon />}>
          Ver mis solicitudes
        </Button>
        <Button
          variant="outlined"
          sx={{
            fontWeight: 500,
            color: '#dc3545',
            borderColor: '#dc3545',
            '&:hover': {
              color: '#fff',
              backgroundColor: '#dc3545',
              borderColor: '#dc3545',
            },
          }}
          startIcon={<CancelIcon />}>
          Cancelar
        </Button>
        <Button
          variant="outlined"
          sx={{
            fontWeight: 500,
            color: '#0d6efd',
            borderColor: '#0d6efd',
            '&:hover': {
              color: '#fff',
              backgroundColor: '#0d6efd',
              borderColor: '#0d6efd',
            },
          }}
          startIcon={<HomeIcon />}>
          Regresar
        </Button>
      </Stack>
    </Paper>
  );
}
