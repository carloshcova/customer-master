---
paths:
  - "module-federation.config.ts"
  - "rsbuild.config.ts"
---

# Module Federation rules

This app is a **remote** (`mf_customer`) exposing `./CustomerApp`. The host shell owns the
Router.

- Keep `react`, `react-dom`, `react-router-dom` (and `@tanstack/react-query`) as
  `{ singleton: true, requiredVersion: '...' }` in `shared`. Singletons prevent duplicate
  React/Router contexts across host and remote.
- **Never** set `output.module: true` — the MF runtime does not support ESM output.
- Add exposed modules under `exposes` in `module-federation.config.ts`; point to a real
  source file. Re-export through a clean component, not deep internals.
- To consume other remotes (become a host), add a `remotes` map and load with
  `React.lazy` + `Suspense` (and an error boundary) for resilient loading.
- Do not let microfrontends communicate directly (implicit coupling). The only contract is
  the exposed Public API. For shared cross-app state prefer the URL/host-provided context.
- For production, restrict dev-server CORS to trusted origins (`server.cors`) and apply a
  CSP that only allows remote origins you trust.
- Changing the federation contract affects the host — treat these files as a public API.
