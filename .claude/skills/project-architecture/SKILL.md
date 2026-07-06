---
name: project-architecture
description: The folder architecture and conventions of mf-customer — feature-based layout, layers, the shared→features→app dependency rule, Public API per feature, and how to add a new feature. Use when adding features/files, deciding where code belongs, or reviewing structure.
---

# Project architecture

Feature-based layout (bulletproof-react) with a Public API per feature (Feature-Sliced
Design). One-directional dependency flow: **`shared → features → app`**, enforced by
`.dependency-cruiser.cjs` (`bun run depcruise`).

## Layers

```
src/
  index.tsx        # MF async boundary → import('./bootstrap')
  bootstrap.tsx    # standalone render: StrictMode + BrowserRouter (dev only)
  app/             # composition layer
    App.tsx        # exposed as ./CustomerApp; wraps provider + routes; NO Router
    provider.tsx   # ThemeProvider + CssBaseline + QueryClientProvider + ErrorBoundary
    routes/        # relative routes (host mounts them under its base path)
  components/ui/   # shared, domain-agnostic UI
  config/          # theme.ts, env.ts (PUBLIC_* only)
  features/<name>/ # domain modules (see below)
  hooks/ stores/ types/ utils/   # shared cross-cutting code
  lib/             # preconfigured libs: api-client (axios), react-query
  testing/         # renderWithProviders + mocks
```

## Anatomy of a feature

A feature MAY contain any of these segments — but **create a folder only when it has real
content**. Do not scaffold empty segments "just in case": an empty folder is noise and
misrepresents the feature's actual complexity. The structure emerges from need.

```
features/<feature>/
  api/         # query/mutation hooks (TanStack Query) + axios calls
  components/  # UI scoped to the feature
  hooks/       # feature-only hooks
  stores/      # feature-only state
  types/       # feature-only types
  utils/       # feature-only helpers
  index.ts     # PUBLIC API — the only entry point other code may import
```

Example: a typical feature starts with only `api/`, `components/`, `types/` and `index.ts`
because that is all it needs at first. Add `hooks/`, `stores/`, or `utils/` the moment (and
only when) you have something to put in them.

> **`lib/` is never a feature segment.** It is a *shared-only* layer (`src/lib/`) reserved
> for preconfigured third-party libraries / infrastructure (axios client, query client).
> A feature *consumes* `@/lib/...`; it does not own a `lib/`. Feature-local reusable logic
> belongs in the feature's `hooks/` or `utils/`, not in a `lib/`.

## The rules (enforced)

- A feature must **not** import from another feature.
- Import a feature **only via its `index.ts`**; never deep-import its internals.
- Shared layers must not import from `features` or `app`.
- Use the `@/` alias across layers; relative imports only inside the same feature.
- Max 2–3 levels of nesting; name folders by domain, not technical type.

## Adding a feature

1. Create `src/features/<name>/` with **only the segments that have content now** — never
   create empty folders. Most features start with just `api/`, `components/`, `types/`.
2. Put the query hooks in `api/`, UI in `components/`, types in `types/`. Add `hooks/`,
   `stores/`, `utils/` later, only when needed. Do **not** create a `lib/` inside a feature.
3. Export the public surface from `index.ts` — nothing else is importable.
4. Mount its UI from `src/app/routes/` (a `<Route>`), importing via the Public API.
5. Run `bun run type-check`, `bun run test`, `bun run depcruise`.

Scaffold with `/new-feature`.

## Workflow

`bun run dev` (port 3001) · `bun run test` · `bun run check` (Biome) · `bun run type-check`
· `bun run depcruise` · `bun run build` (emits `remoteEntry.js` + `mf-manifest.json`).
