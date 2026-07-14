import { createRequire } from 'node:module';

/**
 * CLASSIC Module Federation options for the FBC portal.
 *
 * The FBC shell (single-spa) consumes remotes with the classic container
 * interface (`window[name].get/init`) via `rspack.container.ModuleFederationPlugin`.
 * To match it 1:1 and avoid MF v2 <-> v1 interop risk, this remote is built with
 * the SAME classic plugin (see `rsbuild.config.ts` -> tools.rspack). Therefore we
 * export a plain options object here instead of `createModuleFederationConfig` (v2).
 *
 * Shared singletons mirror the working reference MFE so the shell and this remote
 * share ONE instance of React / single-spa / the global store. `react-router-dom`
 * is intentionally NOT shared: each MFE mounts its own Router (the shell has none).
 */
const require = createRequire(import.meta.url);
const deps: Record<string, string> = require('./package.json').dependencies;

export const mfOptions = {
  name: 'mf_customer',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/app/App.tsx',
    './MenuItem': './src/app/MenuItem.tsx',
    './Card': './src/app/Card.tsx',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: deps.react,
      strictVersion: true,
    },
    // Cover the automatic-JSX-runtime subpath so react/jsx-runtime shares ONE instance.
    'react/': { singleton: true, requiredVersion: deps.react },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
      strictVersion: true,
    },
    // Cover react-dom/client (used by single-spa-react createRoot) to avoid a 2nd instance.
    'react-dom/': { singleton: true, requiredVersion: deps['react-dom'] },
    'single-spa': {
      singleton: true,
      requiredVersion: deps['single-spa'],
      strictVersion: true,
    },
    'single-spa-react': {
      singleton: true,
      requiredVersion: deps['single-spa-react'],
    },
    'redux-micro-frontend': {
      singleton: true,
      requiredVersion: deps['redux-micro-frontend'],
      strictVersion: true,
    },
    '@emotion/react': { requiredVersion: deps['@emotion/react'] },
    '@emotion/styled': { requiredVersion: deps['@emotion/styled'] },
    '@mui/material': { requiredVersion: deps['@mui/material'] },
    '@mui/icons-material': { requiredVersion: deps['@mui/icons-material'] },
  },
};

export default mfOptions;
