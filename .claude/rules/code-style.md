# Code style

- Biome owns formatting and linting: single quotes, 2-space indent, organized imports.
  Run `bun run check` before committing; never hand-fight the formatter.
- TypeScript is `strict`. With `verbatimModuleSyntax`, use `import type { … }` for
  type-only imports.
- Prefer named exports; the MF-exposed root (`src/app/App.tsx`) also has a default export
  for ergonomic remote consumption.
- Use the `@/` alias for cross-layer imports; relative paths only within a feature.
- Keep functions small and typed; avoid `any`. Co-locate types with their usage (feature
  `types/`) and lift only truly shared types to `src/types/`.
