import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  Snackbar as MuiSnackbar,
  type SnackbarProps as MuiSnackbarProps,
  SnackbarContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { tokens } from '@/config/tokens';
import { Alert, type AlertProps } from '../Alert';

export interface SnackbarProps
  extends Omit<MuiSnackbarProps, 'children' | 'message' | 'action'> {
  message?: ReactNode;
  /** Optional trailing action (e.g. a text button). */
  action?: ReactNode;
  /** Colored variant — renders a DS Alert inside instead of the neutral white bar. */
  severity?: AlertProps['severity'];
  /** Show a close (×) button. @default true */
  showClose?: boolean;
}

/** Neutral variant — white surface with the DS `L` elevation. */
const WhiteContent = styled(SnackbarContent)({
  backgroundColor: tokens.color.white,
  color: tokens.color.neutral['10'],
  boxShadow: tokens.shadow.l,
  borderRadius: tokens.radius.sm,
});

/**
 * Snackbar (molecule) — a temporary, non-blocking message. Wraps MUI Snackbar
 * (positioning + `autoHideDuration`). Neutral by default; pass `severity` for a
 * colored variant (renders a DS Alert). The close × uses reason `escapeKeyDown`
 * so typical `clickaway` guards don't swallow it. Show one at a time.
 */
export function Snackbar({
  message,
  action,
  severity,
  showClose = true,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  ...props
}: SnackbarProps) {
  const closeButton = showClose ? (
    <IconButton
      aria-label="close"
      size="small"
      color="inherit"
      onClick={(event) => onClose?.(event, 'escapeKeyDown')}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  ) : null;

  const trailing = (
    <>
      {action}
      {closeButton}
    </>
  );

  return (
    <MuiSnackbar anchorOrigin={anchorOrigin} onClose={onClose} {...props}>
      {severity ? (
        <Alert severity={severity} action={trailing}>
          {message}
        </Alert>
      ) : (
        <WhiteContent message={message} action={trailing} />
      )}
    </MuiSnackbar>
  );
}
