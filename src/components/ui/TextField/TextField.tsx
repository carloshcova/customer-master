import CheckIcon from '@mui/icons-material/Check';
import {
  InputAdornment,
  TextField as MuiTextField,
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tokens } from '@/config/tokens';

export type TextFieldProps = Omit<MuiTextFieldProps, 'variant'> & {
  /** DS textfield style. @default 'filled' */
  variant?: 'filled' | 'outlined';
  /** Valid/verified state — green underline/border, label, helper text and check icon. */
  success?: boolean;
};

const successColor = tokens.color.semantic.success.secondary; // #186F07

/**
 * MUI covers enabled/hover/focus/error/disabled on-brand via the theme. Only the
 * DS "success" state is custom: green underline (resting + focused), label and
 * helper text.
 */
const Root = styled(MuiTextField, {
  shouldForwardProp: (prop) => prop !== 'dsSuccess',
})<{ dsSuccess?: boolean }>(({ dsSuccess }) =>
  dsSuccess
    ? {
        '& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': {
          color: successColor,
        },
        // Filled variant underline.
        '& .MuiFilledInput-root::before, & .MuiFilledInput-root:hover::before, & .MuiFilledInput-root::after':
          { borderBottomColor: successColor },
        // Outlined variant border.
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          { borderColor: successColor },
        '& .MuiFormHelperText-root': { color: successColor },
      }
    : {},
);

/**
 * TextField (atom) — `filled` (default) or `outlined`. Wraps MUI TextField:
 * label, `placeholder`, `helperText` (supporting text), `error`, `disabled`, and
 * `select` (dropdown) work out of the box. Adds the DS `success` state.
 *
 * DS usage: lowercase labels, validate on blur (not while focused), put important
 * info in `helperText`, not the placeholder.
 */
export function TextField({
  variant = 'filled',
  success = false,
  error = false,
  slotProps,
  ...props
}: TextFieldProps) {
  const showSuccess = success && !error;

  return (
    <Root
      variant={variant}
      error={error}
      dsSuccess={showSuccess}
      slotProps={
        showSuccess
          ? {
              ...slotProps,
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckIcon fontSize="small" sx={{ color: successColor }} />
                  </InputAdornment>
                ),
              },
            }
          : slotProps
      }
      {...props}
    />
  );
}
