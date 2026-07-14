import { Box, Card, CardActionArea, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { tokens } from '@/config/tokens';

export interface NavCardProps {
  title: string;
  /** Illustration/icon shown in the circular badge. */
  icon: ReactNode;
  /** Relative route to navigate to (React Router). */
  to: string;
}

/**
 * NavCard (molecule) — a clickable card that navigates to a section. Icon inside
 * a circular badge with the title below. Links via React Router (relative path).
 */
export function NavCard({ title, icon, to }: NavCardProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%', aspectRatio: '1' }}>
      <CardActionArea
        component={RouterLink}
        to={to}
        sx={{
          height: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            backgroundColor: tokens.color.neutral['02'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ textAlign: 'center' }}
        >
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
