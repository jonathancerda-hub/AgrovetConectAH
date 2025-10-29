import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Paper, Typography, TextField, Button, Stack, InputAdornment, IconButton } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import ClearIcon from '@mui/icons-material/Clear';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function NewBulletinForm({ onAddBulletin, onGoToPortal }) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isValid } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '',
      content: '',
      image: null,
    }
  });

  const onSubmit = (data) => {
    const bulletinData = {
      ...data,
      id: Date.now(), // ID único simple
      createdAt: new Date().toISOString(),
    };
    // Si hay una imagen, crea una URL para la vista previa
    if (data.image) {
      bulletinData.imageUrl = URL.createObjectURL(data.image);
    }
    onAddBulletin(bulletinData);
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
          Crear Boletín
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
          startIcon={<CancelIcon />}
        >
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
          onClick={onGoToPortal}
          startIcon={<HomeIcon />}
        >
          Regresar al Portal
        </Button>
      </Stack>
    </Paper>
  );
}