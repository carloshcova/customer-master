import { CacheProvider } from '@emotion/react';
import { CssBaseline, ScopedCssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { Component, type ErrorInfo, type ReactNode, useState } from 'react';
import '@/config/fonts';
import { theme } from '@/config/theme';
import { createQueryClient } from '@/lib/react-query';
import { emotionCache } from './emotion-cache';

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
 *
 * Baseline: when embedded in the host we use `ScopedCssBaseline` so the CSS reset
 * applies only to our subtree (never leaks to the shell). `standalone` (dev/
 * preview) additionally applies the global `CssBaseline`.
 */
export function AppProvider({
  children,
  standalone = false,
}: {
  children: ReactNode;
  standalone?: boolean;
}) {
  // Lazily created once per mount.
  const [queryClient] = useState(createQueryClient);

  return (
    <ErrorBoundary>
      <CacheProvider value={emotionCache}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {standalone && <CssBaseline />}
            <ScopedCssBaseline>{children}</ScopedCssBaseline>
          </ThemeProvider>
        </QueryClientProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}
