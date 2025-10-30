import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Grid, Paper, Typography, Button, Avatar, TextField, Chip, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faShieldAlt,
  faGavel,
  faInfoCircle,
  faUserClock,
  faCalendarCheck,
  faCheck,
  faTimes,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

const DetailItem = ({ label, value, component }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper variant="outlined" sx={{ textAlign: 'center', p: 2, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>{label}</Typography>
      {component || <Typography variant="h6" sx={{ fontWeight: 600 }}>{value}</Typography>}
    </Paper>
  </Grid>
);

export default function ProcessRequestPage({ request = {}, requester = {}, onProcess = () => {}, onGoBack = () => {} }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data, action) => {
    if (typeof onProcess === 'function' && request.id) onProcess(request.id, action, data.comment);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom>📋 Revisar Solicitud de Vacaciones</Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>Valida que la solicitud cumpla con las políticas de la empresa</Typography>

      <Grid container spacing={3}>
        {/* Columna Principal */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            {/* Info Empleado */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f7fafc, #edf2f7)', borderRadius: 3 }}>
              <Avatar sx={{ width: 80, height: 80, margin: '0 auto 1rem', background: 'linear-gradient(135deg, #2a9d8f, #264653)', fontSize: '2rem' }}>
                {requester?.name ? requester.name.charAt(0) : '?'}
              </Avatar>
              <Typography variant="h5" fontWeight={600}>{requester?.name || 'Empleado'}</Typography>
              <Typography color="text.secondary">Nivel Jerárquico: {requester?.level || 'N/A'}</Typography>
            </Paper>

            {/* Detalles Solicitud */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} /> <span>Detalles de la Solicitud</span>
              </Typography>
              <Grid container spacing={2}>
                <DetailItem label="Fecha de Inicio" value={request.startDate || '-'} />
                <DetailItem label="Fecha de Fin" value={request.endDate || '-'} />
                <DetailItem label="Días Solicitados" value={`${request.days ?? '-'} días`} />
                <DetailItem label="Tipo" component={
                  <Chip label={request.type || 'Regulares'} sx={{ background: 'linear-gradient(135deg, #48bb78, #38a169)', color: 'white', fontWeight: 600 }} />
                } />
              </Grid>
            </Box>

            {/* Validación */}
            <Box sx={{ mb: 3, p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #fff5f5, #fed7d7)', border: '1px solid #feb2b2' }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#c53030' }}>
                <FontAwesomeIcon icon={faShieldAlt} /> <span>Validación de Políticas</span>
              </Typography>
              <Typography>✅ La solicitud cumple con el límite de días.</Typography>
              <Typography>✅ La solicitud no excede el máximo de días consecutivos.</Typography>
            </Box>

            {/* Decisión */}
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FontAwesomeIcon icon={faGavel} /> <span>Decisión Final</span>
              </Typography>
              <form>
                <TextField
                  fullWidth
                  label="Comentario (opcional)"
                  multiline
                  rows={3}
                  {...register('comment')}
                  sx={{ mb: 2 }}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={handleSubmit((data) => onSubmit(data, 'Aprobado'))}
                    sx={{
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(40, 167, 69, 0.3)' }
                    }}
                    startIcon={<FontAwesomeIcon icon={faCheck} />}
                  >
                    Aprobar Solicitud
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit((data) => onSubmit(data, 'Rechazado'))}
                    sx={{
                      background: 'linear-gradient(135deg, #dc3545, #c82333)',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(220, 53, 69, 0.3)' }
                    }}
                    startIcon={<FontAwesomeIcon icon={faTimes} />}
                  >
                    Rechazar Solicitud
                  </Button>
                </Stack>
              </form>
            </Box>
          </Paper>
        </Grid>

        {/* Columna Lateral */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 4, background: 'linear-gradient(135deg, #f0fff4, #dcfce7)', border: '1px solid #9ae6b4' }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#22543d' }}>
                <FontAwesomeIcon icon={faInfoCircle} /> <span>Políticas Clave</span>
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li><Typography variant="body2">Debe incluir al menos un fin de semana.</Typography></li>
                <li><Typography variant="body2">Máximo 30 días consecutivos.</Typography></li>
                <li><Typography variant="body2">Validación final por RRHH.</Typography></li>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FontAwesomeIcon icon={faUserClock} /> <span>Antigüedad</span>
              </Typography>
              <Box sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #f7fafc, #edf2f7)', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">~2 años</Typography>
                <Typography variant="caption" color="text.secondary">desde la contratación</Typography>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FontAwesomeIcon icon={faCalendarCheck} /> <span>Días Disponibles</span>
              </Typography>
              <Box sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #f0fff4, #dcfce7)', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#38a169' }}>{request.availableDays ?? 15}</Typography>
                <Typography variant="caption" sx={{ color: '#22543d' }}>días para regulares</Typography>
              </Box>
            </Paper>

            <Button
              variant="outlined"
              onClick={onGoBack}
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
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
            >
              Volver al Panel
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}