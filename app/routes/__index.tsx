import { Outlet } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';

import { AppLayout } from '~/components/AppLayout';
import { authenticateUser } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticateUser(request);
};

export default function Index() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
