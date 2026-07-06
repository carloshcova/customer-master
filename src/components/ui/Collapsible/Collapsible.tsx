import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  type AccordionProps,
  AccordionSummary,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface CollapsibleProps
  extends Omit<AccordionProps, 'children' | 'title'> {
  /** Header shown in the summary row. */
  title: ReactNode;
  /** Content revealed when expanded. */
  children: ReactNode;
}

/**
 * Collapsible (molecule) — an accordion panel that hides/reveals content. Wraps
 * MUI Accordion (outlined, chevron indicator). Control with `expanded` +
 * `onChange`, or use `defaultExpanded`.
 */
export function Collapsible({ title, children, ...props }: CollapsibleProps) {
  return (
    <Accordion variant="outlined" disableGutters {...props}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {title}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
