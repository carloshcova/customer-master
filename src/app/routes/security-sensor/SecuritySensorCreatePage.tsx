import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { SecuritySensorFormView } from '@/features/security-sensor';

/** Security sensor create page — the feature's form in create mode. */
export function SecuritySensorCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageShell
      disableContainer
      breadcrumbs={[
        { label: t('nav.home'), to: '../..' },
        { label: t('nav.securitySensor'), to: '..' },
        { label: t('common.actions.new') },
      ]}
    >
      <SecuritySensorFormView onDone={() => navigate('..')} />
    </PageShell>
  );
}
