import type { Control, FieldValues, Path } from 'react-hook-form';
import { RhfTextField } from './RhfTextField';

export interface FormFieldDef<T extends FieldValues> {
  name: Path<T>;
  label: string;
  /** HTML input type (e.g. 'number', 'email'). */
  type?: string;
}

export interface FormFieldsProps<T extends FieldValues> {
  fields: FormFieldDef<T>[];
  control: Control<T>;
}

/**
 * FormFields — renders a list of `RhfTextField`s from a config array. Keeps large
 * forms declarative (field name/label/type). Field names support dot-paths for
 * nested schema values (e.g. `customer_address.address`).
 */
export function FormFields<T extends FieldValues>({
  fields,
  control,
}: FormFieldsProps<T>) {
  return (
    <>
      {fields.map((field) => (
        <RhfTextField
          key={field.name}
          name={field.name}
          control={control}
          label={field.label}
          type={field.type}
        />
      ))}
    </>
  );
}
