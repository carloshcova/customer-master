import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';

/**
 * Standalone bootstrap used when this microfrontend runs on its own (dev /
 * preview). When consumed by the host shell, the host renders the exposed
 * `./CustomerApp` instead and provides the Router — so the `BrowserRouter`
 * below lives here, NOT inside `App`.
 */
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <StrictMode>
      <BrowserRouter>
        {/* standalone → App applies the global CssBaseline for the dev page. */}
        <App standalone />
      </BrowserRouter>
    </StrictMode>,
  );
}
