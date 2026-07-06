import { Chip as MuiChip, type ChipProps as MuiChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tokens } from '@/config/tokens';

export type ChipColor = 'neutral' | 'success' | 'error' | 'warning' | 'info';
export type ChipVariant = 'filled' | 'outlined';

export interface ChipProps extends Omit<MuiChipProps, 'color' | 'variant'> {
  /** @default 'neutral' */
  color?: ChipColor;
  /** @default 'filled' */
  variant?: ChipVariant;
}

const c = tokens.color;

// Filled: pastel fill + strong text (neutral filled uses ice-02, per the DS).
const FILLED: Record<ChipColor, { bg: string; fg: string }> = {
  neutral: { bg: c.fbcIce['02'], fg: c.neutral['10'] },
  success: { bg: c.semantic.success.primary, fg: c.semantic.success.secondary },
  error: { bg: c.semantic.alert.primary, fg: c.semantic.alert.secondary },
  warning: { bg: c.semantic.warning.primary, fg: c.semantic.warning.secondary },
  info: { bg: c.semantic.info.primary, fg: c.semantic.info.secondary },
};

// Outlined: transparent fill, colored border + text.
const OUTLINED: Record<ChipColor, { border: string; fg: string }> = {
  neutral: { border: c.neutral['04'], fg: c.neutral['10'] },
  success: {
    border: c.semantic.success.secondary,
    fg: c.semantic.success.secondary,
  },
  error: { border: c.semantic.alert.secondary, fg: c.semantic.alert.secondary },
  warning: {
    border: c.semantic.warning.secondary,
    fg: c.semantic.warning.secondary,
  },
  info: { border: c.semantic.info.secondary, fg: c.semantic.info.secondary },
};

const Root = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'dsColor',
})<{ dsColor: ChipColor }>(({ dsColor, variant }) => {
  const outlined = variant === 'outlined';
  const fg = outlined ? OUTLINED[dsColor].fg : FILLED[dsColor].fg;
  return {
    fontFamily: tokens.font.family,
    fontSize: tokens.font.size.body3,
    fontWeight: tokens.font.weight.regular,
    borderRadius: tokens.radius.sm,
    color: fg,
    backgroundColor: outlined ? 'transparent' : FILLED[dsColor].bg,
    border: outlined ? `1px solid ${OUTLINED[dsColor].border}` : 'none',
    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: fg },
    // Hover kept on-brand (exact hover/focus/dragged hex pending redlines).
    '&:hover': {
      backgroundColor: outlined ? c.neutral['02'] : FILLED[dsColor].bg,
    },
    '&.Mui-disabled': {
      opacity: 1,
      color: c.neutral['04'],
      backgroundColor: outlined ? 'transparent' : c.neutral['02'],
      borderColor: c.neutral['03'],
    },
  };
});

/**
 * Chip (atom) — compact element for displaying/selecting options. Wraps MUI Chip
 * (delete `×`, leading `icon`, `clickable`, `disabled` come for free). Colors
 * mapped to tokens; interaction-state hex pending redlines.
 */
export function Chip({
  color = 'neutral',
  variant = 'filled',
  ...props
}: ChipProps) {
  return <Root dsColor={color} variant={variant} {...props} />;
}
