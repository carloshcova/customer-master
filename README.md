# mf-customer

Customer **microfrontend** — a Module Federation v2 **remote** (`mf_customer`) that exposes
`./CustomerApp` to a host shell. Built with Bun, Rsbuild/Rspack, React 19, TypeScript, MUI,
axios + TanStack Query, Biome, and Rstest.

> Working with an AI assistant? Start with [`AGENTS.md`](./AGENTS.md) (shared across tools)
> and [`CLAUDE.md`](./CLAUDE.md) (Claude Code).

## Setup

```bash
bun install
```

## Scripts

```bash
bun run dev          # dev server at http://localhost:3001
bun run build        # production build → dist/remoteEntry.js + dist/mf-manifest.json
bun run preview      # preview the production build
bun run test         # run tests (Rstest)
bun run test:watch   # tests in watch mode
bun run type-check   # tsc --noEmit
bun run lint         # Biome lint
bun run check        # Biome lint + format (--write)
bun run depcruise    # enforce architecture boundaries
```

## Architecture

Feature-based layout (bulletproof-react) with a Public API per feature (Feature-Sliced
Design) and a one-directional dependency flow `shared → features → app`, enforced by
`dependency-cruiser`. See [`.claude/skills/project-architecture`](./.claude/skills/project-architecture/SKILL.md).

```
src/
  index.tsx / bootstrap.tsx   # MF async boundary + standalone render
  app/                        # App (exposed), provider, routes
  components/ui/ config/ hooks/ lib/ stores/ types/ utils/   # shared layers
  features/<name>/            # domain modules (api, components, …, index.ts = Public API)
  testing/                    # test utilities
```

## Module Federation

This remote exposes `./CustomerApp`. The host owns React Router; shared deps
(`react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`) are singletons. To
expose more modules use the `/expose-module` command; details in
[`.claude/skills/module-federation`](./.claude/skills/module-federation/SKILL.md).

## Configuration

Copy `.env.example` to `.env.local` and set `PUBLIC_*` variables. Only `PUBLIC_*`-prefixed
vars reach the client bundle — never put secrets in env consumed by the frontend.

## Learn more

- [Rsbuild](https://rsbuild.rs) · [Rspack](https://rspack.rs) ·
  [Module Federation](https://module-federation.io) · [MUI](https://mui.com/material-ui/) ·
  [TanStack Query](https://tanstack.com/query) · [Rstest](https://rstest.rs)
