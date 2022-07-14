import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { seed } from 'prisma/seed';

import { isAuthenticatedForAPI } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const authenticated = await isAuthenticatedForAPI(request);

  if (authenticated) {
    try {
      console.info('Seeding database from API.');
      await seed();
    } catch (e) {
      console.error('There was an error seeding the database', e);
      return json({ success: false });
    }

    return json({ success: true });
  } else {
    return new Response('Unauthorized to access this route.', { status: 404 });
  }
};
