import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, Chip, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, TextField, IconButton, Link } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

const boletas = [
  { mes: 'Septiembre 2025', url: '#' },
  { mes: 'Agosto 2025', url: '#' },
  { mes: 'Julio 2025', url: '#' },
];

export default function Portal({ publicaciones }) {
  return (
    <Box sx={{ flexGrow: 1, mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, width: '100%', alignItems: 'flex-start' }}>
        {/* Publicaciones */}
        <Grid xs={12} md="auto" sx={{ display: 'flex', flexDirection: 'column', minWidth: { md: 0, lg: 0 }, maxWidth: 900, flex: '2 1 0%' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="outlined" size="small">Todo</Button>
            <Button variant="outlined" size="small">Publicaciones</Button>
          </Box>
          {publicaciones.map((pub) => (
            <Paper key={pub.id} sx={{ mb: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>{pub.autor}</Typography>
                  <Typography variant="caption" color="text.secondary">{pub.fecha}</Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>{pub.titulo}</Typography>
              <Typography variant="body2" gutterBottom>{pub.contenido}</Typography>
              <Box sx={{ my: 2, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                {pub.imageUrl && <img
                  src={pub.imageUrl}
                  alt="Publicación"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FavoriteBorderIcon fontSize="small" />
                <ThumbUpAltOutlinedIcon fontSize="small" />
                <Typography variant="caption">{pub.reacciones} reacciones</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField size="small" placeholder="Me gusta" variant="outlined" sx={{ flex: 1 }} />
                <IconButton color="primary"><SendIcon /></IconButton>
              </Box>
            </Paper>
          ))}
        </Grid>
        {/* Panel lateral */}
        <Grid xs={12} md="auto" sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 280, maxWidth: 340, flex: '0 0 320px' }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>Tareas Pendientes</Typography>
              <Button size="small" variant="outlined">+</Button>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              <Typography>¡Muy bien!</Typography>
              <Typography variant="caption">Nada por el momento</Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>Accesos directos</Typography>
              <Chip label="F1" color="success" size="small" />
            </Box>
            <List dense>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon><AssignmentTurnedInIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Últimas boletas de pago" />
              </ListItem>
              {boletas.map((b) => (
                <ListItem key={b.mes} sx={{ pl: 4 }}>
                  <ListItemIcon><ArrowForwardIosIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={<Link href={b.url}>{b.mes}</Link>} />
                </ListItem>
              ))}
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Generar certificado o documento" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon><CardGiftcardIcon color="warning" /></ListItemIcon>
                <ListItemText primary="Beneficios" />
              </ListItem>
            </List>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Links de interés</Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ 
                  mb: 1, 
                  background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
                  color: 'white !important'
                }}>
                Mi Marcación
              </Button>
              <Typography variant="caption" color="text.secondary">¡Ya puedes registrar tu asistencia!</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
