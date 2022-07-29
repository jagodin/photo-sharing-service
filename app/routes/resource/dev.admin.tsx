import type { ActionFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { isAuthenticatedForAPI } from '~/services/auth.server';
import { db } from '~/services/db.server';

export const action: ActionFunction = async ({ request }) => {
  const authenticated = await isAuthenticatedForAPI(request);

  if (!authenticated) {
    return new Response('Unauthorized to access this route.', { status: 401 });
  }

  const body = await request.json();
  const email = body.email;

  if (!email) {
    return new Response("Expected 'body.email'", { status: 400 });
  }

  try {
    await db.user.update({ where: { email }, data: { isAdmin: true } });

    return json({ success: true });
  } catch (e) {
    console.error('An has occurred while granting admin rights to a user', e);

    if ((e as Error).message.includes('Record to update not found')) {
      return new Response(`User with email ${email} not found.`, {
        status: 404,
      });
    }

    return new Response(
      'An has occurred while granting admin rights to a user',
      { status: 500 }
    );
  }
};
