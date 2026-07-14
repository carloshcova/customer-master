import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Box, IconButton } from '@mui/material';
import type { TFunction } from 'i18next';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { type Column, DataTable } from '@/components/ui/DataTable';
import { FilterBar, type FilterDef } from '@/components/ui/FilterBar';
import { Spinner } from '@/components/ui/Loading';
import { PageHeader } from '@/components/ui/PageHeader';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { SummaryBar } from '@/components/ui/SummaryBar';
import { useSecuritySensors } from '../api/security-sensor-api';
import type { SecuritySensor } from '../types/security-sensor';

const columns = (
  t: TFunction,
  onView: (id: string) => void,
): Column<SecuritySensor>[] => [
  { key: 'line_code', header: t('common.fields.lineCode'), sortable: true },
  { key: 'line_desc', header: t('securitySensor.columns.line') },
  { key: 'class_code', header: t('common.fields.classCode'), sortable: true },
  { key: 'class_desc', header: t('securitySensor.columns.class') },
  {
    key: 'max_retail_price',
    header: t('securitySensor.columns.max'),
    align: 'right',
  },
  {
    key: 'min_retail_price',
    header: t('securitySensor.columns.min'),
    align: 'right',
  },
  {
    key: 'hard_tag',
    header: t('common.fields.hardTag'),
    render: (s) => s.hard_tag.hard_tag_name,
  },
  {
    key: 'actions',
    header: t('common.fields.actions'),
    align: 'right',
    render: (sensor) => (
      <IconButton
        size="small"
        aria-label={t('common.actions.view')}
        onClick={() => onView(sensor.id)}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    ),
  },
];

export interface SecuritySensorListViewProps {
  onView: (id: string) => void;
  onCreate: () => void;
}

/** Security sensors list — summary + create, filters, and a paginated table. */
export function SecuritySensorListView({
  onView,
  onCreate,
}: SecuritySensorListViewProps) {
  const { t } = useTranslation();
  const { data: sensors = [], isPending, isError } = useSecuritySensors();

  const [draftFilters, setDraftFilters] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>();
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filterDefs: FilterDef[] = useMemo(() => {
    const lines = [...new Set(sensors.map((sensor) => sensor.line_code))];
    return [
      {
        name: 'line_code',
        label: t('common.fields.lineCode'),
        options: lines.map((l) => ({ value: l, label: l })),
      },
    ];
  }, [sensors, t]);

  const filtered = useMemo(() => {
    let rows = sensors.filter((sensor) => {
      if (filters.line_code && sensor.line_code !== filters.line_code)
        return false;
      return true;
    });
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '');
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [sensors, filters, sortKey, sortDir]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const lineCount = new Set(sensors.map((sensor) => sensor.line_code)).size;

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Spinner />
      </Box>
    );
  }
  if (isError)
    return <Alert severity="error">{t('securitySensor.loadError')}</Alert>;

  return (
    <>
      <PageHeader
        title={t('nav.securitySensor')}
        subtitle={t('securitySensor.foundCount', { count: filtered.length })}
      />
      <SummaryBar
        items={[
          { label: t('common.summary.total'), value: sensors.length },
          { label: t('securitySensor.summaryLines'), value: lineCount },
        ]}
        action={
          <Button startIcon={<AddIcon />} onClick={onCreate}>
            {t('securitySensor.create')}
          </Button>
        }
      />
      <FilterBar
        filters={filterDefs}
        values={draftFilters}
        onChange={(name, value) =>
          setDraftFilters((prev) => ({ ...prev, [name]: value }))
        }
        onSearch={() => {
          setFilters(draftFilters);
          setPage(1);
        }}
        onClear={() => {
          setDraftFilters({});
          setFilters({});
          setPage(1);
        }}
      />
      <DataTable
        columns={columns(t, onView)}
        rows={paged}
        getRowId={(sensor) => sensor.id}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        sortKey={sortKey}
        sortDirection={sortDir}
        onSortChange={handleSort}
      />
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </>
  );
}
