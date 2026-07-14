import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { TextField, type TextFieldProps } from '@/components/ui/TextField';

export interface RhfTextFieldProps<T extends FieldValues>
  extends Omit<
    TextFieldProps,
    'name' | 'error' | 'helperText' | 'value' | 'defaultValue'
  > {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

/**
 * RhfTextField — binds a DS TextField to React Hook Form via `Controller`.
 * Validation errors (from the Zod resolver) surface as `error` + `helperText`.
 * Use this for all form text inputs (see `.claude/skills/forms`).
 */
export function RhfTextField<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: RhfTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          {...field}
          autoComplete="off"
          {...rest}
          inputRef={ref}
          label={label}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          fullWidth
        />
      )}
    />
  );
}
