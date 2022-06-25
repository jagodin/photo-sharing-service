import type { Post, User } from '@prisma/client';

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

export const likePost = async (user: User, post: Post) =>
  await db.favorites.upsert({
    create: {
      user: { connect: { userId: user.userId } },
      post: { connect: { postId: post.postId } },
    },
    update: {
      user: { connect: { userId: user.userId } },
      post: { connect: { postId: post.postId } },
    },
    where: {
      userId_postId: {
        userId: user.userId,
        postId: post.postId,
      },
    },
  });

export const unlikePost = async (user: User, post: Post) =>
  await db.favorites.delete({
    where: {
      userId_postId: {
        userId: user.userId,
        postId: post.postId,
      },
    },
  });

export const commentOnPost = async (user: User, post: Post, content: string) =>
  await db.comment.create({
    data: {
      content,
      author: {
        connect: {
          userId: user.userId,
        },
      },
      post: {
        connect: {
          postId: post.postId,
        },
      },
    },
  });
