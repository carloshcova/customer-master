import { zodResolver } from '@hookform/resolvers/zod';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
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
import {
  useCreateCustomer,
  useCustomer,
  useUpdateCustomer,
} from '../api/customer-master-api';
import {
  type CustomerMaster,
  customerMasterSchema,
} from '../types/customer-master';

const EMPTY: CustomerMaster = {
  customer_id: '',
  customer_code: '',
  bu_corp_id: '',
  customer_name: '',
  customer_legal_name: '',
  status: '',
  country_code: '',
  currency_id: '',
  customer_address: {
    customer_address_id: '',
    customer_id: '',
    city_id: '',
    country_code: '',
    address_code: '',
    address: '',
    contact_email: '',
    contact_name: '',
    activity: '',
    zip_code: '',
    phone: '',
    tax_id: '',
  },
  security_sensor: {
    id: '',
    customer_id: '',
    line_code: '',
    sub_line_code: '',
    class_code: '',
    sub_class_code: '',
    line_desc: '',
    sub_line_desc: '',
    class_desc: '',
    sub_class_desc: '',
    max_retail_price: '',
    min_retail_price: '',
    hard_tag: { hard_tag_id: '', hard_tag_name: '', hard_tag_price: '' },
  },
  customer_port: { id: '', customer_id: '', port_code: '' },
  agents: {
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
  },
};

const customerFields = (t: TFunction): FormFieldDef<CustomerMaster>[] => [
  { name: 'customer_code', label: t('common.fields.code') },
  { name: 'customer_name', label: t('common.fields.name') },
  { name: 'customer_legal_name', label: t('common.fields.legalName') },
  { name: 'bu_corp_id', label: t('common.fields.buCorp') },
  { name: 'status', label: t('common.fields.status') },
  { name: 'currency_id', label: t('common.fields.currency') },
  { name: 'country_code', label: t('common.fields.country') },
  { name: 'customer_address.city_id', label: t('common.fields.city') },
  { name: 'customer_address.address', label: t('common.fields.address') },
  {
    name: 'customer_address.address_code',
    label: t('common.fields.addressCode'),
  },
  { name: 'customer_address.contact_name', label: t('common.fields.contact') },
  {
    name: 'customer_address.contact_email',
    label: t('common.fields.contactEmail'),
    type: 'email',
  },
  { name: 'customer_address.phone', label: t('common.fields.phone') },
  { name: 'customer_address.zip_code', label: t('common.fields.zipCode') },
  { name: 'customer_address.activity', label: t('common.fields.activity') },
  { name: 'customer_address.tax_id', label: t('common.fields.taxId') },
  { name: 'customer_port.port_code', label: t('common.fields.port') },
];

const sensorFields = (t: TFunction): FormFieldDef<CustomerMaster>[] => [
  { name: 'security_sensor.line_code', label: t('common.fields.lineCode') },
  {
    name: 'security_sensor.sub_line_code',
    label: t('common.fields.subLineCode'),
  },
  { name: 'security_sensor.class_code', label: t('common.fields.classCode') },
  {
    name: 'security_sensor.sub_class_code',
    label: t('common.fields.subClassCode'),
  },
  { name: 'security_sensor.line_desc', label: t('common.fields.lineDesc') },
  { name: 'security_sensor.class_desc', label: t('common.fields.classDesc') },
  {
    name: 'security_sensor.max_retail_price',
    label: t('common.fields.maxPrice'),
    type: 'number',
  },
  {
    name: 'security_sensor.min_retail_price',
    label: t('common.fields.minPrice'),
    type: 'number',
  },
  {
    name: 'security_sensor.hard_tag.hard_tag_name',
    label: t('common.fields.hardTag'),
  },
  {
    name: 'security_sensor.hard_tag.hard_tag_price',
    label: t('common.fields.hardTagPrice'),
    type: 'number',
  },
];

const agentFields = (t: TFunction): FormFieldDef<CustomerMaster>[] => [
  { name: 'agents.agent_id', label: t('common.fields.agentIdHint') },
  { name: 'agents.order_prefix', label: t('common.fields.orderPrefix') },
  { name: 'agents.agent_name', label: t('common.fields.agentName') },
  { name: 'agents.agent_fullname', label: t('common.fields.fullName') },
  { name: 'agents.agent_company', label: t('common.fields.company') },
  { name: 'agents.agent_office', label: t('common.fields.office') },
  { name: 'agents.tax_id', label: t('common.fields.taxId') },
  { name: 'agents.agent_address', label: t('common.fields.address') },
];

export interface CustomerMasterFormViewProps {
  /** Omit to create a new customer; provide to edit an existing one. */
  customerId?: string;
  onDone: () => void;
}

/**
 * Customer master detail/edit form — RHF + Zod, split into 3 stacked sections
 * (Customer / Security Sensor / Agent). Data via react-query (mock).
 */
export function CustomerMasterFormView({
  customerId,
  onDone,
}: CustomerMasterFormViewProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(customerId);
  const { data: customer, isLoading } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer();
  const createCustomer = useCreateCustomer();

  const CUSTOMER_FIELDS = useMemo(() => customerFields(t), [t]);
  const SENSOR_FIELDS = useMemo(() => sensorFields(t), [t]);
  const AGENT_FIELDS = useMemo(() => agentFields(t), [t]);

  const { control, handleSubmit } = useForm<CustomerMaster>({
    resolver: zodResolver(customerMasterSchema),
    defaultValues: EMPTY,
    values: customer ?? undefined,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Spinner />
      </Box>
    );
  }
  if (isEdit && !customer)
    return <Alert severity="error">{t('customerMaster.notFound')}</Alert>;

  const saving = updateCustomer.isPending || createCustomer.isPending;
  const onSubmit = (data: CustomerMaster) => {
    const mutation = isEdit ? updateCustomer : createCustomer;
    mutation.mutate(data, { onSuccess: onDone });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection
        title={t('customerMaster.sections.customer')}
        icon={<BusinessIcon fontSize="small" />}
      >
        <FormFields fields={CUSTOMER_FIELDS} control={control} />
      </FormSection>
      <FormSection
        title={t('nav.securitySensor')}
        icon={<SecurityIcon fontSize="small" />}
      >
        <FormFields fields={SENSOR_FIELDS} control={control} />
      </FormSection>
      <FormSection
        title={t('customerMaster.sections.agent')}
        icon={<SupportAgentIcon fontSize="small" />}
      >
        <FormFields fields={AGENT_FIELDS} control={control} />
        <Controller
          name="agents.active"
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
