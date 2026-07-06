import createCache from '@emotion/cache';

/**
 * Isolated Emotion cache for this microfrontend.
 *
 * When the host shell also uses Emotion/MUI, a single shared `<head>` with two
 * Emotion instances causes style-injection-order wars (base MUI styles can
 * override our theme). Giving this remote its own cache fixes that:
 *
 * - `key: 'mfc'`  → our class names are namespaced (`mfc-…`), no collisions.
 * - `prepend`     → our styles inject first, so the order is deterministic.
 * - `nonce`       → lets a strict host CSP (no `unsafe-inline`) allow our styles.
 *
 * Almost zero cost: `@emotion/cache` already ships inside `@emotion/react`; we
 * just provide our own instance instead of Emotion's default.
 */
function readCspNonce(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  // Host may expose a nonce via <meta property="csp-nonce" content="…"> (or set
  // `window.__CSP_NONCE__`). Absent → no nonce (fine when CSP isn't strict).
  const fromMeta = document.querySelector<HTMLMetaElement>(
    'meta[property="csp-nonce"]',
  )?.content;
  const fromWindow = (window as unknown as { __CSP_NONCE__?: string })
    .__CSP_NONCE__;
  return fromMeta || fromWindow || undefined;
}

export const emotionCache = createCache({
  key: 'mfc',
  prepend: true,
  nonce: readCspNonce(),
});
