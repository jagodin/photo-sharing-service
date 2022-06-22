import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { unfollowUser } from '~/services/follow.server';

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticateUser(request);

  await unfollowUser(user, params.username!);

  return redirect(`/${params.username}`);
};
