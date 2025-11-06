import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Paper, Typography, TextField, Button, Stack, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import ClearIcon from '@mui/icons-material/Clear';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { publicacionesService } from '../../../services/publicaciones.service';

export default function NewBulletinForm({ onAddBulletin, onGoToPortal }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isValid } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '',
      content: '',
      image: null,
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      
      // Crear la publicación en la API
      const publicacionData = {
        titulo: data.title,
        contenido: data.content,
        tipo: 'boletin',
        visible: true
        // TODO: manejar la imagen cuando se implemente la subida de archivos
      };
      
      await publicacionesService.create(publicacionData);
      
      setSuccess(true);
      reset(); // Limpiar el formulario
      
      // Redirigir al portal después de 2 segundos
      setTimeout(() => {
        onGoToPortal();
      }, 2000);
      
    } catch (err) {
      console.error('Error al crear boletín:', err);
      setError(err.response?.data?.error || 'Error al publicar el boletín. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const selectedImage = watch('image');

  return (
    <Paper
      component="form"
      elevation={24}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ p: 3, maxWidth: 800, margin: 'auto' }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CampaignIcon sx={{ mr: 1 }} />
        Crear Nuevo Boletín
      </Typography>

      {/* Mensajes de éxito/error */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Boletín publicado exitosamente! Redirigiendo al portal...
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ // Este es el componente que no estaba importado
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'auto',
        gap: 2,
      }}>
        <Box sx={{ gridColumn: 'span 4' }}>
          <TextField
            fullWidth
            label="Título del Boletín"
            autoComplete="off"
            {...register('title', { required: 'El título es obligatorio' })}
            error={!!errors.title}
            helperText={errors.title?.message}
            variant="filled"
          />
        </Box>

        <Box sx={{ gridColumn: 'span 4', gridRow: 'span 2', gridRowStart: 2 }}>
          <TextField
            fullWidth
            label="Contenido"
            multiline
            rows={8}
            placeholder="Escribe aquí el contenido del boletín..."
            {...register('content', { required: 'El contenido es obligatorio' })}
            error={!!errors.content}
            helperText={errors.content?.message}
            variant="filled"
          />
        </Box>

        <Paper variant="outlined" sx={{ gridColumn: '5 / 6', gridRow: '1 / 4', p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Imagen de Portada</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AttachFileIcon />}
                  >
                    Seleccionar
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />
                  </Button>
                  {selectedImage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedImage.name}
                      </Typography>
                      <IconButton onClick={() => setValue('image', null, { shouldValidate: true })} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}
            />
          </Stack>
        </Paper>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          sx={{
            background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
            border: 'none',
            color: 'white !important',
            fontWeight: 600,
            px: 4
          }}
          startIcon={<SendIcon />}
        >
          {loading ? <CircularProgress size={24} /> : 'Crear Boletín'}
        </Button>
        <Button
          variant="outlined"
          disabled={loading}
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
          startIcon={<CancelIcon />}
          onClick={() => reset()}
        >
          Cancelar
        </Button>
        <Button
          variant="outlined"
          disabled={loading}
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
          onClick={onGoToPortal}
          startIcon={<HomeIcon />}
        >
          Regresar al Portal
        </Button>
      </Stack>
    </Paper>
  );
}