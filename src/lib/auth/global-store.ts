import { GlobalStore, type IGlobalStore } from 'redux-micro-frontend';
import { appConfig } from '@/config/app';

/**
 * The portal's single shared global store (redux-micro-frontend).
 *
 * `GlobalStore.Get` returns the SAME singleton the shell and every sibling MFE
 * use, so we read the session/configuration the shell publishes without importing
 * any sibling's code — the contract is the store name + action shape, by design.
 */
export const globalStore: IGlobalStore = GlobalStore.Get(appConfig.storeDebug);
