import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Link, Stack, Divider, Checkbox, FormControlLabel, IconButton, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { ThemeContext } from '../../../main'; // Importamos nuestro contexto

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import GoogleIcon from './GoogleIcon'; // Importamos nuestro icono personalizado

const conectaLogo = '/img/conecta-logo.png';
const lightModeImageUrl = 'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2';
const darkModeImageUrl = 'https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2';

function ColorSchemeToggle() {
  const theme = useTheme();
  const colorMode = useContext(ThemeContext);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="small"
      variant="outlined"
      onClick={colorMode.toggleColorMode}
    >
      {theme.palette.mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Login({ onLogin, users }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const theme = useTheme();

  const onSubmit = (data) => {
    // Para mantener la funcionalidad de jerarquía, iniciamos sesión como el primer usuario por defecto.
    // Esto se reemplazará con la lógica de autenticación real.
    if (data.email && data.password) {
      const defaultUserId = (users && users.length > 0) ? users[0].id : 1;
      onLogin(defaultUserId);
    }
  };

  return (
    <Box sx={{
      '--Transition-duration': '0.4s',
    }}>
      {/* Columna del Formulario */}
      <Box
        sx={{
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255 255 255 / 0.4)' : 'rgba(19 19 24 / 0.4)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%', // Ocupa todo el espacio de la columna izquierda
            px: 2,
          }}
        >
          <Box component="header" sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <img src={conectaLogo} alt="Conecta Logo" style={{ width: 150 }} />
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400, // Ancho fijo del formulario
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm', // Joy UI token
            }}
          >
            <Stack gap={1} sx={{ mb: 2 }}>
              <Typography component="h1" variant="h4" fontWeight="bold">
                Iniciar Sesión
              </Typography>
              <Typography color="text.secondary" variant="body2">
                ¿Nuevo en la empresa?{' '}
                <Link href="#" variant="body2" fontWeight="bold">
                  ¡Regístrate!
                </Link>
              </Typography>
            </Stack>
            <Button variant="outlined" color="secondary" fullWidth startIcon={<GoogleIcon />}>
              Continuar con Google
            </Button>
            <Divider sx={{ my: 2 }}>o</Divider>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap={2}>
                <TextField
                  size="small"
                  label="Correo Electrónico"
                  type="email"
                  {...register('email', { required: 'El correo es obligatorio' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  size="small"
                  label="Contraseña"
                  type="password"
                  {...register('password', { required: 'La contraseña es obligatoria' })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel control={<Checkbox size="small" name="persistent" />} label={<Typography variant="body2">Recordarme</Typography>} />
                  <Link href="#" variant="body2" fontWeight="bold">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    mt: 1,
                    background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
                    color: 'white !important',
                    border: 'none',
                    fontWeight: 600,
                    px: 4,
                  }}>
                  Iniciar Sesión
                </Button>
              </Stack>
            </form>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography variant="body2" textAlign="center">
              © ConectAH {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Columna de la Imagen */}
      <Box
        sx={{
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition: 'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: theme.palette.mode === 'light' ? `url(${lightModeImageUrl})` : `url(${darkModeImageUrl})`,
        }}
      />
    </Box>
  );
}
