import {
  Radio as MuiRadio,
  type RadioProps as MuiRadioProps,
} from '@mui/material';

export type RadioProps = MuiRadioProps;

/**
 * Radio (atom). Thin wrapper over MUI Radio: the theme already renders the
 * selected state in the brand primary (fbc-blue-06) and handles hover / focus /
 * pressed / disabled. Group with MUI `RadioGroup` + `FormControlLabel` so only
 * one option in a set can be selected.
 */
export function Radio(props: RadioProps) {
  return <MuiRadio color="primary" {...props} />;
}
