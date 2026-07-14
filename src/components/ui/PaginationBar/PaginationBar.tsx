import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@/components/ui/Pagination';
import { MenuItem, Select } from '@/components/ui/Select';

export interface PaginationBarProps {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * PaginationBar (organism) — items-per-page selector, the "from-to of total"
 * range, and numbered page navigation (navy active). Responsive: wraps on
 * narrow screens.
 */
export function PaginationBar({
  page,
  pageSize,
  total,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  const { t } = useTranslation();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        mt: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body3" color="text.secondary">
          {t('common.pagination.itemsPerPage')}
        </Typography>
        <Select
          size="small"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          sx={{ minWidth: 80 }}
        >
          {pageSizeOptions.map((option) => (
            <MenuItem key={option} value={String(option)}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Typography variant="body3" color="text.secondary">
        {t('common.pagination.range', { from, to, total })}
      </Typography>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_event, value) => onPageChange(value)}
      />
    </Box>
  );
}
