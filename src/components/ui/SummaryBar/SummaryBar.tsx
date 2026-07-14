import { Box, Divider, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface SummaryItem {
  label: string;
  value: ReactNode;
}

export interface SummaryBarProps {
  /** Key/value totals shown left-to-right, separated by dividers. */
  items: SummaryItem[];
  /** Optional right-aligned action (e.g. a create Button). */
  action?: ReactNode;
}

/**
 * SummaryBar (organism) — a bordered strip of totalizations (label + value) with
 * an optional right-aligned action. Responsive: items and the action wrap on
 * narrow screens; the vertical dividers hide when stacked.
 */
export function SummaryBar({ items, action }: SummaryBarProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          flexGrow: 1,
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
            }}
          >
            {index > 0 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', sm: 'block' } }}
              />
            )}
            <Box>
              <Typography variant="body3" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {action}
    </Paper>
  );
}
