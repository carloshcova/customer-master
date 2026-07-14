import { z } from 'zod';

/** Security sensor entity — Zod schema is the single source of truth. */
export const securitySensorSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  line_code: z.string().min(1, 'Requerido'),
  sub_line_code: z.string(),
  class_code: z.string(),
  sub_class_code: z.string(),
  line_desc: z.string(),
  sub_line_desc: z.string(),
  class_desc: z.string(),
  sub_class_desc: z.string(),
  // Prices kept as strings for now (mock). Refine to numbers with proper
  // valueAsNumber handling in the UX polish phase.
  max_retail_price: z.string(),
  min_retail_price: z.string(),
  hard_tag: z.object({
    hard_tag_id: z.string(),
    hard_tag_name: z.string(),
    hard_tag_price: z.string(),
  }),
});

export type SecuritySensor = z.infer<typeof securitySensorSchema>;
