import {
  Switch as MuiSwitch,
  type SwitchProps as MuiSwitchProps,
} from '@mui/material';

export type SwitchProps = MuiSwitchProps;

/**
 * Switch (atom). Thin wrapper over MUI Switch: the theme already renders the "on"
 * track in the brand primary (fbc-blue-06) and handles hover / focus / pressed /
 * disabled. For a ✓ or × inside the thumb, pass `icon` / `checkedIcon`. Pair with
 * MUI `FormControlLabel` for a label.
 */
export function Switch(props: SwitchProps) {
  return <MuiSwitch color="primary" {...props} />;
}
