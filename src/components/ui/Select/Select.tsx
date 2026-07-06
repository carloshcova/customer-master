import { TextField, type TextFieldProps } from '../TextField';

export type SelectProps = Omit<TextFieldProps, 'select'>;

/**
 * Select (atom) — a dropdown field. Reuses `TextField` in `select` mode, so it
 * shares the same filled/outlined styles and enabled/hover/focus/error/disabled
 * states. Pass options as `MenuItem` children; use `multiple` for multi-select.
 *
 * DS behavior: the option list adapts to the longest entry, capped at 600px, and
 * opens above the field when there isn't room below (handled by MUI).
 */
export function Select({ slotProps, ...props }: SelectProps) {
  return (
    <TextField
      select
      slotProps={{
        ...slotProps,
        select: {
          MenuProps: { slotProps: { paper: { sx: { maxWidth: 600 } } } },
          ...((slotProps?.select as Record<string, unknown>) ?? {}),
        },
      }}
      {...props}
    />
  );
}
