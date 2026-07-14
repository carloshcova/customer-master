/**
 * Portal integration constants.
 *
 * `appName` is this MFE's subscriber id in the shell's shared global store; the
 * store/client names MUST match what the shell's authentication & configuration
 * MFEs publish. Values mirror the working `home` sibling (partner state "auth",
 * client "portal", configuration partner "configuration").
 */
export const appConfig = {
  /** MF remote name / subscriber id for redux-micro-frontend. */
  appName: 'mf_customer',
  /** Partner state published by the shell's authentication MFE. */
  authStoreName: 'auth',
  /** Partner state published by the shell's configuration MFE. */
  configStoreName: 'configuration',
  /** Client key inside `auth.clients` used by the portal. */
  authClient: 'portal',
  /** redux-micro-frontend verbose logging. */
  storeDebug: false,
  /** Route prefix this MFE mounts under (single-spa activeWhen / Router basename). */
  basePath: '/customer-master',
} as const;
