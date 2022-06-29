import type { User } from '@prisma/client';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { AppLayout } from '~/components/AppLayout';
import { authenticateUser } from '~/services/auth.server';

interface LoaderData {
  user: Omit<User, 'password'>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    user: await authenticateUser(request),
  };

  return json(data);
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <AppLayout user={user}>
      <Outlet />
    </AppLayout>
  );
}
