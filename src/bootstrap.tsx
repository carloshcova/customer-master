import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

/**
 * Standalone bootstrap for local dev / preview (outside the portal). The App
 * provides its own Router (basename '/' in standalone), so we do NOT wrap it in
 * a Router here. When the FBC shell consumes us, it calls the single-spa
 * lifecycles exported from `./app/App` instead of this file.
 */
const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App standalone />
    </StrictMode>,
  );
}
