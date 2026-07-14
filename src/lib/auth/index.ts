/**
 * Public API for the portal auth/session integration. Import from `@/lib/auth`.
 */

export type { SessionState } from './session-store';
export {
  getSessionSnapshot,
  getToken,
  getUserId,
  useSession,
} from './session-store';
export { initGlobalStateSync } from './sync';
export type {
  AuthGlobalState,
  AuthToken,
  Configuration,
  TokenParsed,
} from './types';
