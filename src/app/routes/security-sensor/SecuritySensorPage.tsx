import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { SecuritySensorListView } from '@/features/security-sensor';

/** Security sensor list page. */
export function SecuritySensorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageShell
      breadcrumbs={[
        { label: t('nav.home'), to: '..' },
        { label: t('nav.securitySensor') },
      ]}
    >
      <SecuritySensorListView
        onView={(id) => navigate(`${id}/edit`)}
        onCreate={() => navigate('new')}
      />
    </PageShell>
  );
}
