import { Favorite } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import type { Favorites, Post, User } from '@prisma/client';
import { Form, useLocation } from '@remix-run/react';

interface FavoriteButtonProps {
  post: Post & {
    author: User;
    favorites: (Favorites & {
      user: User;
    })[];
  };
  currentUser: Omit<User, 'password'>;
}

export const FavoriteButton = ({ post, currentUser }: FavoriteButtonProps) => {
  const location = useLocation();

  const postIsFavorited = post.favorites.some(
    (favorite) => favorite.user.username === currentUser.username
  );

  const baseUrl = `/${post.author.username}/post/${post.postId}`;
  const favoriteAction = postIsFavorited
    ? baseUrl + '/unfavorite'
    : baseUrl + '/favorite';

  return (
    <Tooltip title={postIsFavorited ? 'Unfavorite' : 'Favorite'}>
      <Form method="post" action={favoriteAction}>
        <IconButton type="submit">
          <Favorite color={postIsFavorited ? 'error' : undefined} />
        </IconButton>
        <input readOnly hidden value={location.pathname} name="redirectTo" />
      </Form>
    </Tooltip>
  );
};
