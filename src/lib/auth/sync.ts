import { appConfig } from '@/config/app';
import { globalStore } from './global-store';
import { getToken, setAuthFromClient } from './session-store';
import type { AuthGlobalState, AuthToken, GlobalState } from './types';

/** Apply a client entry only when its token actually changed — avoids redundant
 * store emits / double initial renders when seeding from both the payload and the
 * current global state. */
function applyClientIfChanged(client?: AuthToken): void {
  if (client?.token && client.token !== getToken()) {
    setAuthFromClient(client);
  }
}

/**
 * Bridges the shell's shared `auth` partner state into our local session store:
 *  - seeds from the mount `payload` (single-spa customProps — only dev/standalone;
 *    the portal does NOT pass customProps to dynamic apps),
 *  - seeds from the current global state (the shell logs in before we mount),
 *  - subscribes to the `auth` partner state for live token updates.
 *
 * Language sync lives in `@/config/i18n` (it must work for Card/MenuItem too, not
 * only when the full App is mounted). Returns an unsubscribe cleanup.
 */
export function initGlobalStateSync(initialAuth?: AuthToken): () => void {
  applyClientIfChanged(initialAuth);

  // `GetGlobalState` returns `any` on the published interface — read it defensively.
  const current = (
    globalStore as unknown as { GetGlobalState?: () => GlobalState }
  ).GetGlobalState?.();
  applyClientIfChanged(current?.auth?.clients?.[appConfig.authClient]);

  const unsubscribeAuth = globalStore.SubscribeToPartnerState(
    appConfig.appName,
    appConfig.authStoreName,
    (auth: AuthGlobalState) =>
      applyClientIfChanged(auth?.clients?.[appConfig.authClient]),
  );

  return () => {
    unsubscribeAuth?.();
  };
}
