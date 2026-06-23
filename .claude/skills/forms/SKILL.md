---
name: forms
description: Form and validation pattern for mf-customer — React Hook Form + Zod via @hookform/resolvers, MUI fields through <Controller>, and validating API responses with the same Zod schemas. Use when building forms, adding validation, or defining data contracts.
---

# Forms & validation (React Hook Form + Zod)

Stack: **react-hook-form** (uncontrolled, minimal re-renders) + **zod** (TS-first schemas) +
**@hookform/resolvers/zod** (the bridge). Zod is **not** an MF shared singleton — keep it
local to this remote.

## 1. Define the schema once; derive the type

A Zod schema is the single source of truth for both validation and the TS type. Co-locate
it with its feature (`features/<name>/` — e.g. a `model/` or `api/` segment).

```ts
import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'), // zod v4 top-level format
});

// Derive the type — never hand-write a parallel interface.
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
```

## 2. Wire the form with the resolver

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<CustomerFormValues>({
  resolver: zodResolver(customerFormSchema),
  defaultValues: { name: '', email: '' },
});
```

## 3. Bind MUI inputs with `<Controller>`

MUI fields are controlled, so connect them through RHF's `<Controller>`. Surface validation
errors with `error` + `helperText`.

```tsx
import { Controller } from 'react-hook-form';
import { Button, Stack, TextField } from '@mui/material';

<form onSubmit={handleSubmit(onSubmit)} noValidate>
  <Stack spacing={2}>
    <Controller
      name="email"
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label="Email"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
    <Button type="submit" variant="contained" disabled={isSubmitting}>
      Save
    </Button>
  </Stack>
</form>
```

## 4. Submit through TanStack Query

`onSubmit` receives already-validated, fully-typed values. Mutate via the feature's
`useMutation` (axios client) and invalidate the affected queries on success — see
`.claude/skills/data-fetching`.

```ts
const onSubmit = (values: CustomerFormValues) => createCustomer.mutate(values);
```

## 5. Validate API responses with the same tool

Zod is not just for forms — validate what the backend returns so a bad payload fails loudly
instead of corrupting state. Parse inside the `queryFn`:

```ts
const customerArraySchema = z.array(customerSchema);

async function fetchCustomers() {
  const { data } = await apiClient.get('/customers');
  return customerArraySchema.parse(data); // throws → React Query surfaces the error
}
```

Use `.safeParse()` when you want to branch on failure instead of throwing.

## Conventions

- One schema per concern; derive types with `z.infer`. Never duplicate a type by hand.
- Keep schemas inside the owning feature; lift only truly shared schemas to `src/types/`
  or a shared `lib/` module.
- Prefer `<Controller>` for MUI; use `register` only for plain HTML inputs.
- Always pass `defaultValues` (avoids uncontrolled→controlled warnings) and `noValidate` on
  the `<form>` (Zod owns validation, not the browser).
