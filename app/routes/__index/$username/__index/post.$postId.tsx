import type { Comment, User } from '@prisma/client';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import _ from 'lodash';

import { PostModalLarge } from '~/components/PostModalLarge';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { sessionStorage } from '~/services/session.server';
import type { Message, PostWithAuthorAndFavorites } from '~/utils/types';

interface LoaderData {
  username: string;
  postId: string;
  post: PostWithAuthorAndFavorites & {
    comments: (Comment & {
      author: Omit<User, 'password' | 'email'>;
    })[];
  };
  currentUser: Omit<User, 'password' | 'email'>;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const currentUser = await authenticateUser(request);
  const post = await db.post.findUnique({
    where: { postId: parseInt(params.postId!) },
    include: {
      author: true,
      favorites: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  if (!post)
    throw new Response(`Post ${params.postId} not found.`, { status: 404 });

  if (!post.approved && !currentUser.isAdmin) {
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );

    session.flash('message', {
      severity: 'error',
      message: `Post with ID ${params.postId} hasn't been approved yet.`,
    } as Message);

    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }

  const data: LoaderData = {
    username: params.username!,
    postId: params.postId!,
    post: {
      ...post,
      favorites: post.favorites.map((favorite) => ({
        ...favorite,
        user: _.omit(favorite.user, ['email', 'password']),
      })),
      author: _.omit(post.author, ['email', 'password']),
      comments: post.comments.map((comment) => ({
        ...comment,
        author: _.omit(comment.author, ['email', 'password']),
      })),
    },
    currentUser,
  };

  return json(data);
};

export default function PostDetails() {
  const navigate = useNavigate();
  const { username, post, currentUser } = useLoaderData<LoaderData>();

  const handleClose = () => {
    navigate(`/${username}`);
  };

  return (
    <PostModalLarge
      currentUser={currentUser}
      post={post}
      onClose={handleClose}
      open={true}
    />
  );
}
