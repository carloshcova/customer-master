---
name: i18n
description: How internationalization works in mf-customer — i18next (es/en/cn) synced to the portal shell's language, the en.ts source-of-truth shape, the t-factory pattern for non-component code, interpolation, and the rule to never translate data values. Use when adding or editing UI strings, locale files (src/config/i18n/locales), or any feature/route/ui component with visible text.
---

# Internationalization (i18next · es/en/cn)

All UI text uses **i18next + react-i18next**. Setup lives in `src/config/i18n/`; the
locales are `es` / `en` / `cn` (Simplified Chinese). The active language auto-syncs to the
FBC portal shell — this MFE never picks the language itself.

## Files & the shape contract

- `src/config/i18n/index.ts` — init (bundled resources, `react.useSuspense: false`, no async
  load) + a module-level subscription to the shell's `configuration.language` that calls
  `i18n.changeLanguage`. **Don't call `changeLanguage` manually** — the shell drives it.
- `src/config/i18n/locales/en.ts` — the **source-of-truth shape**:
  `export const en = { ... }` and `export type Translation = typeof en`.
- `src/config/i18n/locales/es.ts` / `cn.ts` — `export const es: Translation = { ... }`.
  They MUST have the exact same keys as `en` — a missing or extra key fails `bun run type-check`.

## The golden rules

1. **Add every key to all three locales at once.** `en` defines the shape; `es`/`cn` must
   match. `type-check` is the guardrail.
2. **Never translate DATA values — only display text.** Enum/model values used in logic or
   as an option `value` stay hardcoded; translate only the visible `label`/text. Example:
   ```tsx
   // ✅ value is data (drives filtering/logic); label is display
   { value: 'Activo', label: t('common.status.active') }
   if (customer.status === 'Activo') { ... }   // ✅ never translate this
   ```
   Translating a data value silently breaks filtering, sorting and comparisons.
3. **`es` mirrors the current Spanish literal, `en` translates it, `cn` is Simplified
   Chinese.** Chinese here is functional — **have a native speaker review it before prod**.

## Key structure (namespaces)

```
module.name · nav.*                    portal chrome (Card / MenuItem / Home)
common.{actions,status,summary,fields,filter,pagination}   REUSE across features
customerMaster.* · agents.* · securitySensor.*             feature-specific
```
Reuse `common.*` (shared table columns, actions, statuses, pagination) before adding a
feature-specific key — don't duplicate the same string per feature.

## Using translations

In a component:
```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<PageHeader title={t('nav.customerMaster')} />
```

**Non-component code (column / field-def factories) can't call the hook — pass `t` in:**
```tsx
import type { TFunction } from 'i18next';

const columns = (t: TFunction, onView: (id: string) => void): Column<T>[] => [
  { key: 'code', header: t('common.fields.code') },
  // ...
];

// inside the component:
const { t } = useTranslation();
const cols = useMemo(() => columns(t, onView), [t, onView]);
```

**Interpolation** with `{{name}}` placeholders:
```ts
// locale: customerMaster.foundCount = '{{count}} customers found'
t('customerMaster.foundCount', { count })
t('common.pagination.range', { from, to, total })
```

## Adding a feature or string — checklist

1. Add the key to `en.ts` (shape), then `es.ts` and `cn.ts` (same key). Reuse `common.*` if
   it already exists there.
2. Replace the literal with `t('...')` (or a `t`-factory for non-component code).
3. Leave data values alone — translate only what's rendered.
4. Verify: `bun run type-check` (catches out-of-sync locales) → `bun run check` → `bun run test`.
   The i18next `debug` flag (on in dev) logs missing keys in the console.

## Language sync with the portal

The shell publishes `configuration.language` as `'ES' | 'EN' | 'CN'`; `normalizeLanguage`
(in `index.ts`) maps it to `es | en | cn` (also `zh` → `cn`; region suffixes like `es-CL`
are stripped). The subscription runs at module load, so the language is correct for the
full-page `App`, the home `Card`, AND the sidebar `MenuItem` regardless of which is mounted.
See `.claude/skills/portal-integration` for the store contract.

## Tests

`tests/rstest.setup.ts` imports `@/config/i18n` once so `useTranslation()` resolves keys
(defaults to English with no shell). Assert on the rendered text, not the key.

Reference: react-i18next — https://react.i18next.com/ · i18next — https://www.i18next.com/
