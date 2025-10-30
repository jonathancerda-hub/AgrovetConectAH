import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Link, Stack, Divider } from '@mui/material';

export default function LoginClean({ onLogin, users = [] }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    if (data.email) {
      const userId = (users && users.length) ? users[0].id : 1;
      onLogin(userId);
    }
  };

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box sx={{ width: 360 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField size="small" label="Correo Electrónico" type="email" {...register('email', { required: true })} error={!!errors.email} />
            <TextField size="small" label="Contraseña" type="password" {...register('password', { required: true })} error={!!errors.password} />
            <Button type="submit" variant="contained">Iniciar Sesión</Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
