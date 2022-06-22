import { Divider, Grid } from '@mui/material';
import type { User } from '@prisma/client';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import _ from 'lodash';

import { ProfileHeader } from '~/components/ProfileHeader';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { userFollowsUser } from '~/services/follow.server';

interface LoaderData {
  user: Omit<
    User & {
      _count: {
        posts: number;
        followers: number;
        following: number;
      };
    },
    'password'
  >;
  currentUserFollowing: boolean;
  currentUser: Omit<User, 'password'>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const currentUser = await authenticateUser(request);

  if (!params.username)
    throw new Response(`Expected params.username`, { status: 500 });

  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: { posts: true, followers: true, following: true },
      },
    },
  });

  if (!user)
    throw new Response(`${params.username} not found`, { status: 404 });

  const data: LoaderData = {
    user: _.omit(user, 'password'),
    currentUserFollowing: await userFollowsUser(currentUser, user),
    currentUser,
  };
  return json(data);
};

export default function Profile() {
  const { user, currentUserFollowing, currentUser } =
    useLoaderData<LoaderData>();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ProfileHeader
          currentUser={currentUser}
          user={user}
          currentUserFollowing={currentUserFollowing}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider flexItem />
      </Grid>
    </Grid>
  );
}
