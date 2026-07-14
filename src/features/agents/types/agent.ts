import { z } from 'zod';

/**
 * Agent entity — Zod schema is the single source of truth. `id` is the PK (uuid);
 * `agent_id` is a 3-letter business code.
 */
export const agentSchema = z.object({
  id: z.string(),
  agent_id: z.string().min(1, 'Requerido'),
  order_prefix: z.string(),
  agent_name: z.string().min(1, 'Requerido'),
  agent_fullname: z.string().min(1, 'Requerido'),
  agent_address: z.string(),
  tax_id: z.string(),
  agent_company: z.string(),
  agent_office: z.string(),
  active: z.boolean(),
});

export type Agent = z.infer<typeof agentSchema>;
