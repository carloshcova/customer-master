import {
  Alert as MuiAlert,
  type AlertProps as MuiAlertProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tokens } from '@/config/tokens';

const c = tokens.color;

/** Pastel background (`semantic.primary`) + colored icon (`semantic.secondary`). */
const SEVERITY = {
  success: {
    bg: c.semantic.success.primary,
    icon: c.semantic.success.secondary,
  },
  warning: {
    bg: c.semantic.warning.primary,
    icon: c.semantic.warning.secondary,
  },
  error: { bg: c.semantic.alert.primary, icon: c.semantic.alert.secondary },
  info: { bg: c.semantic.info.primary, icon: c.semantic.info.secondary },
} as const;

export type AlertProps = Omit<MuiAlertProps, 'variant' | 'color'>;

const Root = styled(MuiAlert)(({ severity = 'info' }) => {
  const s = SEVERITY[severity];
  return {
    backgroundColor: s.bg,
    color: c.neutral['10'],
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    '& .MuiAlert-icon': { color: s.icon },
    '& .MuiAlert-action': {
      color: c.neutral['10'],
      paddingTop: 0,
      alignItems: 'center',
    },
  };
});

/**
 * Alert (atom) — an inline notification banner. Wraps MUI Alert with the DS
 * pastel background + colored icon per `severity` (success | warning | error |
 * info). Pass `onClose` to show the × close button.
 */
export function Alert({ severity = 'info', ...props }: AlertProps) {
  return <Root severity={severity} {...props} />;
}
