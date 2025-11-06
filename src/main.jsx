import React, { useState, useMemo, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './global.css';

// Creamos un contexto para el cambio de tema
export const ThemeContext = createContext({ toggleColorMode: () => {} });

function Main() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Paleta para modo claro
                primary: { main: '#2a9d8f' }, // Un verde azulado profesional
                secondary: { main: '#718096' }, // Gris para texto secundario
                background: { default: '#f8f9fa', paper: '#ffffff' },
                text: { primary: '#2d3748', secondary: '#718096' },
                error: { main: '#e53e3e' },
                warning: { main: '#dd6b20' },
                info: { main: '#3182ce' },
                success: { main: '#38a169' },
              }
            : {
                // Paleta para modo oscuro
                primary: { main: '#2a9d8f' },
                secondary: { main: '#a0aec0' },
                background: { default: '#1a202c', paper: '#2d3748' },
                text: { primary: '#e2e8f0', secondary: '#a0aec0' },
                error: { main: '#fc8181' },
                warning: { main: '#f6ad55' },
              }),
        },
        components: {
          MuiTableCell: {
            styleOverrides: {
              head: {
                backgroundColor: '#f5f5f5',
                color: '#333'
              }
            }
          }
        },
        typography: {
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'sans-serif'",
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Crear root solo una vez fuera del componente
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
