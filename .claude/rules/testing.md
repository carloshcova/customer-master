---
paths:
  - "tests/**"
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
---

# Testing rules

- **Test behavior and composition, not presentation.** Do **not** unit-test pure
  presentational atoms that are thin MUI wrappers with no own logic (e.g. `Button`) — MUI
  already covers render/click/disabled and Testing Library can't assert CSS. Test atoms only
  when they carry logic (masking, validation, controlled state). Focus tests on
  molecules/organisms/features.
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
