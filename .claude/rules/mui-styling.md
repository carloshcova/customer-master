---
paths:
  - "src/**/*.tsx"
---

# MUI styling rules

- Build UI from MUI components. Use the shared theme in `src/config/theme.ts`; extend the
  theme rather than hardcoding colors/spacing.
- Style with the `sx` prop or `styled()`. Prefer theme tokens (`sx={{ py: 4 }}`,
  `color: 'primary.main'`) over raw pixel/hex values. Avoid ad-hoc inline `style={{}}`.
- `CssBaseline` is applied once in `src/app/provider.tsx`; don't add it again.
- Keep components accessible: label icon-only controls, use semantic roles, ensure focus
  states. Provide `aria-label` for spinners/progress.
