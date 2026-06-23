# Architecture boundaries

This is a Module Federation **remote**. Code is organized feature-first with a strict,
one-directional dependency flow: **`shared → features → app`**. Enforced by
`.dependency-cruiser.cjs` (`bun run depcruise`).

- A feature (`src/features/<name>/`) must **not** import from another feature.
- Import a feature **only through its `index.ts`** (Public API). Never deep-import a
  feature's internal files from outside it.
- Shared layers (`components`, `hooks`, `lib`, `stores`, `types`, `utils`, `config`) must
  not import from `features` or `app`.
- New cross-cutting code goes in the right shared layer; feature-specific code stays inside
  the feature. Keep nesting to 2–3 levels; name folders by business domain.
- Use the `@/` alias for `src/` imports; relative imports only inside the same feature.
