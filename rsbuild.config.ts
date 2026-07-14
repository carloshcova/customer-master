import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { mfOptions } from './module-federation.config';

// Load .env / .env.local / .env.[mode] into a parsed map for config-time reads.
const { parsed } = loadEnv();
const PORT = Number(parsed.APP_PORT) || 3020;
const PUBLIC_URL = parsed.APP_URL || `http://localhost:${PORT}/`;
const SOURCE_MAP = parsed.ENABLE_SOURCE_MAP_PLUGIN === 'true';
// Restrict CORS to the portal shell origin(s) when set (comma-separated); else open (dev).
const SHELL_ORIGIN = parsed.SHELL_ORIGIN;

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact(), pluginTypeCheck()],
  server: {
    // Dedicated port; 3001 is taken by the shell's `authentication` remote.
    port: PORT,
    // Required so the cross-origin shell can fetch our remoteEntry.js. Locked to
    // the shell origin(s) when SHELL_ORIGIN is set (recommended for prod).
    cors: SHELL_ORIGIN ? { origin: SHELL_ORIGIN.split(',') } : true,
  },
  dev: {
    // Serve federated assets from the dev server origin.
    assetPrefix: true,
  },
  output: {
    // publicPath for the federated chunks. `auto` breaks cross-origin MF, so we
    // pin it to our deployed origin (override APP_URL per environment).
    assetPrefix: PUBLIC_URL,
    sourceMap: { js: false, css: false },
  },
  tools: {
    // Escape hatch to add the CLASSIC MF plugin (matches the FBC shell) + source
    // maps, exactly like the sibling FBC MFEs. MF runtime has no ESM output, so we
    // never set `output.module: true`.
    rspack(config, { rspack }) {
      config.plugins ??= [];
      // Skip Module Federation under rstest (NODE_ENV==='test'): tests import
      // components directly, so the shared-module runtime (loadShareSync) would
      // fail without an async boundary. Federation is only needed for build/dev.
      if (process.env.NODE_ENV !== 'test') {
        config.plugins.push(
          new rspack.container.ModuleFederationPlugin(mfOptions),
        );
      }
      if (config.mode === 'production' && SOURCE_MAP) {
        config.plugins.push(
          new rspack.SourceMapDevToolPlugin({
            noSources: false,
            filename: '../dist_sourcemaps/[file].map',
          }),
        );
      } else if (config.mode !== 'production') {
        config.devtool = 'cheap-module-source-map';
      }
      return config;
    },
  },
});
