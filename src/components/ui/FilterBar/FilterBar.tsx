import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { MenuItem, Select } from '@/components/ui/Select';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  name: string;
  label: string;
  options: FilterOption[];
}

export interface FilterBarProps {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

/**
 * FilterBar (organism) — a row of Select filters plus Clear/Search actions.
 * Responsive: filters wrap; the actions stay right-aligned. The feature owns the
 * filter state. (The "advanced search" expander from Figma is added later.)
 */
export function FilterBar({
  filters,
  values,
  onChange,
  onSearch,
  onClear,
}: FilterBarProps) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        mb: 3,
      }}
    >
      {filters.map((filter) => (
        <Select
          key={filter.name}
          size="small"
          label={filter.label}
          value={values[filter.name] ?? ''}
          onChange={(event) => onChange(filter.name, event.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">{t('common.filter.all')}</MenuItem>
          {filter.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ))}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
        <Button variant="ghost" onClick={onClear}>
          {t('common.actions.clear')}
        </Button>
        <Button variant="outlined" onClick={onSearch}>
          {t('common.actions.search')}
        </Button>
      </Box>
    </Box>
  );
}
