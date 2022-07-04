import { Grid } from '@mui/material';
import type { Prisma, User } from '@prisma/client';
import { Outlet } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import _ from 'lodash';

import { Feed } from '~/components/Feed';
import { FeedSideBar } from '~/components/FeedSideBar';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { getPosts } from '~/services/posts.server';

interface LoaderData {
  posts: Prisma.PromiseReturnType<typeof getPosts>;
  user: Omit<User, 'password'>;
  suggestedUsers: Omit<User, 'password'>[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticateUser(request);

  const suggestedUsers = (
    await db.user.findMany({
      where: { followers: { none: { followingId: user.userId } } },
      take: 8,
    })
  )
    .map((user) => _.omit(user, 'password'))
    .filter((u) => u.userId !== user.userId);

  const data: LoaderData = {
    posts: await getPosts(user.userId),
    user,
    suggestedUsers,
  };

  return json(data);
};

export default function Index() {
  const { posts, user, suggestedUsers } = useLoaderData<LoaderData>();
  return (
    <Grid container spacing={3}>
      <Outlet />
      <Grid item xs={12} sm={12} md={8}>
        <Feed currentUser={user} posts={posts} />
      </Grid>
      <Grid item sm={0} md={4}>
        <FeedSideBar suggestedUsers={suggestedUsers} user={user} />
      </Grid>
    </Grid>
  );
}
