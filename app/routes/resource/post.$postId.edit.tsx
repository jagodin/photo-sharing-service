import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';

export const action: ActionFunction = async ({ request, params }) => {
  const { userId, isAdmin } = await authenticateUser(request);

  const postId = params.postId;

  if (!postId) throw new Response("Expected 'params.postId'", { status: 400 });

  const post = await db.post.findUnique({
    where: { postId: parseInt(postId) },
  });

  if (!post)
    throw new Response(`Post with ID ${postId} not found.`, { status: 400 });

  if (post.authorId !== userId && !isAdmin)
    throw new Response(`User unauthorized to edit Post with ID ${postId}.`, {
      status: 401,
    });

  const formData = await request.formData();
  const redirectTo = formData.get('redirectTo');
  const description = formData.get('description') as string;

  if (!redirectTo || !description)
    throw new Response("Expected 'redirectTo' and 'description' form entry.", {
      status: 400,
    });

  await db.post.update({
    where: { postId: parseInt(postId) },
    data: { description },
  });

  return redirect(redirectTo as string);
};
