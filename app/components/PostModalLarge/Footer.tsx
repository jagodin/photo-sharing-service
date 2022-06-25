import { Favorite, Send, Share } from '@mui/icons-material';
import { Grid, IconButton, Input, Stack, Tooltip } from '@mui/material';
import type { Favorites, Post, User } from '@prisma/client';
import { Form } from '@remix-run/react';

import { LikeGroup } from '../LikeGroup';

interface FooterProps {
  post: Post & {
    author: User;
    favorites: (Favorites & {
      user: User;
    })[];
  };
  currentUser: Omit<User, 'password'>;
}

export const Footer = ({ post, currentUser }: FooterProps) => {
  const postIsFavorited = post.favorites.some(
    (favorite) => favorite.user.username === currentUser.username
  );

  const baseUrl = `/${post.author.username}/post/${post.postId}`;
  const favoriteAction = postIsFavorited
    ? baseUrl + '/unfavorite'
    : baseUrl + '/favorite';

  return (
    <Grid container sx={{ padding: (theme) => theme.spacing(1, 2) }}>
      <Stack alignItems="center" direction="row">
        <Tooltip title={postIsFavorited ? 'Unfavorite' : 'Favorite'}>
          <Form method="post" action={favoriteAction}>
            <IconButton type="submit">
              <Favorite color={postIsFavorited ? 'error' : undefined} />
            </IconButton>
          </Form>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton>
            <Share />
          </IconButton>
        </Tooltip>
        <LikeGroup
          users={post.favorites.map((favorite) => favorite.user)}
          max={3}
        />
      </Stack>
      <Grid item xs={12}>
        <Input
          disableUnderline
          fullWidth
          placeholder="Add a comment..."
          endAdornment={
            <IconButton>
              <Send />
            </IconButton>
          }
        />
      </Grid>
    </Grid>
  );
};
