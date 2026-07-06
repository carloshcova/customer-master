import type * as React from 'react';

/**
 * TypeScript augmentation for the custom design-system typography variants
 * (named exactly as in Figma). Keeps `<Typography variant="title1" />` and
 * `variant="body3"` valid and autocompleted. `body1`/`body2` already exist as
 * MUI defaults, so only the new variants are declared here.
 */
declare module '@mui/material/styles' {
  interface TypographyVariants {
    title1: React.CSSProperties;
    title2: React.CSSProperties;
    title3: React.CSSProperties;
    title4: React.CSSProperties;
    title5: React.CSSProperties;
    body3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    title1?: React.CSSProperties;
    title2?: React.CSSProperties;
    title3?: React.CSSProperties;
    title4?: React.CSSProperties;
    title5?: React.CSSProperties;
    body3?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title1: true;
    title2: true;
    title3: true;
    title4: true;
    title5: true;
    body3: true;
  }
}

// Adds the 6th DS breakpoint on top of MUI's default xs..xl.
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    '2xl': true;
  }
}
