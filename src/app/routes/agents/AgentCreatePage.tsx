import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { AgentFormView } from '@/features/agents';

/** Agent create page — the feature's form in create mode. */
export function AgentCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageShell
      disableContainer
      breadcrumbs={[
        { label: t('nav.home'), to: '../..' },
        { label: t('nav.agents'), to: '..' },
        { label: t('common.actions.new') },
      ]}
    >
      <AgentFormView onDone={() => navigate('..')} />
    </PageShell>
  );
}
