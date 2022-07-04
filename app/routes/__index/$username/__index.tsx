import { Divider, Grid } from '@mui/material';
import type { Post, User } from '@prisma/client';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import _ from 'lodash';

import { ProfileFeed } from '~/components/ProfileFeed';
import { ProfileHeader } from '~/components/ProfileHeader';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { userFollowsUser } from '~/services/follow.server';

interface LoaderData {
  user: Omit<User, 'password'>;
  followers: Omit<User, 'password'>[];
  following: Omit<User, 'password'>[];
  currentUserFollowing: boolean;
  currentUser: Omit<User, 'password'>;
  posts: (Post & {
    author: User;
  })[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const currentUser = await authenticateUser(request);

  if (!params.username)
    throw new Response(`Expected params.username`, { status: 500 });

  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: { posts: true },
      },
      followers: {
        include: {
          following: true,
        },
      },
      following: {
        include: {
          follower: true,
        },
      },
    },
  });

  if (!user)
    throw new Response(`${params.username} not found`, { status: 404 });

  const followers = user.followers.map((follower) =>
    _.omit(follower.following, 'password')
  );
  const following = user.following.map((following) =>
    _.omit(following.follower, 'password')
  );

  let posts: (Post & {
    author: User;
  })[] = [];

  if (user.userId == currentUser.userId || currentUser.isAdmin) {
    posts = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: { author: { userId: user.userId } },
      include: {
        author: true,
      },
    });
  } else {
    posts = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: { author: { userId: user.userId }, approved: true },
      include: {
        author: true,
      },
    });
  }

  const data: LoaderData = {
    user: _.omit(user, ['password', 'followers', 'following']),
    followers,
    following,
    currentUserFollowing: await userFollowsUser(currentUser, user),
    currentUser,
    posts,
  };
  return json(data);
};

export default function Profile() {
  const {
    user,
    currentUserFollowing,
    currentUser,
    posts,
    following,
    followers,
  } = useLoaderData<LoaderData>();

  return (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Outlet />
      <Grid item xs={12}>
        <ProfileHeader
          currentUser={currentUser}
          user={user}
          currentUserFollowing={currentUserFollowing}
          following={following}
          followers={followers}
          postCount={posts.length}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider flexItem />
      </Grid>
      <Grid item xs={12}>
        <ProfileFeed posts={posts} />
      </Grid>
    </Grid>
  );
}
