import type { User } from '@prisma/client';

import { db } from './db.server';

export const userFollowsUser = async (
  user: Omit<User, 'password'>,
  follows: Omit<User, 'password'>
) => {
  const following = await db.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: follows.userId,
        followingId: user.userId,
      },
    },
  });

  return following ? true : false;
};

export const followUser = async (
  user: Omit<User, 'password'>,
  followingUsername: string
) => {
  const following = await db.user.findUnique({
    where: { username: followingUsername },
  });

  if (!following)
    return new Response(`User with username ${followingUsername} not found`, {
      status: 404,
    });
  console.log(`${user.username} wants to follow ${following.username}`);

  await db.follows.upsert({
    create: {
      follower: { connect: { userId: following.userId } },
      following: { connect: { userId: user.userId } },
    },
    update: {
      follower: { connect: { userId: following.userId } },
      following: { connect: { userId: user.userId } },
    },
    where: {
      followerId_followingId: {
        followerId: following.userId,
        followingId: user.userId,
      },
    },
  });
};

export const unfollowUser = async (
  user: Omit<User, 'password'>,
  followingUsername: string
) => {
  const following = await db.user.findUnique({
    where: { username: followingUsername },
  });

  if (!following)
    return new Response(`User with username ${followingUsername} not found`, {
      status: 404,
    });

  await db.follows.delete({
    where: {
      followerId_followingId: {
        followerId: following.userId,
        followingId: user.userId,
      },
    },
  });
};
