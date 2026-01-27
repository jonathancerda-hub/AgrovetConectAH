import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import AvailableDays from './AvailableDays';
import RequestForm from './RequestForm';
import VacationCalendar from './VacationCalendar';
import RequestsList from './RequestsList';
import AprobacionSolicitudes from './AprobacionSolicitudes';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function VacacionesPage({ 
  availableDaysData, 
  calendarEvents, 
  onNewRequest,
  initialTab = 0
}) {
  const [currentTab, setCurrentTab] = useState(initialTab);

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
            icon={<EventAvailableIcon />} 
            iconPosition="start" 
            label="Dashboard" 
          />
          <Tab 
            icon={<AssignmentIcon />} 
            iconPosition="start" 
            label="Solicitar Vacaciones" 
          />
          <Tab 
            icon={<CalendarMonthIcon />} 
            iconPosition="start" 
            label="Calendario" 
          />
          <Tab 
            icon={<ListAltIcon />} 
            iconPosition="start" 
            label="Mis Solicitudes" 
          />
          <Tab 
            icon={<FactCheckIcon />} 
            iconPosition="start" 
            label="Aprobar Solicitudes" 
          />
        </Tabs>
      </Box>

      {/* Contenido de cada pestaña */}
      <TabPanel value={currentTab} index={0}>
        <AvailableDays 
          available={availableDaysData.available} 
          taken={availableDaysData.taken} 
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <RequestForm onNewRequest={onNewRequest} />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <VacationCalendar events={calendarEvents} />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <RequestsList />
      </TabPanel>

      <TabPanel value={currentTab} index={4}>
        <AprobacionSolicitudes />
      </TabPanel>
    </Box>
  );
}
