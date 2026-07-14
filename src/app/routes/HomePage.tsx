import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import groupIcon from '@/assets/group.svg';
import { PageShell } from '@/components/layouts/PageShell';
import { NavCard } from '@/components/ui/NavCard';

const SECTIONS = [
  { key: 'customerMaster', to: 'customers' },
  { key: 'agents', to: 'agents' },
  { key: 'securitySensor', to: 'security-sensor' },
] as const;

/**
 * Home page — breadcrumbs + a bordered container with the section navigation
 * cards. Each card links (React Router) to a section page. Labels are localized
 * (es/en/cn) and stay in sync with the portal language.
 */
export function HomePage() {
  const { t } = useTranslation();

  return (
    <PageShell breadcrumbs={[{ label: t('nav.home') }]}>
      {/* Fixed 250px square cards, 24px gap, wrapping responsively; they shrink
          (staying square) only on screens too narrow to fit 250px. */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {SECTIONS.map((section) => (
          <Box key={section.to} sx={{ width: 250, maxWidth: '100%' }}>
            <NavCard
              title={t(`nav.${section.key}`)}
              to={section.to}
              icon={<img src={groupIcon} alt="" width={48} height={48} />}
            />
          </Box>
        ))}
      </Box>
    </PageShell>
  );
}
