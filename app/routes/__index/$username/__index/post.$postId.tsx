import type { Post, User } from '@prisma/client';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { PostModalLarge } from '~/components/PostModalLarge';
import { db } from '~/services/db.server';

interface LoaderData {
  username: string;
  postId: string;
  post: Post & {
    author: User;
  };
}

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { postId: parseInt(params.postId!) },
    include: {
      author: true,
    },
  });

  if (!post)
    throw new Response(`Post ${params.postId} not found.`, { status: 404 });

  const data: LoaderData = {
    username: params.username!,
    postId: params.postId!,
    post,
  };

  return json(data);
};

export default function PostDetails() {
  const navigate = useNavigate();
  const { username, post } = useLoaderData<LoaderData>();

  const handleClose = () => {
    navigate(`/${username}`);
  };

  return <PostModalLarge post={post} onClose={handleClose} open={true} />;
}
