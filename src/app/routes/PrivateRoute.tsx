import type { ReactNode } from 'react';
import { useSession } from '@/lib/auth';

/**
 * Gates content behind the portal session.
 *
 * - `bypass` (standalone dev) renders children regardless — there is no shell to
 *   authenticate against locally.
 * - When not logged and not bypassed we render nothing; the shell owns the
 *   redirect to the login flow, exactly like the sibling MFEs (home/profile).
 */
export function PrivateRoute({
  children,
  bypass = false,
}: {
  children: ReactNode;
  bypass?: boolean;
}) {
  const { isLogged } = useSession();
  if (bypass || isLogged) return <>{children}</>;
  return null;
}
