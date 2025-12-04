import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import NewBulletinForm from './NewBulletinForm';
import PortalPage from './PortalPage';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BoletinesPage({ 
  stagedBulletins, 
  onAddBulletin, 
  onPublish, 
  onGoToPortal 
}) {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Pestañas horizontales */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#2a9d8f',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2a9d8f',
              height: 3,
            },
          }}
        >
          <Tab 
            icon={<AddToPhotosIcon />} 
            iconPosition="start" 
            label="Crear Boletín" 
          />
          <Tab 
            icon={<DynamicFeedIcon />} 
            iconPosition="start" 
            label="Vista Preliminar" 
          />
        </Tabs>
      </Box>

      {/* Contenido de cada pestaña */}
      <TabPanel value={currentTab} index={0}>
        <NewBulletinForm 
          onAddBulletin={(bulletin) => {
            onAddBulletin(bulletin);
            setCurrentTab(1); // Cambiar automáticamente a vista preliminar
          }} 
          onGoToPortal={onGoToPortal} 
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <PortalPage 
          bulletins={stagedBulletins} 
          onPublish={onPublish} 
        />
      </TabPanel>
    </Box>
  );
}
