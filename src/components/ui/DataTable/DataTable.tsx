import type { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@/components/ui/Table';

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** Custom cell renderer; defaults to `row[key]`. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Show a selection checkbox column. */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string) => void;
  /** Rendered when there are no rows. */
  emptyMessage?: ReactNode;
}

/**
 * DataTable (organism) — a generic, config-driven table built on the DS table
 * primitives (themed header). Supports row selection and sortable columns.
 * Compose feature tables by passing `columns` with custom `render` (Badges,
 * action IconButtons, inline inputs, …).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sortKey,
  sortDirection = 'asc',
  onSortChange,
  emptyMessage = 'No hay resultados.',
}: DataTableProps<T>) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && !allSelected;
  const colSpan = columns.length + (selectable ? 1 : 0);

  const toggleAll = () =>
    onSelectionChange?.(allSelected ? [] : rows.map(getRowId));
  const toggleRow = (id: string) =>
    onSelectionChange?.(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  slotProps={{ input: { 'aria-label': 'select all' } }}
                />
              </TableCell>
            )}
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align}>
                {col.sortable && onSortChange ? (
                  <TableSortLabel
                    active={sortKey === col.key}
                    direction={sortKey === col.key ? sortDirection : 'asc'}
                    onClick={() => onSortChange(col.key)}
                  >
                    {col.header}
                  </TableSortLabel>
                ) : (
                  col.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              return (
                <TableRow key={id} hover selected={selectedIds.includes(id)}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(id)}
                        onChange={() => toggleRow(id)}
                        slotProps={{ input: { 'aria-label': `select ${id}` } }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render
                        ? col.render(row)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? '',
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
