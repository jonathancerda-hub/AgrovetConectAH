import React from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Paper, Typography, TextField, Button, Stack } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';

export default function NewCollaboratorForm() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      area: 'Gerente de Talento Humano y SST | HHR',
      responsable: 'Ursula Huamancaja',
      modalidad: 'Indefinido',
    }
  });
  const onSubmit = (data) => console.log('Nueva solicitud:', data);

  return (
    <Paper 
      component="form" 
      elevation={24} 
      onSubmit={handleSubmit(onSubmit)} 
      noValidate sx={{ p: 3 }}>
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
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Área Solicitante" 
                  InputProps={{ readOnly: true }} 
                  {...register('area')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Persona Responsable" 
                  InputProps={{ readOnly: true }} 
                  {...register('responsable')} 
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Datos del Nuevo Colaborador</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="DNI del Colaborador" 
                  placeholder="12345678" 
                  autoComplete="off"
                  {...register('dni', { 
                    required: 'El DNI es obligatorio',
                    pattern: { value: /^\d{8}$/, message: 'El DNI debe tener 8 dígitos' } 
                  })}
                  error={!!errors.dni}
                  helperText={errors.dni?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Nombre del Colaborador" 
                  placeholder="Ingrese el nombre completo" 
                  autoComplete="off"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Apellido del Colaborador" 
                  placeholder="Ingrese los apellidos" 
                  autoComplete="off"
                  {...register('apellido', { required: 'El apellido es obligatorio' })}
                  error={!!errors.apellido}
                  helperText={errors.apellido?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Email del Colaborador" 
                  placeholder="usuario@empresa.com" 
                  autoComplete="off"
                  {...register('email', { 
                    required: 'El email es obligatorio',
                    pattern: { value: /^\S+@\S+$/i, message: 'Formato de email inválido' }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Detalles del Puesto</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Fecha de inicio de labores" 
                  type="date" 
                  InputLabelProps={{ shrink: true }} 
                  {...register('fechaInicio', { required: 'La fecha de inicio es obligatoria' })}
                  error={!!errors.fechaInicio}
                  helperText={errors.fechaInicio?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Puesto a Solicitud" 
                  autoComplete="off"
                  {...register('puesto')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Denominación del Puesto" 
                  placeholder="--------" 
                  autoComplete="off"
                  {...register('denominacion')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Grupo Ocupacional" 
                  placeholder="--------" 
                  autoComplete="off"
                  {...register('grupo')} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Detalles de la Contratación</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Motivo de la contratación" 
                  placeholder="--------" 
                  autoComplete="off"
                  {...register('motivo')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" 
                  fullWidth 
                  label="Modalidad de Contratación" 
                  {...register('modalidad')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  size="small" fullWidth label="Especificar Tiempo (Meses)" 
                  autoComplete="off" {...register('tiempo')} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          sx={{
            background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
            border: 'none',
            color: 'white !important',
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
