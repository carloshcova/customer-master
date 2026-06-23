import { createTheme } from '@mui/material/styles';

/**
 * Shared MUI theme for the customer microfrontend. Extend palette, typography
 * and component defaults here so the whole app stays visually consistent.
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' },
    secondary: { main: '#7c4dff' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
