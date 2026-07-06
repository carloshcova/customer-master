import { Autocomplete, Checkbox, TextField } from '@mui/material';

export interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  /** Available options (values). */
  options: readonly string[];
  /** Selected values (controlled). */
  value: string[];
  onChange: (value: string[]) => void;
  /** Collapsed chips shown before the "+N" overflow. @default 2 */
  limitTags?: number;
  /** Max number of selections allowed (DS classification filter caps at 10). */
  max?: number;
  disabled?: boolean;
}

/**
 * MultiSelect (molecule) — type-ahead multi-selection. Wraps MUI Autocomplete
 * (`multiple`): options carry a checkbox, selected values render as removable
 * chips inside the field, and overflow collapses to "+N" (`limitTags`). Deselect
 * via the option checkbox or the chip ×. Optionally cap selections with `max`.
 */
export function MultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  limitTags = 2,
  max,
  disabled,
}: MultiSelectProps) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={value}
      disabled={disabled}
      limitTags={limitTags}
      onChange={(_event, next) => {
        if (max && next.length > max) return;
        onChange(next);
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...liProps } = props;
        return (
          <li key={key} {...liProps}>
            <Checkbox checked={selected} sx={{ mr: 1 }} />
            {option}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}
