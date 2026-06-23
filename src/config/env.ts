/**
 * Typed, centralized access to runtime configuration.
 *
 * Only `PUBLIC_*` variables are inlined into the client bundle by Rsbuild.
 * NEVER read secrets here — anything referenced ends up in the shipped JS.
 */
export interface AppEnv {
  /** Base URL for the customer API (axios `baseURL`). */
  apiBaseUrl: string;
}

export const env: AppEnv = {
  apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? '/api',
};
