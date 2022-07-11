import { Grid } from '@mui/material';
import type { User } from '@prisma/client';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import _ from 'lodash';

import { Feed } from '~/components/Feed';
import { FeedSideBar } from '~/components/FeedSideBar';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface LoaderData {
  posts: PostWithAuthorAndFavorites[];
  user: Omit<User, 'password' | 'email'>;
  suggestedUsers: Omit<User, 'password' | 'email'>[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticateUser(request);

  const suggestedUsers = (
    await db.user.findMany({
      where: { followers: { none: { followingId: user.userId } } },
      take: 8,
    })
  )
    .map((user) => _.omit(user, ['password', 'email']))
    .filter((u) => u.userId !== user.userId);

  const posts = (
    await db.post.findMany({
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
              followingId: user.userId,
            },
          },
        },
        approved: true,
      },
      take: 30,
    })
  ).map((post) => ({
    ...post,
    author: _.omit(post.author, ['password', 'email']),
    favorites: post.favorites.map((favorite) => ({
      ...favorite,
      user: _.omit(favorite.user, ['password', 'email']),
    })),
  }));

  const data: LoaderData = {
    posts,
    user,
    suggestedUsers,
  };

  return json(data);
};

export default function Index() {
  const { posts, user, suggestedUsers } = useLoaderData<LoaderData>();
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={12} md={8}>
        <Feed currentUser={user} posts={posts} />
      </Grid>
      <Grid item sm={0} md={4}>
        <FeedSideBar suggestedUsers={suggestedUsers} user={user} />
      </Grid>
    </Grid>
  );
}
