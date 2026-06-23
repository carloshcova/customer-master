---
name: data-fetching
description: Data-fetching patterns for mf-customer — the shared axios client, TanStack Query usage (query keys, queries, mutations, invalidation), env config, and sharing the QueryClient with the host. Use when adding API calls, hooks under features/*/api, or touching lib/api-client / lib/react-query.
---

# Data fetching (axios + TanStack Query)

## The axios client

All HTTP goes through `src/lib/api-client.ts` (`apiClient`). It sets `baseURL` from
`src/config/env.ts` and has a response interceptor for error normalization (extend for
auth tokens/refresh/telemetry). Never import `axios` directly in features/components.

```ts
import { apiClient } from '@/lib/api-client';
const { data } = await apiClient.get<Customer[]>('/customers');
```

## Query hooks (reads)

Co-locate a typed hook with its feature under `features/<name>/api/`:

```ts
export const customersQueryKey = ['customers'] as const;

export function useCustomers() {
  return useQuery({
    queryKey: customersQueryKey,
    queryFn: async () => (await apiClient.get<Customer[]>('/customers')).data,
  });
}
```

Use stable, typed keys: list = `['customers']`, detail = `['customer', id]`. In components,
handle `isPending` / `isError` (see `CustomerList.tsx`). Never fetch with `useEffect`.

## Mutations (writes)

```ts
const qc = useQueryClient();
useMutation({
  mutationFn: (input: NewCustomer) => apiClient.post('/customers', input),
  onSuccess: () => qc.invalidateQueries({ queryKey: customersQueryKey }),
});
```

## QueryClient

`src/lib/react-query.ts` exports `createQueryClient()` (retry 1, `staleTime` 30s,
`refetchOnWindowFocus` off). `src/app/provider.tsx` creates one per mount so the remote is
self-contained. If you later want to share the host's client, accept a `queryClient` prop
on the exposed `App` and fall back to a local one.

## Config / secrets

Read config via `src/config/env.ts`. Only `PUBLIC_*` vars are exposed to the client — never
reference secrets; they would be inlined into the shipped bundle.

## Testing

Mock at the axios boundary: `rs.spyOn(apiClient, 'get').mockResolvedValue({ data })`. Render
with `renderWithProviders` (provides a retry-disabled test QueryClient).
