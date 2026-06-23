import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import mfConfig from './module-federation.config';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.[jt]sx?$/,
      exclude: [/[\\/]node_modules[\\/]/],
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
      },
    }),
    pluginTypeCheck(),
    pluginModuleFederation(mfConfig),
  ],
  server: {
    // Dedicated port so the remote does not clash with the host shell.
    port: 3001,
  },
  dev: {
    // Serve federated assets from the dev server origin.
    assetPrefix: true,
  },
  output: {
    // `auto` lets chunks resolve relative to remoteEntry.js when consumed
    // cross-origin. Override with the deployed CDN/origin URL in production.
    assetPrefix: 'auto',
    // NOTE: Module Federation runtime does not support ESM output — do not set
    // `output.module: true` while MF is enabled.
  },
});
