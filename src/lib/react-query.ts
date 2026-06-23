import { QueryClient } from '@tanstack/react-query';

/**
 * Factory for the TanStack Query client with sensible defaults. A factory
 * (not a shared singleton) keeps each mount isolated — important for tests and
 * for microfrontend independence.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}
