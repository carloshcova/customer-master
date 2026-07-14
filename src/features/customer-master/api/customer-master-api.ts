import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomerMaster } from '../types/customer-master';

/** MOCK data + fake latency. Swap the `queryFn`/`mutationFn` bodies for the axios
 * client when the backend is ready — the hooks/keys stay the same. */
function makeCustomer(n: number): CustomerMaster {
  return {
    customer_id: String(n),
    customer_code: `CU-${String(n).padStart(3, '0')}`,
    bu_corp_id: `BU-${n}`,
    customer_name: `Cliente ${n}`,
    customer_legal_name: `Cliente ${n} S.A.`,
    status: n % 2 === 0 ? 'Activo' : 'Inactivo',
    country_code: 'CL',
    currency_id: 'CLP',
    customer_address: {
      customer_address_id: `ADDR${n}`,
      customer_id: String(n),
      city_id: 'STGO',
      country_code: 'CL',
      address_code: `AC${n}`,
      address: `Av. Siempre Viva ${n}`,
      contact_email: `cliente${n}@mail.cl`,
      contact_name: `Contacto ${n}`,
      activity: 'Retail',
      zip_code: String(8000 + n),
      phone: `+56 9 0000 00${n}`,
      tax_id: `${76000000 + n}-1`,
    },
    security_sensor: {
      id: `S${n}`,
      customer_id: String(n),
      line_code: `L${n}`,
      sub_line_code: `SL${n}`,
      class_code: `C${n}`,
      sub_class_code: `SC${n}`,
      line_desc: `Línea ${n}`,
      sub_line_desc: `Sub línea ${n}`,
      class_desc: `Clase ${n}`,
      sub_class_desc: `Sub clase ${n}`,
      max_retail_price: String(1000 + n),
      min_retail_price: String(500 + n),
      hard_tag: {
        hard_tag_id: `HT${n}`,
        hard_tag_name: `Tag ${n}`,
        hard_tag_price: String(10 + n),
      },
    },
    customer_port: {
      id: `P${n}`,
      customer_id: String(n),
      port_code: `PORT${n}`,
    },
    agents: {
      id: `agent-uuid-${n}`,
      agent_id: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR'][n - 1] ?? 'XYZ',
      order_prefix: `OP-${n}`,
      agent_name: `Agente ${n}`,
      agent_fullname: `Agente ${n} Apellido`,
      agent_address: `Dir ${n}`,
      tax_id: `${11111111 + n}-1`,
      agent_company: 'Servicenter',
      agent_office: 'La Florida',
      active: n % 2 === 0,
    },
  };
}

const MOCK_CUSTOMERS: CustomerMaster[] = Array.from({ length: 6 }, (_, i) =>
  makeCustomer(i + 1),
);

function withLatency<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

export const customerMasterKeys = {
  all: ['customer-master'] as const,
  detail: (id: string) => ['customer-master', id] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey: customerMasterKeys.all,
    queryFn: () => withLatency(MOCK_CUSTOMERS),
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: customerMasterKeys.detail(id ?? 'new'),
    queryFn: () =>
      withLatency(
        MOCK_CUSTOMERS.find((customer) => customer.customer_id === id) ?? null,
      ),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customer: CustomerMaster) => withLatency(customer),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: customerMasterKeys.all }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customer: CustomerMaster) => withLatency(customer),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: customerMasterKeys.all });
      queryClient.invalidateQueries({
        queryKey: customerMasterKeys.detail(customer.customer_id),
      });
    },
  });
}
