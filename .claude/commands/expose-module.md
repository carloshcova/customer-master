---
description: Expose a new module from this remote via Module Federation
argument-hint: <ExposedName> <source-path> (e.g. CustomerWidget src/features/<feature>/index.ts)
---

Expose a new module through Module Federation, following
`.claude/skills/module-federation` and `.claude/rules/module-federation.md`.

Input: `$ARGUMENTS` = the exposed name and the source path. If missing, ask.

Steps:
1. Open `module-federation.config.ts` and add an entry to `exposes`:
   `'./<ExposedName>': '<source-path>'` (path relative to project root, real file).
2. Ensure the exposed module is self-contained and stable (a clean component or a feature's
   Public API `index.ts`), not a deep internal file.
3. Confirm any new runtime libs it needs are present in `shared` as appropriate.
4. Run `bun run build` and verify the new entry appears in `dist/mf-manifest.json`
   (and a `__federation_expose_<ExposedName>` chunk is emitted).
5. Note for the host team how to import it: `mf_customer/<ExposedName>`.

Do not enable `output.module`. Keep `react`/`react-dom`/`react-router-dom` as singletons.
