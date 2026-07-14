import { Box, Divider, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface FormSectionProps {
  title: string;
  /** Optional leading icon shown in a circular badge next to the title. */
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * FormSection — a titled, bordered container grouping form fields. Header = a
 * circular icon badge + the section title, separated from the fields by a divider.
 * Fields lay out in 2 responsive columns (≥ md) that collapse to 1 on narrow
 * screens. Keep form action buttons OUTSIDE these sections.
 */
export function FormSection({ title, icon, children }: FormSectionProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="title4" color="primary">
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
