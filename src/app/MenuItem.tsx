import {
  Box,
  Link,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
} from '@mui/material';
import * as React from 'react';
import { type MouseEvent, useEffect, useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { navigateToUrl } from 'single-spa';
import singleSpaReact from 'single-spa-react';
import groupIcon from '@/assets/group.svg';
import { appConfig } from '@/config/app';
import '@/config/i18n';
import { shellTheme } from '@/config/shell-theme';
import { globalStore } from '@/lib/auth/global-store';
import type { Configuration } from '@/lib/auth/types';

/**
 * Exposed via Module Federation as `./MenuItem` — the sidebar entry rendered inside
 * the portal layout drawer (mounted as a single-spa parcel). Its label collapses
 * with the drawer, driven by the shell's `configuration.openDrawer`. Uses the shell
 * (Poppins) theme.
 */
function MenuItem() {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const initial = (
      globalStore as unknown as {
        GetGlobalState?: () => { configuration?: Configuration };
      }
    ).GetGlobalState?.();
    setOpenDrawer(Boolean(initial?.configuration?.openDrawer));

    const unsubscribe = globalStore.SubscribeToPartnerState(
      `${appConfig.appName}:menu`,
      appConfig.configStoreName,
      (config: Configuration) => setOpenDrawer(Boolean(config?.openDrawer)),
    );
    return () => unsubscribe?.();
  }, []);

  const navigate = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigateToUrl(appConfig.basePath);
  };

  return (
    <ThemeProvider theme={shellTheme}>
      <ListItem
        component={Link}
        disablePadding
        href={appConfig.basePath}
        onClick={navigate}
        sx={{ display: 'block' }}
      >
        <ListItemButton
          sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: openDrawer ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <img src={groupIcon} alt="" width={30} height={30} />
          </ListItemIcon>
          <ListItemText
            primary={t('module.name')}
            sx={{ opacity: openDrawer ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>
    </ThemeProvider>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: MenuItem,
  errorBoundary() {
    return <Box role="alert">Failed to load the customer menu item.</Box>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

export default MenuItem;
