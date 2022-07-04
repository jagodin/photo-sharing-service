import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticateUser(request);

  if (!user.isAdmin)
    throw new Response('Only admins can approve posts.', { status: 401 });

  const postId = params.postId;

  if (!postId) throw new Response("Expected 'params.postId'", { status: 400 });

  const formData = await request.formData();
  const redirectTo = formData.get('redirectTo');

  if (!redirectTo)
    throw new Response("Expected 'redirectTo' form entry.", { status: 400 });

  await db.post.update({
    where: { postId: parseInt(postId) },
    data: { approved: true },
  });

  return redirect(redirectTo as string);
};
