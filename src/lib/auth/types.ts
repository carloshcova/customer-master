/**
 * Local stand-ins for the shell's shared contract types.
 *
 * TODO: replace with imports from `@fbc/common-interfaces` once the private GCP
 * Artifact Registry (gcloud) is configured. Kept structurally compatible with
 * what the shell publishes so the swap is a pure import change.
 */

/** Decoded Keycloak JWT claims the portal exposes. */
export interface TokenParsed {
  sub?: string;
  name?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  [claim: string]: unknown;
}

/** One authenticated client entry inside the shell's `auth` partner state. */
export interface AuthToken {
  token?: string;
  idToken?: string;
  refreshToken?: string;
  isLogged?: boolean;
  tokenDecoded?: TokenParsed;
}

/** Shape of the shell's `auth` partner state (indexed by client id). */
export interface AuthGlobalState {
  clients?: Record<string, AuthToken>;
}

/** Shape of the shell's `configuration` partner state. */
export interface Configuration {
  language?: string;
  /** Sidebar drawer open/closed — drives the MenuItem label collapse. */
  openDrawer?: boolean;
  selectedTenant?: {
    commerce?: { name?: string };
    country?: { name?: string };
  };
  [key: string]: unknown;
}

/** Merged global state as returned by redux-micro-frontend's GetGlobalState. */
export interface GlobalState {
  auth?: AuthGlobalState;
  configuration?: Configuration;
  [partner: string]: unknown;
}
