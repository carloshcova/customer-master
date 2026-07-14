import {
  createTheme,
  type Shadows,
  type ThemeOptions,
} from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * MUI needs a 25-entry `shadows` array. Start from the defaults and override the
 * first three to the DS depth levels, so `elevation={1|2|3}` === Base/MD/L and
 * MUI components that default to elevation 1 (e.g. Card) get the Base shadow.
 */
const shadows = [...createTheme().shadows] as Shadows;
shadows[1] = tokens.shadow.base;
shadows[2] = tokens.shadow.md;
shadows[3] = tokens.shadow.l;

/**
 * Shared MUI theme OPTIONS for the customer MFE, built from the design tokens in
 * `tokens.ts` (Figma → MUI: palette, typography, shape, component overrides). Most
 * "looks like Figma" work lands here so it applies globally.
 *
 * Exported as OPTIONS so `shell-theme.ts` can rebuild the theme with a different
 * typeface: `createTheme(existingTheme, { typography: { fontFamily } })` does NOT
 * re-propagate fontFamily to already-computed standard variants (e.g. `body1`), so
 * shell-theme rebuilds from these options. See `.claude/skills/design-system`.
 */
export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    // FBC Blue (base 06), with light/dark pulled from the same scale.
    primary: {
      main: tokens.color.fbcBlue['06'],
      light: tokens.color.fbcBlue['04'],
      dark: tokens.color.fbcBlue['08'],
      contrastText: tokens.color.white,
    },
    // FBC Ice Blue. contrastText is pure black: white on ice-06 fails AA
    // (3.16:1) and neutral-10 is borderline (3.99:1); black passes AAA (6.64:1)
    // per the Figma WCAG data.
    secondary: {
      main: tokens.color.fbcIce['06'],
      light: tokens.color.fbcIce['04'],
      dark: tokens.color.fbcIce['08'],
      contrastText: tokens.color.black,
    },
    // Semantic (Figma "In progress"): main = strong (secondary), light = pastel
    // (primary). Figma `alert` (red) maps to MUI `error`.
    error: {
      main: tokens.color.semantic.alert.secondary,
      light: tokens.color.semantic.alert.primary,
      contrastText: tokens.color.white,
    },
    success: {
      main: tokens.color.semantic.success.secondary,
      light: tokens.color.semantic.success.primary,
      contrastText: tokens.color.white,
    },
    warning: {
      main: tokens.color.semantic.warning.secondary,
      light: tokens.color.semantic.warning.primary,
      contrastText: tokens.color.white,
    },
    info: {
      main: tokens.color.semantic.info.secondary,
      light: tokens.color.semantic.info.primary,
      contrastText: tokens.color.white,
    },
    // Text from neutrals (secondary uses neutral-08 for AA contrast on white).
    // Page + surface backgrounds are white per the DS.
    text: {
      primary: tokens.color.neutral['10'],
      secondary: tokens.color.neutral['08'],
    },
    background: {
      default: tokens.color.white,
      paper: tokens.color.white,
    },
    divider: tokens.color.neutral['03'],
  },
  // DS default radius for containers/buttons is xs (4px).
  shape: { borderRadius: tokens.radius.xs },
  breakpoints: {
    values: {
      xs: tokens.breakpoint.xs,
      sm: tokens.breakpoint.sm,
      md: tokens.breakpoint.md,
      lg: tokens.breakpoint.lg,
      xl: tokens.breakpoint.xl,
      '2xl': tokens.breakpoint['2xl'],
    },
  },
  spacing: tokens.spacingBase,
  shadows,
  typography: {
    fontFamily: tokens.font.family,
    fontWeightRegular: tokens.font.weight.regular,
    // The DS ships only 400/700, so "medium" contexts (buttons, tabs) use bold
    // instead of an unloaded 500 weight.
    fontWeightMedium: tokens.font.weight.bold,
    fontWeightBold: tokens.font.weight.bold,
    // Design-system variants — named EXACTLY as in Figma. Use these in the app
    // (`<Typography variant="title1" />`), never MUI's h1..h6/caption. Titles are
    // bold; body is regular (use `fontWeight="bold"` for the 700 body emphasis).
    // Custom variants are typed via `mui-theme.d.ts`.
    title1: {
      fontSize: tokens.font.size.title1,
      fontWeight: tokens.font.weight.bold,
    },
    title2: {
      fontSize: tokens.font.size.title2,
      fontWeight: tokens.font.weight.bold,
    },
    title3: {
      fontSize: tokens.font.size.title3,
      fontWeight: tokens.font.weight.bold,
    },
    title4: {
      fontSize: tokens.font.size.title4,
      fontWeight: tokens.font.weight.bold,
    },
    title5: {
      fontSize: tokens.font.size.title5,
      fontWeight: tokens.font.weight.bold,
    },
    body1: {
      fontSize: tokens.font.size.body1,
      fontWeight: tokens.font.weight.regular,
    },
    body2: {
      fontSize: tokens.font.size.body2,
      fontWeight: tokens.font.weight.regular,
    },
    body3: {
      fontSize: tokens.font.size.body3,
      fontWeight: tokens.font.weight.regular,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        // Semantic HTML element rendered for each DS variant.
        variantMapping: {
          title1: 'h1',
          title2: 'h2',
          title3: 'h3',
          title4: 'h4',
          title5: 'h5',
          body1: 'p',
          body2: 'p',
          body3: 'p',
        },
      },
    },
    // Depth usage mapping (Figma): tooltip/popover = MD, menu/modals = L.
    // Cards already get Base via their default elevation={1}.
    MuiTooltip: {
      styleOverrides: { tooltip: { boxShadow: tokens.shadow.md } },
    },
    MuiPopover: {
      styleOverrides: { paper: { boxShadow: tokens.shadow.md } },
    },
    MuiMenu: {
      styleOverrides: { paper: { boxShadow: tokens.shadow.l } },
    },
    MuiDialog: {
      styleOverrides: { paper: { boxShadow: tokens.shadow.l } },
    },
    // Overlay / scrim (Figma): neutral-10 @ 70%. Skip the `invisible` variant so
    // it keeps its transparent background.
    MuiBackdrop: {
      styleOverrides: {
        root: ({ ownerState }) =>
          ownerState.invisible ? {} : { backgroundColor: tokens.color.overlay },
      },
    },
    // Tables (Figma): header row tinted with the lightest ice; row separators
    // in neutral-03. Applies to every table composed from the primitives.
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: tokens.color.fbcIce['01'],
          color: tokens.color.neutral['10'],
          // DS: header text is regular weight, not the bold MUI "medium" default.
          fontWeight: tokens.font.weight.regular,
        },
        root: { borderColor: tokens.color.neutral['03'] },
      },
    },
    // Other component overrides to match Figma go here as specs arrive, e.g.:
    // MuiButton: {
    //   defaultProps: { disableElevation: true },
    //   styleOverrides: { root: { borderRadius: tokens.radius.full, textTransform: 'none' } },
    // },
  },
};

export const theme = createTheme(themeOptions);
