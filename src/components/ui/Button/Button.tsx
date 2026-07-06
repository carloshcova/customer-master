import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
} from '@mui/material';
import { type CSSObject, styled } from '@mui/material/styles';
import { tokens } from '@/config/tokens';

export type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'elevated';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps
  extends Omit<MuiButtonProps, 'variant' | 'size' | 'color'> {
  /** Design-system style. @default 'filled' */
  variant?: ButtonVariant;
  /** @default 'medium' */
  size?: ButtonSize;
}

const c = tokens.color;

/**
 * Per-size dimensions. NOTE: heights/padding inferred from the Figma screenshots
 * (small height ≈ 40 is confident; medium/large need redline confirmation).
 */
const SIZES: Record<ButtonSize, CSSObject> = {
  small: { minHeight: 40, padding: '0 16px', fontSize: tokens.font.size.body2 },
  medium: {
    minHeight: 48,
    padding: '0 20px',
    fontSize: tokens.font.size.body1,
  },
  large: { minHeight: 56, padding: '0 24px', fontSize: tokens.font.size.body1 },
};

/**
 * Per-variant colors across states (default / :hover / focus-visible / :active /
 * disabled). Filled + Outlined are confirmed against Figma redlines; Ghost and
 * Elevated are still inferred from the screenshots (pending exact hex).
 * Focused = keyboard/click focus (MUI `Mui-focusVisible`); Pressed = `:active`.
 */
function variantStyles(variant: ButtonVariant): CSSObject {
  switch (variant) {
    case 'filled':
      return {
        backgroundColor: c.fbcBlue['06'], // #0C2941
        color: c.white,
        '&:hover': { backgroundColor: c.fbcBlue['05'] }, // #3D5467
        '&.Mui-focusVisible': { backgroundColor: c.fbcIce['08'] }, // #096E96
        '&:active': { backgroundColor: c.fbcIce['09'] }, // #075574
        '&.Mui-disabled': {
          backgroundColor: c.neutral['02'], // #F1F1F1
          color: c.neutral['05'],
        },
      };
    case 'outlined':
      // Neutral (not brand): #333 border + text, grey fills on interaction.
      return {
        backgroundColor: 'transparent',
        color: c.neutral['10'], // #333333
        border: `1px solid ${c.neutral['10']}`,
        '&:hover': { backgroundColor: c.neutral['02'] }, // #F1F1F1
        '&.Mui-focusVisible': { backgroundColor: c.neutral['03'] }, // #DDDDDD
        '&:active': { backgroundColor: c.neutral['02'] }, // #F1F1F1
        '&.Mui-disabled': {
          color: c.neutral['03'], // #DDDDDD
          borderColor: c.neutral['03'],
        },
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: c.fbcBlue['06'],
        textDecoration: 'underline',
        '&:hover': { backgroundColor: c.neutral['02'], textDecoration: 'none' },
        '&.Mui-focusVisible': {
          backgroundColor: c.neutral['03'],
          textDecoration: 'none',
        },
        '&:active': {
          backgroundColor: c.neutral['03'],
          textDecoration: 'none',
        },
        '&.Mui-disabled': { color: c.neutral['05'], textDecoration: 'none' },
      };
    case 'elevated':
      return {
        backgroundColor: c.white,
        color: c.fbcBlue['06'],
        boxShadow: tokens.shadow.base,
        '&:hover': { backgroundColor: c.white, boxShadow: tokens.shadow.md },
        '&.Mui-focusVisible': {
          backgroundColor: c.neutral['03'],
          boxShadow: 'none',
        },
        '&:active': { backgroundColor: c.neutral['03'], boxShadow: 'none' },
        '&.Mui-disabled': {
          backgroundColor: c.neutral['02'],
          color: c.neutral['05'],
          boxShadow: 'none',
        },
      };
  }
}

const Root = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'dsVariant' && prop !== 'dsSize',
})<{ dsVariant: ButtonVariant; dsSize: ButtonSize }>(
  ({ dsVariant, dsSize }) => ({
    // Labels are sentence-case, never uppercased (DS Don't: no ALL CAPS).
    textTransform: 'none',
    fontWeight: tokens.font.weight.bold,
    borderRadius: tokens.radius.xs,
    ...SIZES[dsSize],
    ...variantStyles(dsVariant),
  }),
);

/**
 * Design-system Button (atom). Wraps MUI Button — keyboard focus, ripple and
 * a11y come for free. Use `startIcon` for a leading icon.
 */
export function Button({
  variant = 'filled',
  size = 'medium',
  ...props
}: ButtonProps) {
  return <Root dsVariant={variant} dsSize={size} disableElevation {...props} />;
}
