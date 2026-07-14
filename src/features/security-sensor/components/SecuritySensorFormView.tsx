import { zodResolver } from '@hookform/resolvers/zod';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SecurityIcon from '@mui/icons-material/Security';
import { Alert, Box } from '@mui/material';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import {
  type FormFieldDef,
  FormFields,
  FormSection,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/Loading';
import {
  useCreateSecuritySensor,
  useSecuritySensor,
  useUpdateSecuritySensor,
} from '../api/security-sensor-api';
import {
  type SecuritySensor,
  securitySensorSchema,
} from '../types/security-sensor';

const EMPTY: SecuritySensor = {
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
};

const sensorFields = (t: TFunction): FormFieldDef<SecuritySensor>[] => [
  { name: 'line_code', label: t('common.fields.lineCode') },
  { name: 'sub_line_code', label: t('common.fields.subLineCode') },
  { name: 'class_code', label: t('common.fields.classCode') },
  { name: 'sub_class_code', label: t('common.fields.subClassCode') },
  { name: 'line_desc', label: t('common.fields.lineDesc') },
  { name: 'sub_line_desc', label: t('common.fields.subLineDesc') },
  { name: 'class_desc', label: t('common.fields.classDesc') },
  { name: 'sub_class_desc', label: t('common.fields.subClassDesc') },
  {
    name: 'max_retail_price',
    label: t('common.fields.maxPrice'),
    type: 'number',
  },
  {
    name: 'min_retail_price',
    label: t('common.fields.minPrice'),
    type: 'number',
  },
];

const hardTagFields = (t: TFunction): FormFieldDef<SecuritySensor>[] => [
  { name: 'hard_tag.hard_tag_name', label: t('common.fields.hardTag') },
  {
    name: 'hard_tag.hard_tag_price',
    label: t('common.fields.hardTagPrice'),
    type: 'number',
  },
];

export interface SecuritySensorFormViewProps {
  /** Omit to create a new sensor; provide to edit an existing one. */
  sensorId?: string;
  onDone: () => void;
}

/** Security sensor create/edit form — RHF + Zod, data via react-query (mock). */
export function SecuritySensorFormView({
  sensorId,
  onDone,
}: SecuritySensorFormViewProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(sensorId);
  const { data: sensor, isLoading } = useSecuritySensor(sensorId);
  const updateSensor = useUpdateSecuritySensor();
  const createSensor = useCreateSecuritySensor();

  const SENSOR_FIELDS = useMemo(() => sensorFields(t), [t]);
  const HARD_TAG_FIELDS = useMemo(() => hardTagFields(t), [t]);

  const { control, handleSubmit } = useForm<SecuritySensor>({
    resolver: zodResolver(securitySensorSchema),
    defaultValues: EMPTY,
    values: sensor ?? undefined,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Spinner />
      </Box>
    );
  }
  if (isEdit && !sensor)
    return <Alert severity="error">{t('securitySensor.notFound')}</Alert>;

  const saving = updateSensor.isPending || createSensor.isPending;
  const onSubmit = (data: SecuritySensor) => {
    const mutation = isEdit ? updateSensor : createSensor;
    mutation.mutate(data, { onSuccess: onDone });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection
        title={t('securitySensor.sections.sensor')}
        icon={<SecurityIcon fontSize="small" />}
      >
        <FormFields fields={SENSOR_FIELDS} control={control} />
      </FormSection>
      <FormSection
        title={t('securitySensor.sections.hardTag')}
        icon={<LocalOfferIcon fontSize="small" />}
      >
        <FormFields fields={HARD_TAG_FIELDS} control={control} />
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
