import { zodResolver } from '@hookform/resolvers/zod';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Alert, Box, FormControlLabel } from '@mui/material';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import {
  type FormFieldDef,
  FormFields,
  FormSection,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/Loading';
import { Switch } from '@/components/ui/Switch';
import { useAgent, useCreateAgent, useUpdateAgent } from '../api/agents-api';
import { type Agent, agentSchema } from '../types/agent';

const EMPTY_AGENT: Agent = {
  id: '',
  agent_id: '',
  order_prefix: '',
  agent_name: '',
  agent_fullname: '',
  agent_address: '',
  tax_id: '',
  agent_company: '',
  agent_office: '',
  active: false,
};

const agentFields = (t: TFunction): FormFieldDef<Agent>[] => [
  { name: 'agent_id', label: t('common.fields.agentIdHint') },
  { name: 'order_prefix', label: t('common.fields.orderPrefix') },
  { name: 'agent_name', label: t('common.fields.name') },
  { name: 'agent_fullname', label: t('common.fields.fullName') },
  { name: 'agent_company', label: t('common.fields.company') },
  { name: 'agent_office', label: t('common.fields.office') },
  { name: 'tax_id', label: t('common.fields.taxId') },
  { name: 'agent_address', label: t('common.fields.address') },
];

export interface AgentFormViewProps {
  /** Omit to create a new agent; provide to edit an existing one. */
  agentId?: string;
  onDone: () => void;
}

/** Agent create/edit form — React Hook Form + Zod, data via react-query (mock). */
export function AgentFormView({ agentId, onDone }: AgentFormViewProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(agentId);
  const { data: agent, isLoading } = useAgent(agentId);
  const updateAgent = useUpdateAgent();
  const createAgent = useCreateAgent();

  const AGENT_FIELDS = useMemo(() => agentFields(t), [t]);

  const { control, handleSubmit } = useForm<Agent>({
    resolver: zodResolver(agentSchema),
    defaultValues: EMPTY_AGENT,
    values: agent ?? undefined,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Spinner />
      </Box>
    );
  }
  if (isEdit && !agent)
    return <Alert severity="error">{t('agents.notFound')}</Alert>;

  const saving = updateAgent.isPending || createAgent.isPending;
  const onSubmit = (data: Agent) => {
    const mutation = isEdit ? updateAgent : createAgent;
    mutation.mutate(data, { onSuccess: onDone });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection
        title={t('agents.section')}
        icon={<SupportAgentIcon fontSize="small" />}
      >
        <FormFields fields={AGENT_FIELDS} control={control} />
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
              label={t('common.status.active')}
            />
          )}
        />
      </FormSection>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onDone}>
          {t('common.actions.cancel')}
        </Button>
        <Button type="submit" disabled={saving}>
          {t('common.actions.save')}
        </Button>
      </Box>
    </Box>
  );
}
