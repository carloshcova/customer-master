---
paths:
  - "src/**/api/**"
  - "src/lib/api-client.ts"
  - "src/lib/react-query.ts"
---

# Data fetching rules

- Every HTTP request goes through the axios instance in `src/lib/api-client.ts`. Never call
  `axios` (or `fetch`) directly in components/features.
- Use TanStack Query for all server-state. `useQuery` for reads, `useMutation` for writes;
  invalidate affected queries after a mutation.
- Define **stable, typed query keys** (e.g. `['customers']`, `['customer', id]`). Co-locate
  the query/mutation hook with its feature under `features/<name>/api/`.
- Never fetch with a manual `useEffect` + `useState`.
- Read configuration from `src/config/env.ts`. Only `PUBLIC_*` vars are client-exposed —
  never reference secrets (they would be inlined into the bundle).
