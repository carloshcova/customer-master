---
paths:
  - "module-federation.config.ts"
  - "rsbuild.config.ts"
---

# Module Federation rules

This app is a **single-spa microfrontend** for the Falabella Business Center (FBC)
portal, wired via **classic Module Federation**. MF name: `mf_customer`; it exposes
`./App` (single-spa `bootstrap`/`mount`/`unmount`). The shell does NOT own a Router.

- Build with the **classic** `rspack.container.ModuleFederationPlugin` (added in
  `rsbuild.config.ts` → `tools.rspack`), NOT the MF v2 `@module-federation/rsbuild-plugin`.
  The shell consumes remotes via the classic container global (`window.mf_customer.get/init`);
  MF v2 ↔ v1 interop is unreliable for shared singletons. The plugin is skipped under
  rstest (`NODE_ENV==='test'`) so component tests don't hit `loadShareSync`.
- Keep `react`, `react-dom`, `single-spa`, `single-spa-react`, `redux-micro-frontend` as
  `{ singleton: true, requiredVersion: deps[...] }` in `shared` (React/single-spa/store are
  `strictVersion`). React must stay **18.3** to share a singleton with the shell.
- `react-router-dom` is **NOT shared** — each MFE mounts its own `<BrowserRouter>` (the shell
  has no Router). This MFE's Router + `basename` live in `src/app/App.tsx`.
- **Never** set `output.module: true` — the MF runtime does not support ESM output.
- Add exposed modules under `mfOptions.exposes` in `module-federation.config.ts`; point to a
  real source file. Re-export through a clean component, not deep internals.
- Cross-MFE state flows through the shell's **redux-micro-frontend global store** (see
  `src/lib/auth`): read the `auth` and `configuration` partner states; never import a sibling
  MFE's code directly.
- Keep `server.cors` on so the cross-origin shell can fetch `remoteEntry.js`. `output.assetPrefix`
  must point to the deployed origin (`APP_URL`), never `auto`.
- Changing the federation contract (name/exposes/shared/basename) affects the shell — treat
  these files as a public API and coordinate the `apps.json` entry.
