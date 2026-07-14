import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { CustomerMasterFormView } from '@/features/customer-master';

/** Customer master create page — the feature's form in create mode. */
export function CustomerMasterCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageShell
      disableContainer
      breadcrumbs={[
        { label: t('nav.home'), to: '../..' },
        { label: t('nav.customerMaster'), to: '..' },
        { label: t('common.actions.new') },
      ]}
    >
      <CustomerMasterFormView onDone={() => navigate('..')} />
    </PageShell>
  );
}
