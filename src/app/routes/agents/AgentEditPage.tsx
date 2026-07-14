import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { AgentFormView, useAgent } from '@/features/agents';

/** Agent detail/edit page — breadcrumbs + the feature's form. */
export function AgentEditPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: agent } = useAgent(id);
  return (
    <PageShell
      disableContainer
      breadcrumbs={[
        { label: t('nav.home'), to: '../..' },
        { label: t('nav.agents'), to: '..' },
        { label: agent?.agent_fullname ?? id },
      ]}
    >
      <AgentFormView agentId={id} onDone={() => navigate('..')} />
    </PageShell>
  );
}
