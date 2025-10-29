import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import NewBulletinForm from './features/bulletins/components/NewBulletinForm';
import PortalPage from './pages/PortalPage';
import DashboardRRHH from './pages/DashboardRRHH';

const theme = createTheme();

export default function App() {
  const [bulletins, setBulletins] = useState([]);

  const handleAddBulletin = (newBulletin) => {
    setBulletins((prevBulletins) => [newBulletin, ...prevBulletins]);
    // En una app real, aquí también harías una llamada a tu backend.
    alert('¡Boletín publicado con éxito!');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard-rrhh" />} />
          <Route path="/dashboard-rrhh" element={<DashboardRRHH />} />
          <Route 
            path="/crear-boletin" 
            element={<NewBulletinForm onAddBulletin={handleAddBulletin} />} 
          />
          <Route 
            path="/portal" 
            element={<PortalPage bulletins={bulletins} />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}