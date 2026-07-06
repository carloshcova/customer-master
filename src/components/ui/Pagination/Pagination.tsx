import {
  Pagination as MuiPagination,
  type PaginationProps as MuiPaginationProps,
} from '@mui/material';

export type PaginationProps = MuiPaginationProps;

/**
 * Pagination (molecule) — numbered page navigation. Wraps MUI Pagination with the
 * DS defaults: navy active page (`color="primary"`) and rounded buttons. For the
 * full toolbar (items-per-page, "go to", "1-3 of 120" range) compose with
 * `TablePagination` / `Select` when building a table page.
 */
export function Pagination({
  color = 'primary',
  shape = 'rounded',
  ...props
}: PaginationProps) {
  return <MuiPagination color={color} shape={shape} {...props} />;
}
