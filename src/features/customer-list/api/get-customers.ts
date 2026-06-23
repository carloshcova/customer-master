import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Customer } from '../types/customer';

/** Stable query key for the customers list. */
export const customersQueryKey = ['customers'] as const;

async function fetchCustomers(): Promise<Customer[]> {
  const { data } = await apiClient.get<Customer[]>('/customers');
  return data;
}

/**
 * Server-state hook for the customers list. Uses TanStack Query for caching,
 * dedup and background refetch — never fetch with a manual `useEffect`.
 */
export function useCustomers() {
  return useQuery({
    queryKey: customersQueryKey,
    queryFn: fetchCustomers,
  });
}
