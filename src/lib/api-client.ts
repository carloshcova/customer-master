import axios from 'axios';
import { env } from '@/config/env';
import { getToken, getUserId } from '@/lib/auth';

/**
 * Preconfigured axios instance. Import this everywhere instead of calling
 * axios directly so base URL, headers and interceptors stay consistent.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the portal session token published by the shell (see `@/lib/auth`).
// Mirrors the sibling MFEs: `Authorization: Bearer <token>` + `X-userId`.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    const userId = getUserId();
    if (userId) config.headers.set('X-userId', userId);
  }
  return config;
});

// Centralized error normalization. Extend with refresh flows or telemetry.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
