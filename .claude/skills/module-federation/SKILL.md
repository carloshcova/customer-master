---
name: module-federation
description: How classic Module Federation is wired in this mf-customer remote for the FBC single-spa portal — exposing modules, shared singletons, the tools.rspack setup, types, and debugging. Use when editing module-federation.config.ts / rsbuild.config.ts, exposing modules, or consuming remotes. For the portal registration/session/language contract see the `portal-integration` skill.
---

# Module Federation in `mf-customer`

This app is a **single-spa remote/provider** for the FBC portal, built with the **classic**
`rspack.container.ModuleFederationPlugin` (added via `rsbuild.config.ts` → `tools.rspack`),
**not** the MF v2 rsbuild plugin. The FBC shell consumes remotes through the classic
container global (`window.mf_customer.get/init`); MF v2 ↔ v1 interop is unreliable for
shared singletons, so we match the shell exactly. MF name: `mf_customer`. Exposes `./App`
(single-spa lifecycles), `./MenuItem`, `./Card`.

## Key files

- `module-federation.config.ts` — exports a plain `mfOptions` object (`name`, `filename:
  'remoteEntry.js'`, `exposes`, `shared`). `requiredVersion` values are read from
  `package.json` via `createRequire`.
- `rsbuild.config.ts` — `tools.rspack` pushes `new rspack.container.ModuleFederationPlugin(mfOptions)`.
  Skipped when `NODE_ENV==='test'` (rstest imports components directly, so the shared-module
  `loadShareSync` would fail without an async boundary). Sets `server.port` (3020),
  `server.cors`, `output.assetPrefix` (= `APP_URL`, never `auto`).
- Build output: `dist/remoteEntry.js` — a classic container (`var mf_customer` with `get`/`init`).
- `src/index.tsx` → `import('./bootstrap')` is the async boundary MF needs before shared
  modules load.

## Exposing a module

Add to `mfOptions.exposes` in `module-federation.config.ts`, pointing at a real file:

```ts
exposes: {
  './App': './src/app/App.tsx',
  './MenuItem': './src/app/MenuItem.tsx',
  './Card': './src/app/Card.tsx',
}
```

Exposed roots are **single-spa modules**: they export `bootstrap`/`mount`/`unmount` from
`singleSpaReact({...})` and bundle their own providers/theme. `./App` is a single-spa
application; `./Card` and `./MenuItem` are parcels mounted by the shell's home/layout. See
`/expose-module` and the `portal-integration` skill for how the shell registers each.

## Shared dependencies

Keep these as singletons so the shell and this remote share ONE instance/context:

```ts
shared: {
  react: { singleton: true, requiredVersion: deps.react, strictVersion: true },
  'react-dom': { singleton: true, requiredVersion: deps['react-dom'], strictVersion: true },
  'single-spa': { singleton: true, requiredVersion: deps['single-spa'], strictVersion: true },
  'single-spa-react': { singleton: true, requiredVersion: deps['single-spa-react'] },
  'redux-micro-frontend': { singleton: true, requiredVersion: deps['redux-micro-frontend'], strictVersion: true },
  '@emotion/react': { requiredVersion: deps['@emotion/react'] },
  '@emotion/styled': { requiredVersion: deps['@emotion/styled'] },
  '@mui/material': { requiredVersion: deps['@mui/material'] },
  '@mui/icons-material': { requiredVersion: deps['@mui/icons-material'] },
}
```

- **React must stay 18.3** to share a singleton with the shell (a `^19` requiredVersion breaks it).
- `react-router-dom` is **NOT shared** — each MFE mounts its own `<BrowserRouter>` (the shell
  has no Router). Sharing it as a singleton would break integration.

## Routing (each MFE owns its Router)

- `./App` (`src/app/App.tsx`) mounts its **own** `<BrowserRouter basename={appConfig.basePath}>`
  (`/customer-master`; `/` in standalone dev). Routes in `src/app/routes` are relative to it.
- The standalone render in `src/bootstrap.tsx` does NOT add a Router (App provides it).
- Navigate across MFEs with single-spa's `navigateToUrl`, never assumptions about the origin.

## Becoming a host (consuming remotes)

Add a `remotes` map (also with the classic plugin) and load resiliently:

```ts
// module-federation.config.ts → mfOptions
remotes: { authentication: 'authentication@http://localhost:3001/remoteEntry.js' }
```

For React remotes prefer `React.lazy` + `Suspense` + an error boundary; for single-spa parcels
use `single-spa-react/parcel`. The shell already provides auth — consume it only if needed.

## Constraints & gotchas

- Never set `output.module: true` — the MF runtime has no ESM output support.
- Keep `server.cors` on so the cross-origin shell can fetch `remoteEntry.js`; lock it to
  trusted origins + a CSP in production.
- Cross-MFE state flows through the shell's **redux-micro-frontend** global store (see the
  `portal-integration` skill), never by importing another MFE's code.
- Changing name/exposes/shared/basename is a public API change — coordinate the `apps.json`
  registration with the portal team.

## Debugging

- `bun run build`, then confirm the container: `grep -oE "mf_customer|\\.get=|\\.init=" dist/remoteEntry.js`.
- If a remote fails to mount in the shell: check React is a single 18.3 instance (no duplicate),
  the `remoteEntry.js` is reachable + CORS-enabled, and `assetPrefix` matches the served origin.
- Module Federation docs: https://module-federation.io/llms.txt
