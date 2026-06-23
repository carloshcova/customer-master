/**
 * dependency-cruiser — enforces the unidirectional architecture
 * (shared → features → app) and forbids cross-feature imports.
 * Run with `bun run depcruise`.
 */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-feature',
      comment:
        'A feature must not import from another feature; go through its public API only.',
      severity: 'error',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/([^/]+)/',
        pathNot: ['^src/features/$1/'],
      },
    },
    {
      name: 'shared-no-features',
      comment:
        'Shared layers must not depend on features (dependencies flow shared → features → app).',
      severity: 'error',
      from: { path: '^src/(components|hooks|lib|stores|types|utils|config)/' },
      to: { path: '^src/features/' },
    },
    {
      name: 'shared-no-app',
      comment: 'Shared layers must not depend on the app layer.',
      severity: 'error',
      from: { path: '^src/(components|hooks|lib|stores|types|utils|config)/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'features-no-app',
      comment: 'Features must not depend on the app layer.',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'no-orphans',
      comment: 'Orphaned modules are usually dead code.',
      severity: 'warn',
      from: { orphan: true, pathNot: ['\\.d\\.ts$', '(^|/)\\.gitkeep$'] },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
};
