import type { LoaderFunction } from '@remix-run/server-runtime';

import { AppLayout } from '~/components/AppLayout';
import { authenticateUser } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return authenticateUser(request);
};

export default function Index() {
  return (
    <AppLayout>
      <h1>Photo Sharing Service</h1>
    </AppLayout>
  );
}
