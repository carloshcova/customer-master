import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { appConfig } from '@/config/app';
import { globalStore } from '@/lib/auth/global-store';
import type { Configuration } from '@/lib/auth/types';
import { cn } from './locales/cn';
import { en } from './locales/en';
import { es } from './locales/es';

export const SUPPORTED_LANGUAGES = ['es', 'en', 'cn'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Map the shell's language code (e.g. 'ES', 'en-CL', 'CN', 'zh') to one we ship. */
export function normalizeLanguage(code?: string): AppLanguage {
  const two = code?.toLowerCase().slice(0, 2);
  if (two === 'es') return 'es';
  if (two === 'cn' || two === 'zh') return 'cn';
  return 'en';
}

function readShellLanguage(): AppLanguage {
  const state = (
    globalStore as unknown as {
      GetGlobalState?: () => { configuration?: Configuration };
    }
  ).GetGlobalState?.();
  return normalizeLanguage(state?.configuration?.language);
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      cn: { translation: cn },
    },
    lng: readShellLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // Resources are bundled (sync init) and there is no <Suspense> boundary, so
    // disable Suspense to stay safe if a namespace is ever loaded async.
    react: { useSuspense: false },
    debug: process.env.NODE_ENV !== 'production',
  });

  // Keep the language synced with the portal for ANY mounted surface (App, Card,
  // MenuItem). A distinct subscriber id avoids clashing with the auth subscription.
  globalStore.SubscribeToPartnerState(
    `${appConfig.appName}:i18n`,
    appConfig.configStoreName,
    (config: Configuration) => {
      const next = normalizeLanguage(config?.language);
      if (next !== i18n.language) {
        i18n
          .changeLanguage(next)
          .catch((err) =>
            console.error('[mf-customer] i18n changeLanguage failed', err),
          );
      }
    },
  );
}

export default i18n;
