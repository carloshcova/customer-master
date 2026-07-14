import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import {
  CustomerMasterFormView,
  useCustomer,
} from '@/features/customer-master';

/** Customer master detail/edit page (3-section form). */
export function CustomerMasterEditPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: customer } = useCustomer(id);
  return (
    <PageShell
      disableContainer
      breadcrumbs={[
        { label: t('nav.home'), to: '../..' },
        { label: t('nav.customerMaster'), to: '..' },
        { label: customer?.customer_name ?? id },
      ]}
    >
      <CustomerMasterFormView customerId={id} onDone={() => navigate('..')} />
    </PageShell>
  );
}
