import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { commentOnPost, deleteComment } from '~/services/posts.server';

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticateUser(request);
  const post = await db.post.findUnique({
    where: { postId: parseInt(params.postId!) },
  });

  const formData = await request.formData();
  const redirectTo = formData.get('redirectTo');

  if (!redirectTo)
    throw new Response("Expected 'redirectTo' in form data", { status: 400 });

  if (!post)
    throw new Response(`Post with ID ${params.postId} not found.`, {
      status: 404,
    });

  if (request.method === 'POST') {
    const comment = formData.get('comment') as string | null;

    if (!comment)
      throw new Response("Expected 'comment' in form data", { status: 400 });

    await commentOnPost(user, post, comment);
  } else if (request.method === 'DELETE') {
    const commentId = formData.get('commentId') as string | null;

    if (!commentId)
      throw new Response("Expected 'commentId' in form data", { status: 400 });

    await deleteComment(user, parseInt(commentId));
  }

  return redirect(redirectTo as string);
};
