import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import singleSpaReact from 'single-spa-react';
import { appConfig } from '@/config/app';
import '@/config/i18n';
import { type AuthToken, initGlobalStateSync } from '@/lib/auth';
import { AppProvider } from './provider';
import { CustomerRoutes } from './routes';
import { PrivateRoute } from './routes/PrivateRoute';

/**
 * Base path this microfrontend is mounted under in the FBC portal.
 * The shell's `activeWhen` / apps.json `routes` must match this prefix.
 */
export const APP_BASENAME = appConfig.basePath;

export interface AppProps {
  /** Standalone dev/preview → mount at root and bypass the auth gate. */
  standalone?: boolean;
  /** Auth payload passed by the shell as single-spa customProps. */
  payload?: AuthToken;
}

/**
 * Root component exposed via Module Federation as `./App`.
 *
 * The FBC shell (single-spa) does NOT provide a React Router — each MFE mounts its
 * own. So the BrowserRouter lives here, scoped to APP_BASENAME (or root in
 * standalone dev). The shell owns the chrome (header/sidebar); we render content.
 */
export function App({ standalone = false, payload }: AppProps) {
  useEffect(() => {
    // Bridge the shell's shared global store into our local session (auth + config).
    // `payload` is stable (single-spa passes it once at mount); the cleanup
    // unsubscribes before any re-run, so re-seeding is safe.
    const cleanup = initGlobalStateSync(payload);
    return cleanup;
  }, [payload]);

  return (
    <AppProvider standalone={standalone}>
      <BrowserRouter basename={standalone ? '/' : APP_BASENAME}>
        <PrivateRoute bypass={standalone}>
          <CustomerRoutes />
        </PrivateRoute>
      </BrowserRouter>
    </AppProvider>
  );
}

/**
 * single-spa lifecycles consumed by the FBC shell (bootstrap → mount → unmount).
 * The shell mounts this remote into its own DOM anchor.
 */
const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(err, errInfo, props) {
    console.error('[mf-customer] single-spa error', err, errInfo, props);
    return <div role="alert">Something went wrong in the customer module.</div>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// Default export kept for standalone/ergonomic imports.
export default App;
