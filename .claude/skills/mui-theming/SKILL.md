---
name: mui-theming
description: How MUI is set up in mf-customer — the shared theme, ThemeProvider/CssBaseline in the provider, the sx prop and styled(), icons, and accessibility. Use when building UI, styling components, or extending the theme.
---

# MUI theming

## Setup

- The theme lives in `src/config/theme.ts` (`createTheme(...)`): palette, `shape`,
  typography. Extend it here — don't hardcode colors/spacing in components.
- `src/app/provider.tsx` wraps the app with an isolated Emotion `CacheProvider` +
  `ThemeProvider`. The CSS reset uses `ScopedCssBaseline` (embed-safe — never leaks to the
  host), plus a global `CssBaseline` only in `standalone` mode.
- Emotion (`@emotion/react`/`@emotion/styled`) is the styling engine, with a per-remote
  isolated cache (`src/app/emotion-cache.ts`, `key: 'mfc'`) for Module Federation safety.

## Styling components

Prefer the `sx` prop with theme tokens; use `styled()` for reusable styled components.

```tsx
<Stack sx={{ alignItems: 'center', py: 4 }} />
<Box sx={{ color: 'primary.main', borderRadius: 1 }} />
```

Avoid ad-hoc inline `style={{}}`. Note: in this MUI version pass layout/spacing props via
`sx` (e.g. `sx={{ py: 4 }}`) rather than as bare props on `Stack`.

## Extending the theme

Add tokens (palette colors, custom variants, component `defaultProps`/`styleOverrides`) in
`theme.ts` so they apply globally. Augment the `Theme` type if you add custom keys.

## Icons

Import individually from `@mui/icons-material` (tree-shakeable):
`import MenuIcon from '@mui/icons-material/Menu';`.

## Accessibility

Label icon-only buttons (`aria-label`), give progress/spinners an accessible name, keep
semantic roles, and preserve visible focus states. Components must be testable by role/text.

## Shared UI

Promote reusable, domain-agnostic components to `src/components/ui/`. Keep feature-specific
UI inside the feature.

MUI reference: https://mui.com/material-ui/llms.txt
