import type { ActionFunction } from '@remix-run/server-runtime';

import { authenticator } from '~/services/auth.server';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/login' });
};
