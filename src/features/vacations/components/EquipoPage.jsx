import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';

import NewCollaboratorForm from './NewCollaboratorForm';
import TeamDashboard from './TeamDashboard';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EquipoPage() {
  const [currentTab, setCurrentTab] = useState(1); // Cambiado de 0 a 1 para mostrar "Mi Equipo" primero

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
            icon={<PersonAddIcon />} 
            iconPosition="start" 
            label="Solicitar Colaborador" 
            disabled
          />
          <Tab 
            icon={<PeopleIcon />} 
            iconPosition="start" 
            label="Mi Equipo" 
          />
        </Tabs>
      </Box>

      {/* Contenido de cada pestaña */}
      <TabPanel value={currentTab} index={0}>
        <NewCollaboratorForm />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <TeamDashboard />
      </TabPanel>
    </Box>
  );
}
