import {
  Breadcrumbs as MuiBreadcrumbs,
  type BreadcrumbsProps as MuiBreadcrumbsProps,
} from '@mui/material';

export type BreadcrumbsProps = MuiBreadcrumbsProps;

/**
 * Breadcrumbs (molecule) — shows the current location in the page hierarchy.
 * Wraps MUI Breadcrumbs with the DS `>` separator. Render intermediate items as
 * `Link` and the current page as a colored `Typography` (last child).
 */
export function Breadcrumbs({ separator = '>', ...props }: BreadcrumbsProps) {
  return <MuiBreadcrumbs separator={separator} {...props} />;
}
