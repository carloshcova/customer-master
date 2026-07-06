import { styled } from '@mui/material/styles';
import type { HTMLAttributes } from 'react';
import { tokens } from '@/config/tokens';

export type BadgeColor = 'success' | 'error' | 'warning' | 'info' | 'neutral';

const c = tokens.color;

/**
 * Status colors — pastel background (`semantic.primary`) + strong text
 * (`semantic.secondary`). Confirmed token pairs. Figma `alert` (red) = `error`.
 */
const PALETTE: Record<BadgeColor, { bg: string; fg: string }> = {
  success: { bg: c.semantic.success.primary, fg: c.semantic.success.secondary },
  error: { bg: c.semantic.alert.primary, fg: c.semantic.alert.secondary },
  warning: { bg: c.semantic.warning.primary, fg: c.semantic.warning.secondary },
  info: { bg: c.semantic.info.primary, fg: c.semantic.info.secondary },
  neutral: { bg: c.neutral['02'], fg: c.neutral['09'] },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status color. @default 'neutral' */
  color?: BadgeColor;
}

const Root = styled('span', {
  shouldForwardProp: (prop) => prop !== 'dsColor',
})<{ dsColor: BadgeColor }>(({ dsColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: PALETTE[dsColor].bg,
  color: PALETTE[dsColor].fg,
  fontFamily: tokens.font.family,
  fontSize: tokens.font.size.body3, // 12px
  fontWeight: tokens.font.weight.regular,
  lineHeight: 1,
  padding: '4px 8px',
  borderRadius: tokens.radius.sm,
  whiteSpace: 'nowrap',
}));

/**
 * Badge (atom) — a small, non-interactive status label. Sizes/radius inferred
 * from the Figma screenshots (pending exact redlines).
 */
export function Badge({ color = 'neutral', ...props }: BadgeProps) {
  return <Root dsColor={color} {...props} />;
}
