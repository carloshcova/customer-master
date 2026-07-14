import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import { themeOptions } from './theme';

const POPPINS_FAMILY = [
  'Poppins',
  'system-ui',
  'Helvetica',
  'Arial',
  'sans-serif',
].join(',');

/**
 * Theme for the portal-embedded surfaces (`./Card`, `./MenuItem`).
 *
 * Rebuilds the design-system theme FROM its options (not from the constructed
 * `theme`) so the Poppins typeface propagates to every variant — including the
 * standard `body1` that Card/MenuItem render. The full-page `./App` keeps Lato.
 * The DS only uses weights 400/700, so only those Poppins weights are loaded.
 */
export const shellTheme = createTheme({
  ...themeOptions,
  typography: { ...themeOptions.typography, fontFamily: POPPINS_FAMILY },
});
