import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { CustomerMasterListView } from '@/features/customer-master';

/** Customer master list page. */
export function CustomerMasterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageShell
      breadcrumbs={[
        { label: t('nav.home'), to: '..' },
        { label: t('nav.customerMaster') },
      ]}
    >
      <CustomerMasterListView
        onView={(id) => navigate(`${id}/edit`)}
        onCreate={() => navigate('new')}
      />
    </PageShell>
  );
}
