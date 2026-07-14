import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SecuritySensor } from '../types/security-sensor';

/** MOCK data + fake latency. Swap the `queryFn`/`mutationFn` bodies for the axios
 * client when the backend is ready — the hooks/keys stay the same. */
const MOCK_SENSORS: SecuritySensor[] = Array.from({ length: 9 }, (_, index) => {
  const n = index + 1;
  return {
    id: String(n),
    customer_id: String(n),
    line_code: `L${100 + n}`,
    sub_line_code: `SL${n}`,
    class_code: `C${200 + n}`,
    sub_class_code: `SC${n}`,
    line_desc: `Línea ${n}`,
    sub_line_desc: `Sub línea ${n}`,
    class_desc: `Clase ${n}`,
    sub_class_desc: `Sub clase ${n}`,
    max_retail_price: String(1000 + n * 100),
    min_retail_price: String(500 + n * 50),
    hard_tag: {
      hard_tag_id: `HT${n}`,
      hard_tag_name: `Hard tag ${n}`,
      hard_tag_price: String(10 + n),
    },
  };
});

function withLatency<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

export const securitySensorKeys = {
  all: ['security-sensors'] as const,
  detail: (id: string) => ['security-sensors', id] as const,
};

export function useSecuritySensors() {
  return useQuery({
    queryKey: securitySensorKeys.all,
    queryFn: () => withLatency(MOCK_SENSORS),
  });
}

export function useSecuritySensor(id?: string) {
  return useQuery({
    queryKey: securitySensorKeys.detail(id ?? 'new'),
    queryFn: () =>
      withLatency(MOCK_SENSORS.find((sensor) => sensor.id === id) ?? null),
    enabled: Boolean(id),
  });
}

export function useCreateSecuritySensor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sensor: SecuritySensor) => withLatency(sensor),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: securitySensorKeys.all }),
  });
}

export function useUpdateSecuritySensor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sensor: SecuritySensor) => withLatency(sensor),
    onSuccess: (sensor) => {
      queryClient.invalidateQueries({ queryKey: securitySensorKeys.all });
      queryClient.invalidateQueries({
        queryKey: securitySensorKeys.detail(sensor.id),
      });
    },
  });
}
