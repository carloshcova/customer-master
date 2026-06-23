---
paths:
  - "tests/**"
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
---

# Testing rules

- Import test APIs from `@rstest/core` (`test`, `describe`, `expect`, `rs`, `beforeEach`…).
  Never commit `.only`.
- Render components with `renderWithProviders` from `src/testing/test-utils.tsx` so theme,
  query client, and Router context are present.
- Query by accessible role/text (Testing Library); assert with jest-dom matchers
  (`toBeInTheDocument`, …). Use `findBy*` for async UI.
- Mock network at the axios boundary: `rs.spyOn(apiClient, 'get').mockResolvedValue(...)`.
  Do not hit real endpoints.
- For async assertions prefer `await expect(fn()).rejects.toThrow(...)` /
  `.resolves.toEqual(...)` over try/catch.
