---
name: design-system
description: How to build the UI design system for mf-customer — a MUI-based, token-driven component library under src/components/ui, translated from a Figma design system (Atomic Design). Use when creating/updating shared UI components, design tokens, or the theme.
---

# Design system

The UI comes from a **Figma design system** (Atomic Design, visually close to MUI). We build
it **on top of MUI**, not from scratch: encode Figma into tokens + theme, and add thin
wrapper components only when needed. Specs arrive as **screenshots + redlines** (no Figma
access from here).

## The golden path: tokens → theme → (wrapper only if needed)

1. **Tokens** (`src/config/tokens.ts`) — raw Figma primitives (colors, font family/weights,
   radii, spacing base). Update values HERE when redlines change; never hardcode a hex/px in
   a component.
2. **Theme** (`src/config/theme.ts`) — maps tokens onto MUI: `palette`, `typography`,
   `shape`, `spacing`, and `components` overrides (`defaultProps`, `styleOverrides`,
   custom `variants`). **Most Figma matching happens here, globally.**
3. **Wrapper component** — only when the component needs a different/constrained API, a
   composition MUI doesn't provide, or design rules you want to lock in. If a plain MUI
   component + theme already matches Figma, **use it directly — don't wrap for the sake of
   wrapping.**

## Prefer theme over per-instance styling

Restyle a whole component class in the theme (`components.MuiButton.styleOverrides`) instead
of repeating `sx` on every usage. Add a custom **variant** for a Figma variant that MUI
lacks. Reserve `sx` for one-off layout tweaks.

## Typography (implemented)

Typeface: **Lato**, self-hosted via `@fontsource/lato` (imported once in
`src/config/fonts.ts` ← `app/provider.tsx`). The DS defines only **400 (regular)** and
**700 (bold)** — no other weight is loaded, and MUI's "medium" is mapped to 700.

The Figma type scale is encoded in `tokens.ts` (`font.size`) and applied to **custom MUI
Typography variants named exactly as in Figma** (`theme.ts`, typed in `mui-theme.d.ts`).
**Use the variant — never hardcode `fontSize`, and do not use MUI's `h1..h6`/`caption`** for
DS text (they are kept only for MUI-internal components).

| Figma variant | px / rem      | Weight | Renders as |
| ------------- | ------------- | ------ | ---------- |
| `title1` (3XL)| 40 / 2.5rem   | 700    | `<h1>`     |
| `title2` (2XL)| 32 / 2rem     | 700    | `<h2>`     |
| `title3` (XL) | 24 / 1.5rem   | 700    | `<h3>`     |
| `title4` (LG) | 20 / 1.25rem  | 700    | `<h4>`     |
| `title5` (MD) | 16 / 1rem     | 700    | `<h5>`     |
| `body1` (MD)  | 16 / 1rem     | 400    | `<p>`      |
| `body2` (SM)  | 14 / 0.875rem | 400    | `<p>`      |
| `body3` (XS)  | 12 / 0.75rem  | 400    | `<p>`      |

```tsx
<Typography variant="title1">Title</Typography>
<Typography variant="body1">Text</Typography>
<Typography variant="body1" fontWeight="bold">Emphasis (700)</Typography> // Body 1/2 bold
<Typography variant="body3">Small detail</Typography>
```

**Weight convention** (the DS ships only 400/700): titles and `Button` labels use **700**;
body text and small UI labels (`Badge`, `Chip`, table headers) use **400**. MUI's
`fontWeightMedium` is mapped to 700, so any component that defaults to "medium" and should be
regular must set `fontWeight` to 400 explicitly (as done for `MuiTableCell` head, Badge, Chip).

To add a new custom variant later: add its size to `tokens.ts`, the style to `theme.ts`
typography, a `variantMapping` entry, and the type in `mui-theme.d.ts`.

Line-height / letter-spacing are not in the redlines yet (MUI defaults apply). Update
`tokens.ts` when they arrive.

## Colors (implemented)

The FBC palette lives in `tokens.ts` (`color`) and is mapped to MUI palette roles in
`theme.ts`. **In components, prefer semantic roles over raw hex/scale steps.**

Token keys mirror the Figma names. Scales (10 = darkest → 01 = lightest), HEX is the source
of truth:
- `color.fbcBlue` — FBC Blue (`fbc-blue-*`, primary brand, base = `06`)
- `color.fbcIce` — FBC Ice Blue (`fbc-ice-*`, secondary brand)
- `color.neutral` — text / backgrounds / borders (not fbc-prefixed in Figma)
- `color.semantic.{alert,success,warning,info}.{primary,secondary}` — Figma **"In progress"**;
  `primary` = pastel fill, `secondary` = strong. Figma `alert` (red) → MUI **`error`**.

MUI palette mapping:

| Role | main | light | source |
| ------------ | ------------------- | ---------------- | ------ |
| `primary`    | fbc-blue-06 `#0c2941` | fbc-blue-04    | FBC Blue |
| `secondary`  | fbc-ice-06 `#0d9bd3`  | fbc-ice-04     | FBC Ice |
| `error`      | alert-sec `#721c24` | alert-pri pastel | semantic |
| `success`    | `#186f07`           | pastel           | semantic |
| `warning`    | `#856404`           | pastel           | semantic |
| `info`       | `#075574`           | pastel           | semantic |
| text.primary | neutral-10 `#333`   | —                | neutral |
| text.secondary | neutral-08 `#505050` | —             | neutral (AA-safe) |
| background.default / paper | white / white | —  | DS: white page |
| divider      | neutral-03 `#dddddd`| —                | neutral |

Usage — prefer roles:

```tsx
<Button color="primary" />                    // FBC Blue
<Alert severity="error" />                     // semantic alert/error
<Box sx={{ color: 'text.secondary', bgcolor: 'background.paper' }} />
```

Need a specific scale step not covered by a role? Import the token, don't hardcode hex:

```tsx
import { tokens } from '@/config/tokens';
sx={{ borderColor: tokens.color.fbcBlue['03'] }}
```

If a scale step is needed often, consider exposing it via MUI palette augmentation instead
of repeating token access (discuss first — adds type boilerplate).

### Accessibility — text color on each swatch (WCAG, from Figma)

When you place text ON a brand/neutral swatch, use the text color below to stay AA/AAA. The
"flip point" is where the scale gets dark enough to need white text:

| Scale     | Use **black** text | Use **white** text |
| --------- | ------------------ | ------------------ |
| FBC Blue  | `01`–`03`          | `04`–`10`          |
| FBC Ice   | `01`–`07`          | `08`–`10`          |
| Neutral   | `01`–`06`          | `07`–`10`          |

Notes: these come from the Figma palette's WCAG annotations.
- `neutral-07` as **text on white** is borderline AA (~4.6:1) — that's why `text.secondary`
  uses `neutral-08`.
- `primary` (fbc-blue-06) uses **white** `contrastText` (14.9:1 AAA).
- `secondary` (fbc-ice-06) uses **black** `contrastText` — white fails AA there (3.16:1);
  black passes AAA (6.64:1). Use `color.black`, not `neutral-10` (only 3.99:1).
- Dark semantic `main`s (error/success/warning/info) use white text (all ≥ ~5:1).

## Depth / elevation (implemented)

Three depth levels from Figma, in `tokens.ts` (`shadow`) and mapped to
`theme.shadows[1..3]` so **DS level = MUI `elevation`**:

| Level | Token         | `elevation` | Shadow                                | Use for |
| ----- | ------------- | ----------- | ------------------------------------- | ------- |
| 1 Base| `shadow.base` | `1`         | `0 4px 4px rgba(0,0,0,.25)`           | cards, grid items |
| 2 MD  | `shadow.md`   | `2`         | `0 0 12px rgba(29,29,29,.2)`          | tooltips, popover |
| 3 L   | `shadow.l`    | `3`         | `0 4px 20px rgba(29,29,29,.2)`        | menu, modals |

Components are pre-wired in the theme: `Card` (default `elevation={1}`) → Base; `Tooltip`,
`Popover` → MD; `Menu`, `Dialog` → L. For custom surfaces use `<Paper elevation={1|2|3}>`
or `sx={{ boxShadow: 1 | 2 | 3 }}` (or `tokens.shadow.*`).

Usage rules (from Figma Do/Don't):
- **Base** may be used on **multiple** elements on a page. **MD** and **L** should be on
  **one element at a time**.
- **Never stack** elevated surfaces (no elevated element on top of another elevated one).
- Don't put multiple L/MD elevations on the same page.

## Shapes — border radius (implemented)

Radius scale from Figma in `tokens.ts` (`radius`, px). DS default for containers and buttons
is **`xs` (4px)**, set as `theme.shape.borderRadius` (so Button/Card/Paper/TextField get 4px).

| Token | px | | Token | px |
| ----- | -- | - | ------ | -- |
| `none`| 0  | | `lg`   | 16 |
| `xs`  | 4  | | `xl`   | 20 |
| `sm`  | 8  | | `2xl`  | 32 |
| `md`  | 12 | | `full` | 80 |

For a specific radius, use the token — **not** the numeric `sx` shorthand, which multiplies
by the base radius (`sx={{ borderRadius: 2 }}` = 2 × 4px = 8px, confusing):

```tsx
<Box sx={{ borderRadius: `${tokens.radius.lg}px` }} />   // 16px, explicit
```

Border / separation line color is `neutral-03` (`#dddddd`) — already the theme `divider`.

## Grid, spacing & breakpoints (implemented)

**Spacing** — DS rule: use multiples of **4/8** (4, 8, 12, 16, 20, 24, …) for spacing, sizing,
buttons, typography. MUI base stays 8: `theme.spacing(1)=8`, `spacing(2)=16`, and
`spacing(0.5)=4` for 4px steps. Prefer `sx={{ p: 2, gap: 3 }}` over hardcoded px.

**Grid** — 12-column system. Use MUI `Grid` (12 columns). Per-breakpoint column counts,
gutters and margins live in `tokens.grid.layout` (apply when building layout/Container
components). `tokens.grid.maxWidth = 1280` is the 2xl fixed, centered body width.

**Breakpoints** (min-width, in `theme.breakpoints`, from the FBC library) — note the custom
6th key **`2xl`** (typed in `mui-theme.d.ts`):

| Key   | Range (px)   | Cols | Gutter | Margin |
| ----- | ------------ | ---- | ------ | ------ |
| `xs`  | 0–399        | 4    | 8      | 20 fixed |
| `sm`  | 400–639      | 4    | 8      | 20 fixed |
| `md`  | 640–719      | 8    | 16     | 20 fixed |
| `lg`  | 720–1023     | 12   | 16     | 40 fixed |
| `xl`  | 1024–1280    | 12   | 32     | 40 fixed |
| `2xl` | ≥1281        | 12   | 32     | fluid (body 1280 centered) |

```tsx
sx={{ px: { xs: 2.5, lg: 5 } }}                 // 20px → 40px margins
useMediaQuery(theme.breakpoints.up('2xl'))       // custom key, typed
```

## Overlay / scrim (implemented)

The overlay behind modals/drawers/popovers is `tokens.color.overlay` — Figma `neutral-10` at
**70%** (`rgba(51,51,51,0.7)`). Wired into MUI's `Backdrop`, so `Dialog`, `Drawer` and
`Modal` use it automatically (the `invisible` backdrop stays transparent).

> ⚠️ Figma says "Pass through: 70%". Implemented as 70% opacity. If it means "70% of the
> background passes through", change the alpha to `0.3` in `tokens.color.overlay`.

## Folder convention (flat, one folder per component)

Shared, domain-agnostic components live in `src/components/ui/` — the `shared` layer, so they
must NOT import from `features` or `app`.

```
src/components/ui/
  Button/
    Button.tsx        # the component (wraps/extends MUI)
    index.ts          # public export: export { Button } from './Button'
  TextField/
    ...
```

- One folder per component; export via its `index.ts`.
- `src/components/layouts/` holds templates/page shells (still domain-agnostic).

### Testing policy (avoid over-testing atoms)

Test **behavior and composition, not presentation**:

- **Pure presentational atoms** (thin MUI wrappers like `Button` with no own logic) → **no
  unit test**. MUI already tests render/click/disabled, and Testing Library can't reliably
  assert CSS/colors. A `Component.test.tsx` is only added when the atom carries real logic
  (masking, internal validation, controlled/uncontrolled state).
- **Molecules / organisms / features** → **yes, test** — that's where behavior and
  composition live. Mock the network at the axios boundary (see `.claude/rules/testing`).
- Visual/state fidelity is a job for visual tests/Storybook (not enabled yet), not unit
  tests. Atoms are validated implicitly by the tested components that use them.

## Atomic Design ↔ this architecture

- **Atoms / molecules / generic organisms** (Button, TextField, DataTable, PageHeader) →
  `src/components/ui/` (shared, no domain knowledge).
- **Templates / layouts** → `src/components/layouts/` or `app/`.
- **Domain organisms** (e.g. a customer card that knows the `Customer` type) →
  `features/<feature>/components/`, NOT the shared design system.
- **Pages** → `app/routes/` + features.

Rule of thumb: *"Does this make sense outside any feature?"* Yes → `components/ui`. No →
inside the feature.

## Wrapper pattern (when you do wrap)

Keep wrappers thin: extend MUI's props, forward the ref, don't hide the underlying API.

```tsx
import { Button as MuiButton, type ButtonProps } from '@mui/material';

export type AppButtonProps = ButtonProps; // extend/constrain as the DS requires

export function Button(props: AppButtonProps) {
  return <MuiButton {...props} />;
}
```

## Workflow per component (screenshots + redlines)

1. If the redline introduces new global values (color/type/spacing/radius), add them to
   `tokens.ts` and map in `theme.ts` first.
2. Decide: theme-only (no new file) vs wrapper. Build the smallest thing that matches.
3. Cover states from Figma (hover, focus, disabled, error, loading, sizes, variants).
4. Ensure a11y (labels on icon-only controls, visible focus, semantic roles). Add a unit
   test **only if the component has its own logic** — pure presentational atoms don't
   (see Testing policy above).
5. Run `bun run type-check`, `bun run check`, `bun run depcruise` (plus `bun run test` when
   the component has tests).

Build bottom-up: atoms (Button, Input, Typography, Icon, Badge…) → molecules → organisms.

## Module Federation note

This remote uses an **isolated Emotion cache** (`src/app/emotion-cache.ts`, `key: 'mfc'`,
`prepend`, optional CSP `nonce`), provided via `CacheProvider` in `app/provider.tsx` above
the ThemeProvider. This namespaces our styles and fixes injection-order conflicts when the
host also uses Emotion/MUI — near-zero cost (`@emotion/cache` ships inside `@emotion/react`).

`@mui/material` / Emotion are in `mfOptions.shared` as **non-singletons** (deduped when
versions match the shell, otherwise each MFE ships its own) — NOT singletons, which keeps
MFE autonomy. Make them `singleton` only if the host coordinates an exact MUI/Emotion
version. A strict host CSP must expose a nonce via `<meta property="csp-nonce">` or
`window.__CSP_NONCE__`.

Reference: MUI theming — https://mui.com/material-ui/customization/theming/ ·
https://mui.com/material-ui/llms.txt
