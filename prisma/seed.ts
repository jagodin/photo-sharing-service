import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import async from 'async';

import { createPosts, createUsers } from './data';

const prisma = new PrismaClient();

const seed = async () => {
  await clearData();
  const users = await createUsers();

  const userIds = await async.map(
    users,
    async (user: Prisma.UserCreateInput) => {
      return (await prisma.user.create({ data: user })).userId;
    }
  );

  await async.map(
    userIds,
    async (userId: number) =>
      await prisma.post.createMany({ data: createPosts(userId) })
  );
};

const clearData = async () => {
  await prisma.$transaction([
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};

const main = async () => {
  try {
    await seed();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
