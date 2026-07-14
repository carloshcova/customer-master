import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Box, IconButton } from '@mui/material';
import type { TFunction } from 'i18next';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { type Column, DataTable } from '@/components/ui/DataTable';
import { FilterBar, type FilterDef } from '@/components/ui/FilterBar';
import { Spinner } from '@/components/ui/Loading';
import { PageHeader } from '@/components/ui/PageHeader';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { SummaryBar } from '@/components/ui/SummaryBar';
import { useCustomers } from '../api/customer-master-api';
import type { CustomerMaster } from '../types/customer-master';

const columns = (
  t: TFunction,
  onView: (id: string) => void,
): Column<CustomerMaster>[] => [
  { key: 'customer_code', header: t('common.fields.code'), sortable: true },
  { key: 'customer_name', header: t('common.fields.name'), sortable: true },
  { key: 'customer_legal_name', header: t('common.fields.legalName') },
  {
    key: 'status',
    header: t('common.fields.status'),
    render: (customer) => (
      <Badge color={customer.status === 'Activo' ? 'success' : 'neutral'}>
        {customer.status}
      </Badge>
    ),
  },
  { key: 'country_code', header: t('common.fields.country') },
  { key: 'currency_id', header: t('common.fields.currency') },
  {
    key: 'actions',
    header: t('common.fields.actions'),
    align: 'right',
    render: (customer) => (
      <IconButton
        size="small"
        aria-label={t('common.actions.view')}
        onClick={() => onView(customer.customer_id)}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    ),
  },
];

export interface CustomerMasterListViewProps {
  onView: (id: string) => void;
  onCreate: () => void;
}

/** Customer master list — summary + create, filters, and a paginated table. */
export function CustomerMasterListView({
  onView,
  onCreate,
}: CustomerMasterListViewProps) {
  const { t } = useTranslation();
  const { data: customers = [], isPending, isError } = useCustomers();

  const [draftFilters, setDraftFilters] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>();
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filterDefs: FilterDef[] = useMemo(
    () => [
      {
        name: 'status',
        label: t('common.fields.status'),
        options: [
          { value: 'Activo', label: t('common.status.active') },
          { value: 'Inactivo', label: t('common.status.inactive') },
        ],
      },
    ],
    [t],
  );

  const filtered = useMemo(() => {
    let rows = customers.filter((customer) => {
      if (filters.status && customer.status !== filters.status) return false;
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
  }, [customers, filters, sortKey, sortDir]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = customers.filter(
    (customer) => customer.status === 'Activo',
  ).length;

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
    return <Alert severity="error">{t('customerMaster.loadError')}</Alert>;

  return (
    <>
      <PageHeader
        title={t('nav.customerMaster')}
        subtitle={t('customerMaster.foundCount', { count: filtered.length })}
      />
      <SummaryBar
        items={[
          { label: t('common.summary.total'), value: customers.length },
          { label: t('common.summary.active'), value: activeCount },
          {
            label: t('common.summary.inactive'),
            value: customers.length - activeCount,
          },
        ]}
        action={
          <Button startIcon={<AddIcon />} onClick={onCreate}>
            {t('customerMaster.create')}
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
        getRowId={(customer) => customer.customer_id}
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
