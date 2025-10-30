import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PublishIcon from '@mui/icons-material/Publish';

function BulletinCard({ bulletin, onPublish }) {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      {bulletin.imageUrl && (
        <CardMedia
          component="img"
          height="194"
          image={bulletin.imageUrl}
          alt={bulletin.title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {bulletin.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {bulletin.content}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
          Publicado: {new Date(bulletin.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button 
          size="small" 
          variant="contained" 
          startIcon={<PublishIcon />} 
          onClick={() => onPublish(bulletin.id)}
          sx={{
            background: 'linear-gradient(135deg, #2a9d8f 0%, #264653 100%) !important',
            color: 'white !important',
          }}
        >
          Publicar en Portal
        </Button>
      </CardActions>
    </Card>
  );
}

export default function PortalPage({ bulletins, onPublish }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AnnouncementIcon sx={{ mr: 1, fontSize: '2.5rem' }} />
        Vista Preliminar de Boletines
      </Typography>

      {bulletins.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 5 }}>
          No hay boletines pendientes de revisión.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {bulletins.map((bulletin) => (
            <Grid item key={bulletin.id} xs={12} sm={6} md={4}>
              <BulletinCard bulletin={bulletin} onPublish={onPublish} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

PortalPage.defaultProps = {
  bulletins: [],
};