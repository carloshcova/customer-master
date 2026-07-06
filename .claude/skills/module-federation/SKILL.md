---
name: module-federation
description: How Module Federation v2 is wired in this mf-customer remote — exposing modules, shared singletons, integrating with the host's React Router, becoming a host, types, and debugging. Use when editing module-federation.config.ts / rsbuild.config.ts, exposing modules, or consuming remotes.
---

# Module Federation in `mf-customer`

This app is a **remote/provider** built with `@module-federation/rsbuild-plugin` (MF v2).
MF name: `mf_customer`. It exposes `./CustomerApp` and is consumed by a host shell that
owns routing via React Router.

## Key files

- `module-federation.config.ts` — `createModuleFederationConfig({...})`: `name`, `filename`
  (`remoteEntry.js`), `exposes`, `shared`, `dts`.
- `rsbuild.config.ts` — registers `pluginModuleFederation(mfConfig)`, sets `server.port`
  (3001), `dev.assetPrefix: true`, `output.assetPrefix: 'auto'`.
- Build output: `dist/remoteEntry.js` + `dist/mf-manifest.json` (the v2 manifest).

## Exposing a module

Add to `exposes` in `module-federation.config.ts`, pointing at a real file:

```ts
exposes: {
  './CustomerApp': './src/app/App.tsx',
  './CustomerWidget': './src/features/<feature>/index.ts',
}
```

The host imports it as `mf_customer/CustomerApp`. Expose stable, self-contained components
(the exposed root bundles its own providers). See `/expose-module`.

## Shared dependencies

Keep these as singletons so host and remote share one instance/context:

```ts
shared: {
  react: { singleton: true, requiredVersion: '^19.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
  '@tanstack/react-query': { singleton: true },
}
```

`requiredVersion` mismatches between host and remote cause runtime warnings/duplicate
instances — align ranges with the host.

## Routing (host owns the Router)

- The exposed `App` (`src/app/App.tsx`) renders **relative** routes via `CustomerRoutes`
  and must **not** mount a `BrowserRouter`.
- The standalone `BrowserRouter` is only in `src/bootstrap.tsx` for running the remote on
  its own (`bun run dev`).
- The host mounts `./CustomerApp` under a base path (e.g. `/customers/*`); routes resolve
  relative to it. Avoid absolute paths and navigation that assumes the host's origin.

## Becoming a host (consuming remotes)

Add a `remotes` map and load remotes resiliently:

```ts
// module-federation.config.ts
remotes: { mf_orders: 'mf_orders@https://orders.example.com/remoteEntry.js' }
```

```tsx
const OrdersApp = React.lazy(() => import('mf_orders/OrdersApp'));
// <ErrorBoundary><Suspense fallback={<Spinner/>}><OrdersApp/></Suspense></ErrorBoundary>
```

## Types across remotes

`dts` is `false` in the base. Enable `dts: { generateTypes: true }` to emit types for your
exposes, or `consumeTypes: true` to pull host/remote types when consuming. Generated types
land in `@mf-types/` (gitignored).

## Constraints & gotchas

- Never set `output.module: true` — MF runtime has no ESM output support.
- Restrict `server.cors` to trusted origins in production; apply a CSP allowing only
  trusted remote origins.
- Microfrontends must not talk to each other directly — the only contract is the exposed
  Public API.

## Debugging

- `bun run build` and inspect `dist/mf-manifest.json` to confirm exposes/shared.
- Run with `DEBUG=rsbuild` to diagnose config resolution.
- Module Federation docs: https://module-federation.io/llms.txt and
  https://rsbuild.rs/guide/advanced/module-federation
