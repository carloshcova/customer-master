import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

/**
 * Module Federation v2 configuration for the `mf-customer` microfrontend.
 *
 * Role: REMOTE / provider. It exposes UI to a host shell (which owns routing
 * via React Router). To turn this app into a HOST that also consumes other
 * remotes, add a `remotes` map here, e.g.:
 *
 *   remotes: {
 *     mf_orders: 'mf_orders@https://orders.example.com/remoteEntry.js',
 *   }
 *
 * Shared deps are `singleton` so the host and this remote use ONE instance and
 * share the same React / Router context. `react-router-dom` is shared because
 * the host already provides a Router — this remote must not mount its own.
 */
export default createModuleFederationConfig({
  name: 'mf_customer',
  // Classic entry. The v2 `mf-manifest.json` is emitted automatically alongside it.
  filename: 'remoteEntry.js',
  exposes: {
    './CustomerApp': './src/app/App.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
    'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
    '@tanstack/react-query': { singleton: true },
  },
  // Cross-remote TypeScript types. Disabled for the base; enable when consuming
  // remotes (see .claude/skills/module-federation). Generating types for our
  // own exposes can be turned on with `dts: { generateTypes: true }`.
  dts: false,
});
