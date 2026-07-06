/**
 * Design tokens — the single source of truth for the visual language, taken from
 * the Figma design system. These are RAW primitive values; `theme.ts` maps them
 * onto the MUI theme. When you get new Figma redlines, update values HERE, not in
 * component files.
 *
 * Values come from the Figma design system (colors, type scale, radii, elevation,
 * breakpoints). A few items still await exact redlines and are flagged inline
 * (e.g. the overlay opacity).
 */
export const tokens = {
  /**
   * FBC color palettes. Keys mirror the Figma token names: brand scales are
   * `fbc-blue-*` / `fbc-ice-*` (→ `fbcBlue` / `fbcIce`); `neutral` and the
   * semantic tokens are not fbc-prefixed in Figma. Scales run 10 (darkest) → 01
   * (lightest). HEX is the source of truth (some Figma redline RGB values were
   * inconsistent). Access a step as e.g. `tokens.color.fbcBlue['06']`.
   */
  color: {
    white: '#ffffff',
    black: '#000000',
    /**
     * Overlay / scrim behind modals, drawers, popovers. Figma: neutral-10 with
     * "Pass through: 70%". Interpreted as 70% opacity (alpha 0.7). If Figma means
     * "70% of the background passes through", change alpha to 0.3.
     */
    overlay: 'rgba(51, 51, 51, 0.7)',
    // FBC Blue (fbc-blue-*) — primary brand. Base = 06.
    fbcBlue: {
      '10': '#05111b',
      '09': '#071724',
      '08': '#091d2e',
      '07': '#0b253b',
      '06': '#0c2941', // base
      '05': '#3d5467',
      '04': '#5c7080',
      '03': '#8f9da8',
      '02': '#b4bdc4',
      '01': '#e7eaec',
    },
    // FBC Ice Blue (fbc-ice-*) — secondary brand.
    fbcIce: {
      '10': '#054159',
      '09': '#075574',
      '08': '#096e96',
      '07': '#0c8dc0',
      '06': '#0d9bd3',
      '05': '#3dafdc',
      '04': '#5dbce2',
      '03': '#90d1eb',
      '02': '#b4e0f1',
      '01': '#e7f5fb',
    },
    // Neutrals — backgrounds, text, borders.
    neutral: {
      '10': '#333333',
      '09': '#404040',
      '08': '#505050',
      '07': '#717171',
      '06': '#8b8b8b',
      '05': '#a6a6a6',
      '04': '#c2c2c2',
      '03': '#dddddd',
      '02': '#f1f1f1',
      '01': '#f9f9f9',
    },
    /**
     * Semantic palette — Figma marks this "In progress". `primary` = light/pastel
     * fill, `secondary` = strong color (used as the MUI `main`). Note the Figma
     * name `alert` (red) maps to MUI `error`.
     */
    semantic: {
      alert: { primary: '#f7cac8', secondary: '#721c24' }, // red → MUI error
      success: { primary: '#d7f0d9', secondary: '#186f07' },
      warning: { primary: '#fcf5cb', secondary: '#856404' },
      info: { primary: '#b4e0f1', secondary: '#075574' },
    },
  },
  font: {
    // Design system font: Lato (self-hosted via @fontsource/lato).
    family: ['Lato', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    // The DS defines only two weights.
    weight: {
      regular: 400,
      bold: 700,
    },
    /**
     * Type scale from Figma (rem → px @16). Titles are 700; body is 400 (with a
     * 700 emphasis available via the `fontWeight` prop). Line-height/letter-spacing
     * are not yet in the redlines — MUI defaults apply until specified.
     *
     * These map to CUSTOM MUI Typography variants named exactly as in Figma
     * (`title1..title5`, `body1..body3`) — defined in `theme.ts`, typed in
     * `mui-theme.d.ts`. See .claude/skills/design-system.
     */
    size: {
      title1: '2.5rem', // 40px  (3XL)
      title2: '2rem', // 32px  (2XL)
      title3: '1.5rem', // 24px  (XL)
      title4: '1.25rem', // 20px  (LG)
      title5: '1rem', // 16px  (MD)
      body1: '1rem', // 16px  (MD)
      body2: '0.875rem', // 14px  (SM)
      body3: '0.75rem', // 12px  (XS)
    },
  },
  /**
   * Border-radius scale from Figma (px). DS default for containers and buttons
   * is `xs` (4px) — set as `theme.shape.borderRadius`. Use a specific step via
   * `tokens.radius.*` (not the numeric `sx` shorthand, which multiplies by the
   * base radius). Border / separation line color is `neutral-03` (#dddddd).
   */
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 32,
    full: 80,
  },
  /**
   * Depth / elevation from Figma. DS levels 1/2/3 = Base / MD / L. Mapped to MUI
   * `theme.shadows[1..3]` so `<Paper elevation={1|2|3}>` matches Base/MD/L.
   * Usage: Base = cards/grid (multiple allowed); MD = tooltip/popover (one at a
   * time); L = menu/modals (one at a time). Never stack elevated surfaces.
   */
  shadow: {
    base: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)', // Level 1 — cards, grid items
    md: '0px 0px 12px 0px rgba(29, 29, 29, 0.2)', // Level 2 — tooltips, popover
    l: '0px 4px 20px 0px rgba(29, 29, 29, 0.2)', // Level 3 — menu, modals
  },
  /**
   * Spacing base. DS rule: use multiples of 4/8 (4, 8, 12, 16, 20, 24, …) for
   * spacing, sizing, typography, buttons. MUI base stays 8 (ecosystem default);
   * `spacing(1)=8`, `spacing(2)=16`… and `spacing(0.5)=4` for 4px steps.
   */
  spacingBase: 8,
  /**
   * Responsive breakpoints (min-width px), from the FBC library. Adds a 6th key
   * `2xl` on top of MUI's defaults (typed in `mui-theme.d.ts`).
   */
  breakpoint: {
    xs: 0,
    sm: 400,
    md: 640,
    lg: 720,
    xl: 1024,
    '2xl': 1281,
  },
  /**
   * 12-column grid. `maxWidth` = the 2xl fixed, centered body. `layout` holds the
   * per-breakpoint columns used, gutter (px) and outer margin (px) — apply these
   * when building layout/Container components (2xl margin is fluid via maxWidth).
   */
  grid: {
    columns: 12,
    maxWidth: 1280,
    layout: {
      xs: { columns: 4, gutter: 8, margin: 20 },
      sm: { columns: 4, gutter: 8, margin: 20 },
      md: { columns: 8, gutter: 16, margin: 20 },
      lg: { columns: 12, gutter: 16, margin: 40 },
      xl: { columns: 12, gutter: 32, margin: 40 },
      '2xl': { columns: 12, gutter: 32, margin: 0 },
    },
  },
} as const;
