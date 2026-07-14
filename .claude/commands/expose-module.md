---
description: Expose a new module from this remote via classic Module Federation
argument-hint: <ExposedName> <source-path> (e.g. Card src/app/Card.tsx)
---

Expose a new module through classic Module Federation, following
`.claude/skills/module-federation`, `.claude/skills/portal-integration`, and
`.claude/rules/module-federation.md`.

Input: `$ARGUMENTS` = the exposed name and the source path. If missing, ask.

Exposed roots are **single-spa modules**: an application (`./App`) or a parcel
(`./Card`, `./MenuItem`) that exports `bootstrap`/`mount`/`unmount` from
`singleSpaReact({...})` and bundles its own providers/theme.

Steps:
1. Open `module-federation.config.ts` and add an entry to `mfOptions.exposes`:
   `'./<ExposedName>': '<source-path>'` (path relative to project root, a real file).
2. Make the module self-contained: wrap its own `ThemeProvider` (use `shell-theme` for
   portal-embedded surfaces like Card/MenuItem), export the single-spa lifecycles, and do
   NOT rely on the host's React/Router context. Navigate with `navigateToUrl`, not a Router.
3. Confirm any new runtime libs it needs are in `shared` as appropriate. Keep
   `react`/`react-dom`/`single-spa`/`single-spa-react`/`redux-micro-frontend` as singletons;
   do NOT share `react-router-dom`.
4. Run `bun run build`, then confirm the classic container exposes it:
   `grep -oE "\\./<ExposedName>|mf_customer" dist/remoteEntry.js`.
   Classic MF emits `dist/remoteEntry.js` only — there is no `mf-manifest.json`.
5. Register it with the portal (see `.claude/skills/portal-integration`): the host team points
   a `componentImport` at `mf_customer/<ExposedName>` in the relevant apps.json.

Do not enable `output.module`. Do not switch to MF v2.
