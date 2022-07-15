import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import async from 'async';
import fs from 'fs';

import { createPosts, createUsers } from './data';

const prisma = new PrismaClient();

export const seed = async () => {
  await clearData();
  const users = await createUsers();

  const userIds = await async.map(
    users,
    async (user: Prisma.UserCreateInput) => {
      return (await prisma.user.create({ data: user })).userId;
    }
  );

  const postUrls = JSON.parse(
    fs.readFileSync('./prisma/data/photos.json', 'utf-8')
  ) as string[];

  await async.map(userIds, async (userId: number) => {
    await prisma.post.createMany({
      data: await createPosts(userId, postUrls),
    });
  });

  const postIds = (
    await prisma.post.findMany({ select: { postId: true } })
  ).map((post) => post.postId);

  const favorites = [];

  for (const userId of userIds) {
    for (const postId of postIds) {
      const rand = Math.random();

      if (rand < 0.5) {
        favorites.push({
          userId,
          postId,
        });
      }
    }
  }

  await prisma.favorites.createMany({
    data: favorites,
  });

  const follows = [];

  for (const followerId of userIds) {
    for (const followingId of userIds) {
      if (followerId === followingId) {
        continue;
      }

      const rand = Math.random();

      if (rand < 0.5) {
        follows.push({
          followerId,
          followingId,
        });
      }
    }
  }

  await prisma.follows.createMany({
    data: follows,
  });

  const user = await prisma.user.findFirst();

  console.info('Database successfully seeded\n');
  console.info(`Email: ${user?.email}`);
  console.info('Password: password');
};

const clearData = async () => {
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.favorites.deleteMany(),
    prisma.follows.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};

export const seedLocal = async () => {
  try {
    await seed();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
