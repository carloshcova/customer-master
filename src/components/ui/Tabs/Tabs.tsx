import { Tabs as MuiTabs, type TabsProps as MuiTabsProps } from '@mui/material';

export type TabsProps = MuiTabsProps;

/**
 * Tabs (molecule) — organizes content into switchable sections. Wraps MUI Tabs
 * with the DS active color (`secondary` = FBC Ice) for both the selected label
 * and the underline indicator. Compose with `Tab` children.
 */
export function Tabs({
  textColor = 'secondary',
  indicatorColor = 'secondary',
  ...props
}: TabsProps) {
  return (
    <MuiTabs textColor={textColor} indicatorColor={indicatorColor} {...props} />
  );
}
