# AGENTS.md

Guidance for AI coding agents working in this repository. This file is the
**single source of truth** for all agents (Claude Code, Cursor, opencode, etc.).
`CLAUDE.md` imports it. Keep it accurate and concise.

You are an expert in TypeScript, React 18, single-spa, Rsbuild/Rspack, classic Module
Federation, and modern frontend architecture. Write maintainable, performant, accessible code.

## What this project is

`mf-customer` is a **single-spa microfrontend** for the Falabella Business Center
(FBC) portal, integrated via **classic Module Federation** (rspack container). MF
name: `mf_customer`. It exposes `./App` (`src/app/App.tsx`) — a single-spa
application exporting `bootstrap`/`mount`/`unmount`. The FBC shell:

- Registers this remote as a single-spa app and mounts it into its own DOM anchor
  (it does not `React.lazy` a plain component).
- Does **not** provide a Router — this MFE mounts its **own**
  `<BrowserRouter basename="/customer-master">` in `src/app/App.tsx` (basename `/` in
  standalone dev). The shell owns the chrome (header/sidebar); we render content only.
- Shares the session/config through the **redux-micro-frontend global store**, not
  props alone. The bridge lives in `src/lib/auth` (reads the `auth` and
  `configuration` partner states; seeds from the single-spa `payload`).

Shared singletons (must match the shell): `react`, `react-dom`, `single-spa`,
`single-spa-react`, `redux-micro-frontend`. `react-router-dom` is **not** shared —
each MFE owns its Router. See `.claude/rules/module-federation.md`.

## Stack

Bun (package manager) · Rsbuild + Rspack · **classic** `rspack.container.ModuleFederationPlugin`
(matches the FBC shell; added via `tools.rspack`) · single-spa + single-spa-react ·
redux-micro-frontend (shell global store) · React **18.3** (singleton with the shell) ·
TypeScript 6 (strict) · MUI (`@mui/material` + Emotion) · axios + TanStack Query ·
React Hook Form + Zod (forms/validation) · Biome (lint/format) · Rstest + Testing Library (happy-dom).

## Commands

- `bun install` — install dependencies
- `bun run dev` (alias `bun run start`) — dev server on **http://localhost:3020**
- `bun run build` — production build (emits the classic `dist/remoteEntry.js`)
- `bun run preview` (alias `bun run serve`) — preview the production build
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
  bootstrap.tsx    # standalone dev render: <App standalone /> (App owns the Router)
  app/             # composition + MF exposes: App.tsx (./App), Card.tsx (./Card),
                   #   MenuItem.tsx (./MenuItem), provider.tsx, emotion-cache.ts
    routes/        # routing layer: index.tsx (router) + PrivateRoute.tsx (guard) +
                   #   HomePage.tsx + pages by domain (customer-master/ · agents/ · security-sensor/)
  components/ui/   # shared, domain-agnostic UI
  config/          # theme.ts (Lato), shell-theme.ts (Poppins, for Card/MenuItem),
                   #   tokens.ts, env.ts (PUBLIC_*), app.ts (portal constants), i18n/ (es/en/cn)
  features/<name>/ # api/ components/ hooks/ stores/ types/ utils/ + index.ts (Public API)
  hooks/ stores/ types/ utils/   # shared layers
  lib/             # api-client (axios, injects the shell token), react-query,
                   #   auth/ (redux-micro-frontend session bridge)
  testing/         # renderWithProviders + mocks
```

Rules (enforced by `depcruise`): a feature must not import another feature (import only via its
`index.ts`); shared layers (`components`, `hooks`, `lib`, `stores`, `types`, `utils`, `config`)
must not import `features`/`app`; use the `@/` alias; 2–3 nesting levels, folders by domain.
Details → `.claude/rules/architecture.md`, `project-architecture` skill.

## Conventions

Each bullet is the actionable rule (so any agent has it inline); the deep guidance — examples,
token tables, edge cases — lives ONCE in the linked skill/rule. Keep volatile facts (versions,
ports, exposes) canonical here in AGENTS.md; keep patterns in the skills.

- **UI / theming** — MUI + the shared `theme` (Lato); style with `sx`/`styled`, no inline
  styles; `shell-theme.ts` (Poppins) only for `./Card`/`./MenuItem`.
  → `mui-theming` & `design-system` skills, `.claude/rules/mui-styling.md`.
- **Data fetching** — all HTTP via `@/lib/api-client` (injects the shell token); TanStack Query
  for server-state; never fetch in `useEffect`; only `PUBLIC_*` env, no secrets in the bundle.
  → `data-fetching` skill, `.claude/rules/data-fetching.md`.
- **Forms** — React Hook Form + Zod (`@hookform/resolvers/zod`), never Formik/Yup; the Zod
  schema is the source of truth (`z.infer`); validate API responses too.
  → `forms` skill, `.claude/rules/forms.md`.
- **Testing** — Rstest + Testing Library via `renderWithProviders`; mock at the axios boundary;
  never `.only`; i18n is initialized in `tests/rstest.setup.ts`. → `.claude/rules/testing.md`.
- **i18n** — i18next (`src/config/i18n`, locales `es`/`en`/`cn`), `useTranslation()`; language
  auto-syncs to the shell's `configuration.language`; add every key to all three locales
  (`en.ts` defines the shape); never translate DATA values, only display text. → `i18n` skill.
- **Module Federation** — classic `rspack.container.ModuleFederationPlugin` (via `tools.rspack`,
  skipped in tests), NOT MF v2; singletons `react`/`react-dom`/`single-spa`/`single-spa-react`/
  `redux-micro-frontend` (React stays 18.3); `react-router-dom` NOT shared; exposes `./App`,
  `./Card`, `./MenuItem` (Card/MenuItem use `shell-theme.ts`).
  → `module-federation` & `portal-integration` skills, `.claude/rules/module-federation.md`.

## Reference docs (llms.txt)

- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
- Rstest: https://rstest.rs/llms.txt
- Module Federation: https://module-federation.io/llms.txt
- MUI: https://mui.com/material-ui/llms.txt

## Deeper guides (skills)

- `.agents/skills/` — vendored best-practices (rsbuild, rstest, vercel-react). Managed by
  `skills-lock.json`; **do not edit**.
- `.claude/skills/` — project skills (portal-integration, i18n, module-federation, mui-theming,
  design-system, data-fetching, forms, project-architecture). Consult the relevant one before
  non-trivial work in that area.
