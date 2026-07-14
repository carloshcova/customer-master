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
import { useAgents } from '../api/agents-api';
import type { Agent } from '../types/agent';

const columns = (
  t: TFunction,
  onView: (id: string) => void,
): Column<Agent>[] => [
  { key: 'agent_id', header: t('common.fields.agentId'), sortable: true },
  { key: 'order_prefix', header: t('common.fields.orderPrefix') },
  { key: 'agent_name', header: t('common.fields.name'), sortable: true },
  { key: 'agent_fullname', header: t('common.fields.fullName') },
  { key: 'agent_company', header: t('common.fields.company'), sortable: true },
  { key: 'agent_office', header: t('common.fields.office') },
  { key: 'tax_id', header: t('common.fields.taxId') },
  {
    key: 'active',
    header: t('common.fields.status'),
    render: (agent) => (
      <Badge color={agent.active ? 'success' : 'neutral'}>
        {agent.active ? t('common.status.active') : t('common.status.inactive')}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: t('common.fields.actions'),
    align: 'right',
    render: (agent) => (
      <IconButton
        size="small"
        aria-label={t('common.actions.view')}
        onClick={() => onView(agent.id)}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    ),
  },
];

export interface AgentsListViewProps {
  onView: (id: string) => void;
  onCreate: () => void;
}

/**
 * Agents list — summary totals + create action, filters, and a
 * sortable/selectable/paginated table (mock data via react-query).
 */
export function AgentsListView({ onView, onCreate }: AgentsListViewProps) {
  const { t } = useTranslation();
  const { data: agents = [], isPending, isError } = useAgents();

  const [draftFilters, setDraftFilters] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>();
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filterDefs: FilterDef[] = useMemo(() => {
    const companies = [...new Set(agents.map((agent) => agent.agent_company))];
    return [
      {
        name: 'agent_company',
        label: t('common.fields.company'),
        options: companies.map((c) => ({ value: c, label: c })),
      },
      {
        name: 'active',
        label: t('common.fields.status'),
        options: [
          { value: 'true', label: t('common.status.active') },
          { value: 'false', label: t('common.status.inactive') },
        ],
      },
    ];
  }, [agents, t]);

  const filtered = useMemo(() => {
    let rows = agents.filter((agent) => {
      if (
        filters.agent_company &&
        agent.agent_company !== filters.agent_company
      )
        return false;
      if (filters.active && String(agent.active) !== filters.active)
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
  }, [agents, filters, sortKey, sortDir]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = agents.filter((agent) => agent.active).length;

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
  if (isError) return <Alert severity="error">{t('agents.loadError')}</Alert>;

  return (
    <>
      <PageHeader
        title={t('nav.agents')}
        subtitle={t('agents.foundCount', { count: filtered.length })}
      />
      <SummaryBar
        items={[
          { label: t('common.summary.total'), value: agents.length },
          { label: t('common.summary.active'), value: activeCount },
          {
            label: t('common.summary.inactive'),
            value: agents.length - activeCount,
          },
        ]}
        action={
          <Button startIcon={<AddIcon />} onClick={onCreate}>
            {t('agents.create')}
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
        getRowId={(agent) => agent.id}
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
