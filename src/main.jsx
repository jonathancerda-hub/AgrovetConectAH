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
                primary: { main: '#1877F2' },
                secondary: { main: '#6b778c' },
                background: { default: '#ffffff', paper: '#ffffff' },
                text: { primary: '#222b45', secondary: '#6b778c' },
              }
            : {
                // Paleta para modo oscuro
                primary: { main: '#1877F2' },
                secondary: { main: '#a0aec0' },
                background: { default: '#1a202c', paper: '#2d3748' },
                text: { primary: '#ffffff', secondary: '#a0aec0' },
              }),
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
