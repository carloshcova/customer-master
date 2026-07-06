import {
  Checkbox as MuiCheckbox,
  type CheckboxProps as MuiCheckboxProps,
} from '@mui/material';

export type CheckboxProps = MuiCheckboxProps;

/**
 * Checkbox (atom). Thin wrapper over MUI Checkbox: the theme already renders the
 * checked/indeterminate state in the brand primary (fbc-blue-06) and handles
 * hover / focus / pressed / disabled. Supports `indeterminate`, `disabled`,
 * `size`. Pair with MUI `FormControlLabel` for the (required) label.
 */
export function Checkbox(props: CheckboxProps) {
  return <MuiCheckbox color="primary" {...props} />;
}
