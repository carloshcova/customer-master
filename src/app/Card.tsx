import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Paper,
  ThemeProvider,
  Typography,
} from '@mui/material';
import type { MouseEvent } from 'react';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { navigateToUrl } from 'single-spa';
import singleSpaReact from 'single-spa-react';
import groupIcon from '@/assets/group.svg';
import { appConfig } from '@/config/app';
import '@/config/i18n';
import { shellTheme } from '@/config/shell-theme';

/**
 * Exposed via Module Federation as `./Card` — the access card rendered on the
 * portal HOME grid (mounted by the shell as a single-spa parcel). Uses the shell
 * (Poppins) theme so it blends with the portal; clicking routes to this MFE.
 */
function Card() {
  const { t } = useTranslation();

  const navigate = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigateToUrl(appConfig.basePath);
  };

  return (
    <ThemeProvider theme={shellTheme}>
      <Paper
        variant="outlined"
        square
        elevation={0}
        sx={{ width: 250, height: 250 }}
      >
        <CardActionArea
          href={appConfig.basePath}
          onClick={navigate}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 3,
          }}
        >
          <CardMedia
            component="img"
            image={groupIcon}
            alt=""
            sx={{ width: 64, height: 64 }}
          />
          <CardContent sx={{ p: 0 }}>
            <Typography
              component="h2"
              sx={{ textAlign: 'center', fontWeight: 700 }}
            >
              {t('module.name')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Paper>
    </ThemeProvider>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Card,
  errorBoundary() {
    return <Box role="alert">Failed to load the customer card.</Box>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

export default Card;
