import type { Post, User } from '@prisma/client';

import { db } from './db.server';

export const getPosts = async (
  userId: number,
  take: number,
  cursorId: number
) =>
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
            followingId: userId,
          },
        },
      },
    },
    take,
    cursor: {
      postId: cursorId,
    },
  });

export const likePost = async (user: User, post: Post) =>
  await db.$transaction([
    db.favorites.upsert({
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
    }),
    db.notification.create({
      data: {
        type: 'LIKE',
        userId: post.authorId,
        originUserId: user.userId,
        postId: post.postId,
      },
    }),
  ]);

export const unlikePost = async (user: User, post: Post) =>
  await db.favorites.delete({
    where: {
      userId_postId: {
        userId: user.userId,
        postId: post.postId,
      },
    },
  });

export const commentOnPost = async (
  user: Omit<User, 'password'>,
  post: Post,
  content: string
) =>
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

export const deleteComment = async (
  user: Omit<User, 'password'>,
  commentId: number
) => {
  const comment = await db.comment.findUnique({ where: { commentId } });

  if (!comment)
    throw new Response(`Comment with ID ${commentId} not found.`, {
      status: 404,
    });

  if (user.userId !== comment.authorId)
    throw new Response(
      `User unauthorized to delete Comment with ID ${commentId}.`,
      { status: 401 }
    );

  await db.comment.delete({
    where: {
      commentId: comment.commentId,
    },
  });
};
