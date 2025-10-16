import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import './global.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1877F2', // Azul de Facebook
      dark: '#166FE5',  // Azul de Facebook más oscuro
    },
    secondary: {
      main: '#6b778c', // Usando el color de texto secundario como un gris neutro
    },
    success: {
      main: '#00b96b',
    },
    warning: {
      main: '#ffd600',
    },
    error: {
      main: '#ff3b30',
    },
    background: {
      default: '#ffffff', // Fondo blanco
      paper: '#ffffff',   // Fondo secundario
    },
    text: {
      primary: '#222b45',
      secondary: '#6b778c',
      disabled: '#a0aec0',
    },
    divider: '#e4e9f2',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'sans-serif'",
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
