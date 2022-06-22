import { Outlet } from '@remix-run/react';

import { AppLayout } from '~/components/AppLayout';

export default function Index() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
