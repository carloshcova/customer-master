import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import {
  SecuritySensorFormView,
  useSecuritySensor,
} from '@/features/security-sensor';

/** Security sensor detail/edit page. */
export function SecuritySensorEditPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: sensor } = useSecuritySensor(id);
  return (
    <PageShell
      disableContainer
      breadcrumbs={[
        { label: t('nav.home'), to: '../..' },
        { label: t('nav.securitySensor'), to: '..' },
        { label: sensor?.line_code ?? id },
      ]}
    >
      <SecuritySensorFormView sensorId={id} onDone={() => navigate('..')} />
    </PageShell>
  );
}
