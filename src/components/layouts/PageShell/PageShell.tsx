import { Box, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link } from '@/components/ui/Breadcrumbs';
import { tokens } from '@/config/tokens';

export interface Crumb {
  label: string;
  /** Relative route (resolved under the host's base). Omit for the current page. */
  to?: string;
}

export interface PageShellProps {
  /** Breadcrumb trail; the last item is the current page. */
  breadcrumbs: Crumb[];
  children: ReactNode;
  /**
   * Render children without the outer bordered container. Use it when the content
   * already provides its own containers (e.g. a form of bordered `FormSection`s),
   * so those reach full width instead of nesting inside another border.
   */
  disableContainer?: boolean;
}

/**
 * PageShell (layout) — the standard page frame: a centered, padded page container
 * (DS `grid.maxWidth`, ~1280px) holding a breadcrumb trail followed by a bordered
 * content container. Every page uses it, so the page margins live here (the shell
 * provides the outer chrome; this MFE owns its content layout). Breadcrumb links use
 * React Router (relative paths) so navigation integrates with the host shell's router.
 */
export function PageShell({
  breadcrumbs,
  children,
  disableContainer = false,
}: PageShellProps) {
  return (
    <Box
      sx={{ maxWidth: tokens.grid.maxWidth, mx: 'auto', p: { xs: 2.5, lg: 5 } }}
    >
      <Breadcrumbs sx={{ mb: 2 }}>
        {breadcrumbs.map((crumb, index) => {
          const isCurrent = index === breadcrumbs.length - 1 || !crumb.to;
          return isCurrent ? (
            <Typography
              key={crumb.label}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            >
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={crumb.label}
              component={RouterLink}
              to={crumb.to as string}
              color="inherit"
              underline="hover"
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
      {disableContainer ? (
        children
      ) : (
        <Paper variant="outlined" sx={{ p: 3 }}>
          {children}
        </Paper>
      )}
    </Box>
  );
}
