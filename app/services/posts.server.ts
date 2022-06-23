import { db } from './db.server';

export const getPosts = async () =>
  await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

export const getUsersPosts = async (username: string) =>
  await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    where: { author: { username } },
    include: {
      author: true,
    },
  });
