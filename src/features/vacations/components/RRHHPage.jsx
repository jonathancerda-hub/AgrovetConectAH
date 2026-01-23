import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';

import DashboardRRHH from './DashboardRRHH';
import ControlVacacionesEmpleado from './ControlVacacionesEmpleado';
import HistorialVacaciones from './HistorialVacaciones';
import GestionFeriados from './GestionFeriados';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RRHHPage() {
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
            icon={<DashboardIcon />} 
            iconPosition="start" 
            label="Dashboard RRHH" 
          />
          <Tab 
            icon={<FactCheckIcon />} 
            iconPosition="start" 
            label="Control de Vacaciones" 
          />
          <Tab 
            icon={<HistoryIcon />} 
            iconPosition="start" 
            label="Historial" 
          />
          <Tab 
            icon={<EventIcon />} 
            iconPosition="start" 
            label="Gestión de Feriados" 
          />
        </Tabs>
      </Box>

      {/* Contenido de cada pestaña */}
      <TabPanel value={currentTab} index={0}>
        <DashboardRRHH />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <ControlVacacionesEmpleado />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <HistorialVacaciones />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <GestionFeriados />
      </TabPanel>
    </Box>
  );
}
