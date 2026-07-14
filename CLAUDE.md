@AGENTS.md

## Claude Code — specifics

The shared, tool-agnostic guidance lives in `AGENTS.md` (imported above). The notes below
apply to Claude Code only.

- **Project skills** live in `.claude/skills/` (`portal-integration`, `i18n`,
  `module-federation`, `mui-theming`, `design-system`, `data-fetching`, `forms`,
  `project-architecture`). They load on demand — invoke or rely on the matching one before
  non-trivial work in that area.
- **Path-scoped rules** live in `.claude/rules/` and load automatically when you touch
  matching files (e.g. MF config, tests, `**/api/**`).
- **Vendored skills** in `.agents/skills/` (rsbuild / rstest / vercel-react best practices)
  are managed by `skills-lock.json` — read them, but **never edit** them.
- Use **plan mode** for changes to `rsbuild.config.ts` or `module-federation.config.ts`
  (the federation contract affects the host).
- After editing code, run `bun run check` (Biome) and `bun run type-check`; for
  architecture changes also run `bun run depcruise`.
