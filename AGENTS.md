# AGENTS.md

Guidance for AI coding agents working in this repository. This file is the
**single source of truth** for all agents (Claude Code, Cursor, opencode, etc.).
`CLAUDE.md` imports it. Keep it accurate and concise.

You are an expert in TypeScript, React 19, Rsbuild/Rspack, Module Federation, and
modern frontend architecture. Write maintainable, performant, accessible code.

## What this project is

`mf-customer` is a **Module Federation v2 remote** (provider). MF name: `mf_customer`.
It exposes `./CustomerApp` (`src/app/App.tsx`) to a **host shell that owns routing
via React Router**. The remote therefore:

- Shares `react`, `react-dom`, `react-router-dom` (and `@tanstack/react-query`) as
  **singletons** so host and remote share one instance/context.
- **Does not mount its own `BrowserRouter`** — it renders relative routes. The
  standalone dev `BrowserRouter` lives only in `src/bootstrap.tsx`.

To make it also consume other remotes (become a host), add a `remotes` map in
`module-federation.config.ts`.

## Stack

Bun (package manager) · Rsbuild + Rspack · `@module-federation/rsbuild-plugin` (MF v2) ·
React 19 + React Compiler · TypeScript 6 (strict) · MUI (`@mui/material` + Emotion) ·
axios + TanStack Query · React Hook Form + Zod (forms/validation) · Biome (lint/format) ·
Rstest + Testing Library (happy-dom).

## Commands

- `bun install` — install dependencies
- `bun run dev` — dev server on **http://localhost:3001**
- `bun run build` — production build (emits `dist/remoteEntry.js` + `dist/mf-manifest.json`)
- `bun run preview` — preview the production build
- `bun run test` / `bun run test:watch` — Rstest
- `bun run type-check` — `tsc --noEmit`
- `bun run lint` — Biome lint (no writes)
- `bun run check` — Biome lint + format with `--write` (use before committing)
- `bun run format` — Biome format with `--write`
- `bun run depcruise` — enforce architecture boundaries (see below)

## Architecture & conventions

Feature-based layout (bulletproof-react) with a Public API per feature (Feature-Sliced
Design). **Dependency flow is one-directional: `shared → features → app`.**

```
src/
  index.tsx        # MF async boundary: import('./bootstrap')
  bootstrap.tsx    # standalone render (StrictMode + BrowserRouter)
  app/             # composition: App.tsx (exposed), provider.tsx, routes/
  components/ui/   # shared, domain-agnostic UI
  config/          # theme.ts, env.ts (PUBLIC_* only)
  features/<name>/ # api/ components/ hooks/ stores/ types/ utils/ + index.ts (Public API)
  hooks/ lib/ stores/ types/ utils/   # shared layers
  lib/             # api-client (axios), react-query
  testing/         # renderWithProviders + mocks
```

Rules (enforced by `depcruise`, see `.dependency-cruiser.cjs`):

- A feature **must not** import from another feature. Import a feature **only via its
  `index.ts`** (its Public API); never reach into its internals.
- Shared layers (`components`, `hooks`, `lib`, `stores`, `types`, `utils`, `config`)
  must not import from `features` or `app`.
- Use the `@/` path alias for `src/` (e.g. `import { theme } from '@/config/theme'`).
- Max 2–3 levels of nesting; name folders by domain, not by technical type.

### UI

- Use MUI components and the shared `theme` (`src/config/theme.ts`). Style with the `sx`
  prop or `styled`; avoid ad-hoc inline styles. Wrap with `CssBaseline` (done in provider).

### Data fetching

- Every HTTP call goes through the axios instance in `src/lib/api-client.ts`.
- Use TanStack Query for server-state (stable query keys, `useQuery`/`useMutation`,
  invalidate on mutation). **Never** fetch with a manual `useEffect`.
- Read config from `src/config/env.ts`. Only `PUBLIC_*` vars reach the client — **never
  put secrets in the bundle**.

### Forms & validation

- Use **React Hook Form + Zod** (`@hookform/resolvers/zod`); never Formik/Yup. A Zod schema
  is the single source of truth — derive types with `z.infer`. Bind MUI inputs via
  `<Controller>`. Validate API responses with Zod too (`schema.parse` in the `queryFn`).
  Zod is local, not an MF shared singleton.

### Testing

- Import test APIs from `@rstest/core` (`test`, `expect`, `rs`, …); never commit `.only`.
- Use `renderWithProviders` from `src/testing/test-utils.tsx` (wraps theme + query client
  + MemoryRouter). Query the DOM by role/text (Testing Library), assert with jest-dom.

### Module Federation

- Keep `react`/`react-dom`/`react-router-dom` as `singleton`. Do not enable
  `output.module` (MF runtime has no ESM output support).
- Exposed modules are declared in `module-federation.config.ts` under `exposes`.

## Reference docs (llms.txt)

- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
- Rstest: https://rstest.rs/llms.txt
- Module Federation: https://module-federation.io/llms.txt
- MUI: https://mui.com/material-ui/llms.txt

## Deeper guides (skills)

- `.agents/skills/` — vendored best-practices (rsbuild, rstest, vercel-react). Managed by
  `skills-lock.json`; **do not edit**.
- `.claude/skills/` — project skills (module-federation, mui-theming, design-system,
  data-fetching, forms, project-architecture). Consult the relevant one before non-trivial
  work in that area.
