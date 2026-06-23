---
description: Scaffold a new feature under src/features following the project architecture
argument-hint: <feature-name> (kebab-case, e.g. customer-profile)
---

Scaffold a new feature named `$ARGUMENTS` under `src/features/`, following
`.claude/skills/project-architecture` and the boundaries in `.claude/rules/architecture.md`.

Steps:
1. Validate `$ARGUMENTS` is kebab-case and describes a domain capability (a noun/action).
   If empty, ask for the name.
2. Create `src/features/$ARGUMENTS/` with the segments the feature needs — typically
   `api/`, `components/`, `types/` (add `hooks/`, `stores/`, `utils/` only if used).
3. Add a typed TanStack Query hook in `api/` using `apiClient` from `@/lib/api-client`
   (stable query key), mirroring `features/customer-list/api/get-customers.ts`.
4. Add a presentational component in `components/` that consumes the hook and handles
   `isPending`/`isError`, using MUI + `sx`.
5. Create `index.ts` exporting ONLY the public surface (component, hook, key, types).
6. Wire a `<Route>` in `src/app/routes/` importing via the feature's Public API.
7. Run `bun run type-check`, `bun run test`, and `bun run depcruise`; fix any violations.

Do not import across features. Import the feature only through its `index.ts`.
