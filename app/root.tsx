import type { PropsWithChildren } from 'react';
import {
  Alert,
  Container,
  createTheme,
  Grid,
  Link,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

export const links: LinksFunction = () => {
  return [{ rel: 'icon', href: '/_static/favicon.ico' }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Photo Sharing Service',
  viewport: 'width=device-width,initial-scale=1',
});

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}

const Document = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, backgroundColor: '#f9f9f9' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const databaseError = error.message.includes("Can't reach database");

  return (
    <Container maxWidth="md">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ pt: '80px' }}
      >
        <Alert
          severity={databaseError ? 'warning' : 'error'}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {databaseError ? (
            <Typography variant="body1">
              This application uses an{' '}
              <Link
                underline="hover"
                href="https://aws.amazon.com/rds/aurora/serverless/"
                target="_blank"
              >
                Amazon Aurora Serverless
              </Link>{' '}
              database which means it is optimized for infrequent use. It has a
              "cold start" time and may take a few seconds for it to turn on.
              Keep refreshing this page to view the application.
            </Typography>
          ) : (
            <Stack spacing={2}>
              <Typography variant="body1">
                Oops, something went wrong!
              </Typography>
              <Typography variant="body1">{error.message}</Typography>
            </Stack>
          )}
        </Alert>
      </Grid>
    </Container>
  );
};
