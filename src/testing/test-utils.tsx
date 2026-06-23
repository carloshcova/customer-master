import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '@/config/theme';

/** Fresh query client per render with retries off for deterministic tests. */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

interface Options extends Omit<RenderOptions, 'wrapper'> {
  /** Initial router entries (the host normally owns the Router). */
  routerEntries?: string[];
}

/**
 * Custom render that wraps the UI with the same providers the app uses
 * (theme + query client) plus a MemoryRouter, since features rely on Router
 * context. Import this instead of RTL's `render`.
 */
export function renderWithProviders(
  ui: ReactElement,
  { routerEntries = ['/'], ...options }: Options = {},
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={routerEntries}>{children}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
