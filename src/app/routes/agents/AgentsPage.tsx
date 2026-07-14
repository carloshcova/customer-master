import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layouts/PageShell';
import { AgentsListView } from '@/features/agents';

/** Agents list page — breadcrumbs + the feature's list view. */
export function AgentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageShell
      breadcrumbs={[
        { label: t('nav.home'), to: '..' },
        { label: t('nav.agents') },
      ]}
    >
      <AgentsListView
        onView={(id) => navigate(`${id}/edit`)}
        onCreate={() => navigate('new')}
      />
    </PageShell>
  );
}
