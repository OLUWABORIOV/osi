import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../components/AuthContext';
import { useEffect, useState } from 'react';
import { SnackbarProvider } from '../components/SnackbarContext';

export default function App({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) setDarkMode(stored === 'true');
  }, []);

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <Component {...pageProps} darkMode={darkMode} onToggleTheme={handleToggleTheme} />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
} 