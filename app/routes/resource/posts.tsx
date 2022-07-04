import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import type { PostWithAuthorAndFavorites } from '~/utils/types';

export interface PostsLoaderData {
  posts: PostWithAuthorAndFavorites[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = await authenticateUser(request);

  const url = new URL(request.url);
  const take = url.searchParams.get('take');
  const cursor = url.searchParams.get('cursor');

  if (!take || !cursor)
    throw new Response('Missing URL Search Params: take and cursor', {
      status: 400,
    });

  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      favorites: {
        include: {
          user: true,
        },
      },
    },
    where: {
      author: {
        followers: {
          some: {
            followingId: userId,
          },
        },
      },
    },
    take: parseInt(take),
    cursor: {
      postId: parseInt(cursor),
    },
    skip: 1,
  });

  return json<PostsLoaderData>({ posts });
};
