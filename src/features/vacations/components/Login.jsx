import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, InputAdornment, Link, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const bgUrl = '/img/fondo.png';
const conectaLogo = '/img/conecta-logo.png';

export default function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    if (data.email) {
      onLogin();
    }
  };
  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          p: 4,
          width:800
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box textAlign="center" mb={4}>
            <img src={conectaLogo} alt="Logo de la empresa" style={{ width: '100%' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight={600} align="center">
            ¡Bienvenido!
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
            
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Correo Electrónico"
              fullWidth
              margin="normal"
              variant="outlined"
              {...register('email', { required: 'El correo es obligatorio' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}>
              Siguiente
            </Button>
          </form>
          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
            <Link href="#" variant="body2">¿Olvidaste tu contraseña?</Link>
            <Link href="#" variant="body2">Privacidad y protección de datos</Link>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <img
          src={bgUrl}
          alt="Equipo de trabajo"
          style={{ width: '100%', height: 'auto', maxWidth: '700px', objectFit: 'cover', borderRadius: '12px' }}
        />
      </Grid>
    </Grid>
  );
}
