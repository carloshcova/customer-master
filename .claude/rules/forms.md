# Forms & validation rules

Use **React Hook Form + Zod** (`@hookform/resolvers/zod`) for all forms and validation. Do
not introduce Formik/Yup. Zod stays local — it is not an MF shared singleton.

- Define a **Zod schema** as the single source of truth and derive the type with
  `z.infer<typeof schema>`. Never hand-write a parallel interface for form values.
- Connect the form with `useForm({ resolver: zodResolver(schema), defaultValues })`. Always
  provide `defaultValues` and put `noValidate` on the `<form>`.
- Bind **MUI inputs via `<Controller>`**; show errors with `error` + `helperText`. Use
  `register` only for plain HTML inputs.
- Submit through a TanStack Query `useMutation` (via `@/lib/api-client`) and invalidate the
  affected queries on success.
- **Validate API responses** with Zod too: `schema.parse(data)` inside the `queryFn` (or
  `.safeParse()` to branch). Co-locate schemas with their feature.

See `.claude/skills/forms` for the full pattern.
