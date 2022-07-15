import { useEffect, useState } from 'react';
import {
  Alert,
  Container,
  Grid,
  Link,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import type { User } from '@prisma/client';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { AppLayout } from '~/components/AppLayout';
import { authenticateUser } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';
import type { Message } from '~/utils/types';

interface LoaderData {
  user: Omit<User, 'password' | 'email'>;
  message?: Message;
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateUser(request);

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  const message = session.get('message') as Message | undefined;

  const data: LoaderData = {
    user: await authenticateUser(request),
    message,
  };

  return json<LoaderData>(data, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
};

export default function Index() {
  const { user, message } = useLoaderData<LoaderData>();
  const [messageOpen, setMessageOpen] = useState(false);

  useEffect(() => {
    setMessageOpen(message ? true : false);
  }, [message]);

  const handleClose = () => {
    setMessageOpen(false);
  };

  return (
    <AppLayout user={user}>
      <Snackbar
        open={messageOpen}
        onClose={handleClose}
        autoHideDuration={4000}
      >
        <Alert onClose={handleClose} severity={message?.severity}>
          {message?.message}
        </Alert>
      </Snackbar>
      <Outlet />
    </AppLayout>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

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
