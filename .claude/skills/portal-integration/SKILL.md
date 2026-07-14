---
name: portal-integration
description: How mf-customer integrates with the FBC portal shell — single-spa + classic Module Federation + redux-micro-frontend. Covers the three exposes (App/Card/MenuItem), the shell registration entries (apps.json), base path/routing, and how session (auth) and language flow from the shell. Use when registering the MFE in the portal, editing apps.json, or working on the exposed App/Card/MenuItem surfaces or the src/lib/auth session bridge.
---

# Portal integration (FBC shell)

`mf-customer` is a **single-spa** microfrontend consumed by the Falabella Business Center
(FBC) portal via **classic Module Federation** (`rspack.container.ModuleFederationPlugin`,
not MF v2). The shell owns the chrome (header/sidebar) and routing via single-spa; this MFE
mounts its own `<BrowserRouter>` and reads session/language from the shell's shared store.

## Exposed modules (`module-federation.config.ts` → `mfOptions.exposes`)

| Expose | Source | Consumed by | Purpose |
|--------|--------|-------------|---------|
| `./App` | `src/app/App.tsx` | app-shell | Full-page single-spa app (`bootstrap`/`mount`/`unmount`) mounted on the route |
| `./MenuItem` | `src/app/MenuItem.tsx` | layout (sidebar) | Sidebar entry (single-spa parcel, Poppins theme) |
| `./Card` | `src/app/Card.tsx` | home (grid) | Home access card (single-spa parcel, Poppins theme) |

- Remote name: **`mf_customer`** · remoteEntry: `http://localhost:3020/remoteEntry.js` (dev).

## Base path & routing

- Base path **`/customer-master`** (`src/config/app.ts` → `appConfig.basePath`).
- `App` mounts `<BrowserRouter basename={appConfig.basePath}>` (basename `/` in standalone dev).
- Sub-routes: `/customers`, `/agents`, `/security-sensor`.
- Card/MenuItem navigate with `navigateToUrl(appConfig.basePath)` (single-spa), never a Router.

## Session & language (redux-micro-frontend global store)

- `src/lib/auth/` bridges the shell's **`auth`** partner state (client `portal`) into a local
  session store: `useSession()` / `getToken()` / `getUserId()`. Seeded from the single-spa
  `payload` and `GetGlobalState`, then kept live via `SubscribeToPartnerState`.
- `src/lib/api-client.ts` injects `Authorization: Bearer <token>` + `X-userId` on every request.
- `src/app/routes/PrivateRoute.tsx` gates content on `isLogged` (bypass in standalone dev).
- `src/config/i18n/` syncs the language to the shell's **`configuration.language`** (es/en/cn)
  at module level, so it works for App/Card/MenuItem alike (subscriber id `mf_customer:i18n`).
- Card/MenuItem use `src/config/shell-theme.ts` (the DS theme + **Poppins**) to blend into the
  portal chrome; the full-page `./App` keeps **Lato**.

## Registration entries (coordinate with the portal team)

**app-shell** `apps.json` (also in this repo's `apps.json`):

```json
{
  "appName": "mf_customer",
  "componentImport": "mf_customer/App",
  "routes": "['/customer-master']",
  "show": "showWhenPrefix",
  "appRemoteName": "mf_customer",
  "remote": "http://localhost:3020/remoteEntry.js"
}
```

**layout** (sidebar) — `componentImport` points to the MenuItem expose:

```json
{
  "appName": "mf_customer",
  "componentImport": "mf_customer/MenuItem",
  "componentImportType": "product",
  "appRemoteName": "mf_customer",
  "remote": "http://localhost:3020/remoteEntry.js",
  "rolesAccepted": ["*"]
}
```

**home** (grid) — `componentImport` points to the Card expose:

```json
{
  "appName": "mf_customer",
  "componentImport": "mf_customer/Card",
  "appRemoteName": "mf_customer",
  "remote": "http://localhost:3020/remoteEntry.js",
  "rolesAccepted": ["*"]
}
```

> `rolesAccepted` gates visibility of the sidebar/home surfaces by the user's JWT roles (the
> shell filters). Replace `["*"]` with the real `FBC_*` roles once defined. Use `showWhenPrefix`
> so the app stays mounted across all `/customer-master/*` sub-routes.

## Do / Don't

- DO keep `react`, `react-dom`, `single-spa`, `single-spa-react`, `redux-micro-frontend` as
  shared singletons (see `.claude/skills/module-federation`). React stays **18.3**.
- DO read cross-MFE state only through the shell's global store (`src/lib/auth`).
- DON'T import a sibling MFE's code directly. DON'T mount a Router in Card/MenuItem.
- DON'T swap to MF v2 or share `react-router-dom` — it breaks interop with the classic shell.
- TODO: replace the local types in `src/lib/auth/types.ts` with `@fbc/common-interfaces` once
  the private GCP registry (gcloud) is available.
