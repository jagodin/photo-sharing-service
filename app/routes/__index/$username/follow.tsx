import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { followUser } from '~/services/follow.server';

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticateUser(request);
  const formData = await request.formData();

  await followUser(user, params.username!);

  return redirect(formData.get('redirectTo') as string);
};
