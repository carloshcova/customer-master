import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Agent } from '../types/agent';

/**
 * MOCK data + fake latency. Swap the `queryFn`/`mutationFn` bodies for the axios
 * client when the backend is ready — the hooks/keys stay the same.
 */
const CODES = [
  'ABC',
  'DEF',
  'GHI',
  'JKL',
  'MNO',
  'PQR',
  'STU',
  'VWX',
  'YZA',
  'BCD',
  'EFG',
  'HIJ',
];
const COMPANIES = ['Servicenter', 'Tec Support', 'Electro Tech'];
const OFFICES = ['La Florida', 'Ñuñoa', 'Valdivia', 'Arica', 'Maipú'];

function makeAgent(n: number): Agent {
  return {
    id: `agent-uuid-${n}`,
    agent_id: CODES[n - 1] ?? 'XYZ',
    order_prefix: `OP-${n}`,
    agent_name: `Agente ${n}`,
    agent_fullname: `Agente ${n} Apellido`,
    agent_address: `Dirección ${n}`,
    tax_id: `${11111111 + n}-1`,
    agent_company: COMPANIES[n % COMPANIES.length],
    agent_office: OFFICES[n % OFFICES.length],
    active: n % 2 === 0,
  };
}

const MOCK_AGENTS: Agent[] = Array.from({ length: 12 }, (_, i) =>
  makeAgent(i + 1),
);

function withLatency<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

export const agentsKeys = {
  all: ['agents'] as const,
  detail: (id: string) => ['agents', id] as const,
};

export function useAgents() {
  return useQuery({
    queryKey: agentsKeys.all,
    queryFn: () => withLatency(MOCK_AGENTS),
  });
}

export function useAgent(id?: string) {
  return useQuery({
    queryKey: agentsKeys.detail(id ?? 'new'),
    queryFn: () =>
      withLatency(MOCK_AGENTS.find((agent) => agent.id === id) ?? null),
    enabled: Boolean(id),
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agent: Agent) => withLatency(agent),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: agentsKeys.all }),
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agent: Agent) => withLatency(agent),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.all });
      queryClient.invalidateQueries({ queryKey: agentsKeys.detail(agent.id) });
    },
  });
}
