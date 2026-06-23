import axios from 'axios';
import { env } from '@/config/env';

/**
 * Preconfigured axios instance. Import this everywhere instead of calling
 * axios directly so base URL, headers and interceptors stay consistent.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Centralized error normalization. Extend to attach auth tokens, refresh
// flows, or telemetry as needed.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
