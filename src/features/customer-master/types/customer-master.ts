import { z } from 'zod';

/**
 * Customer master entity — Zod schema is the single source of truth. Nested
 * objects (address, port, security sensor + hard_tag, agent) are defined inline
 * so this feature stays independent (no cross-feature imports). Numeric values
 * are strings for now (mock). System ids / FKs are part of the schema but hidden
 * from the form (only business fields are edited).
 */
export const customerMasterSchema = z.object({
  customer_id: z.string(),
  customer_code: z.string().min(1, 'Requerido'),
  bu_corp_id: z.string(),
  customer_name: z.string().min(1, 'Requerido'),
  customer_legal_name: z.string(),
  status: z.string(),
  country_code: z.string(),
  currency_id: z.string(),
  customer_address: z.object({
    customer_address_id: z.string(),
    customer_id: z.string(),
    city_id: z.string(),
    country_code: z.string(),
    address_code: z.string(),
    address: z.string(),
    contact_email: z.string(),
    contact_name: z.string(),
    activity: z.string(),
    zip_code: z.string(),
    phone: z.string(),
    tax_id: z.string(),
  }),
  customer_port: z.object({
    id: z.string(),
    customer_id: z.string(),
    port_code: z.string(),
  }),
  security_sensor: z.object({
    id: z.string(),
    customer_id: z.string(),
    line_code: z.string(),
    sub_line_code: z.string(),
    class_code: z.string(),
    sub_class_code: z.string(),
    line_desc: z.string(),
    sub_line_desc: z.string(),
    class_desc: z.string(),
    sub_class_desc: z.string(),
    max_retail_price: z.string(),
    min_retail_price: z.string(),
    // hard_tag is a related entity referenced by security_sensor.hard_tag.hard_tag_id.
    hard_tag: z.object({
      hard_tag_id: z.string(),
      hard_tag_name: z.string(),
      hard_tag_price: z.string(),
    }),
  }),
  agents: z.object({
    id: z.string(), // random uuid (PK)
    agent_id: z.string(), // 3-letter code
    order_prefix: z.string(),
    agent_name: z.string(),
    agent_fullname: z.string(),
    agent_address: z.string(),
    tax_id: z.string(),
    agent_company: z.string(),
    agent_office: z.string(),
    active: z.boolean(),
  }),
});

export type CustomerMaster = z.infer<typeof customerMasterSchema>;
