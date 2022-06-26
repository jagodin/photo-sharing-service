import type { User } from '@prisma/client';
import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { unlikePost } from '~/services/posts.server';

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const redirectTo = formData.get('redirectTo');

  if (!redirectTo)
    throw new Response("Expected 'redirectTo' in form data", { status: 400 });

  const user = await authenticateUser(request);

  const post = await db.post.findUnique({
    where: { postId: parseInt(params.postId!) },
  });

  if (!post)
    throw new Response(`Post with ID ${params.postId} not found.`, {
      status: 404,
    });

  await unlikePost(user as User, post);

  return redirect(redirectTo as string);
};
