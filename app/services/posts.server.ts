import { db } from './db.server';

export const getPosts = async () =>
  await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
