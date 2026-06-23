import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { Component, type ErrorInfo, type ReactNode, useState } from 'react';
import { theme } from '@/config/theme';
import { createQueryClient } from '@/lib/react-query';

/**
 * Minimal error boundary so a failing remote/feature does not crash the host.
 */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Replace with your telemetry/logging pipeline.
    console.error('[mf-customer] render error', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert">Something went wrong in the customer module.</div>
      );
    }
    return this.props.children;
  }
}

/**
 * Composes all app-wide providers. Intentionally does NOT include a Router:
 * the host shell owns routing (see bootstrap.tsx for standalone dev).
 */
export function AppProvider({ children }: { children: ReactNode }) {
  // Lazily created once per mount.
  const [queryClient] = useState(createQueryClient);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
