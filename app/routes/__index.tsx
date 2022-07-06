import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
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
