import { AppProvider } from './provider';
import { CustomerRoutes } from './routes';

export interface AppProps {
  /** Standalone dev/preview → apply the global CssBaseline. Host leaves this off
   * so the reset stays scoped to our subtree. */
  standalone?: boolean;
}

/**
 * Root component exposed via Module Federation as `./CustomerApp`.
 *
 * It bundles its own providers (theme, query client, error boundary) so it is
 * self-contained when mounted by the host, but it does NOT include a Router —
 * the host shell provides the React Router context.
 */
export function App({ standalone = false }: AppProps) {
  return (
    <AppProvider standalone={standalone}>
      <CustomerRoutes />
    </AppProvider>
  );
}

// Default export for ergonomic `import CustomerApp from 'mf_customer/CustomerApp'`.
export default App;
