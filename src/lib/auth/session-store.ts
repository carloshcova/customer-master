import { jwtDecode } from 'jwt-decode';
import { useSyncExternalStore } from 'react';
import type { AuthToken, TokenParsed } from './types';

/**
 * Lightweight, framework-agnostic session store.
 *
 * The shell owns the source of truth (its redux-micro-frontend global store); this
 * is just a local mirror so React components (via `useSession`) AND non-React code
 * (the axios interceptor, via `getToken`) can read the current session. Built on
 * `useSyncExternalStore` to avoid pulling Redux into this MFE.
 */
export interface SessionState {
  token?: string;
  tokenDecoded: TokenParsed;
  isLogged: boolean;
  roles: string[];
}

const EMPTY: SessionState = {
  token: undefined,
  tokenDecoded: {},
  isLogged: false,
  roles: [],
};

let snapshot: SessionState = EMPTY;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function extractRoles(decoded: TokenParsed): string[] {
  const realmRoles = decoded.realm_access?.roles ?? [];
  const resourceRoles = Object.values(decoded.resource_access ?? {}).flatMap(
    (resource) => resource.roles ?? [],
  );
  return [...realmRoles, ...resourceRoles];
}

/** Decode a JWT access token. Roles (realm_access/resource_access) live on the
 * ACCESS token, not on the OIDC ID-token profile the shell puts in `tokenDecoded`. */
function decodeAccessToken(token?: string): TokenParsed {
  if (!token) return {};
  try {
    return jwtDecode<TokenParsed>(token);
  } catch {
    return {};
  }
}

/** Update the session from an `auth.clients[client]` entry published by the shell. */
export function setAuthFromClient(client: AuthToken): void {
  // The shell's `tokenDecoded` is the ID-token profile (name/email) and may lack
  // roles. Decode the ACCESS token for realm_access/resource_access and merge the
  // profile underneath for display claims.
  const tokenDecoded: TokenParsed = {
    ...(client.tokenDecoded ?? {}),
    ...decodeAccessToken(client.token),
  };
  snapshot = {
    token: client.token,
    tokenDecoded,
    isLogged: Boolean(client.token),
    roles: extractRoles(tokenDecoded),
  };
  emit();
}

// Framework-agnostic reads (used by the axios interceptor, outside React).
export const getSessionSnapshot = (): SessionState => snapshot;
export const getToken = (): string | undefined => snapshot.token;
export const getUserId = (): string | undefined => snapshot.tokenDecoded.sub;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** React hook exposing the current portal session (auth). */
export function useSession(): SessionState {
  return useSyncExternalStore(
    subscribe,
    getSessionSnapshot,
    getSessionSnapshot,
  );
}
