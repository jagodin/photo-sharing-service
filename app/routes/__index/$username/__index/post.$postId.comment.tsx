import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { commentOnPost } from '~/services/posts.server';

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticateUser(request);
  const formData = await request.formData();

  const comment = formData.get('comment');

  const post = await db.post.findUnique({
    where: { postId: parseInt(params.postId!) },
  });

  if (!post)
    throw new Response(`Post with ID ${params.postId} not found.`, {
      status: 404,
    });

  await commentOnPost(user, post, comment);

  return redirect(`/${params.username}/post/${params.postId}`);
};
