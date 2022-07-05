import { Send } from '@mui/icons-material';
import { Grid, IconButton, Input, Stack } from '@mui/material';
import type { Favorites, Post, User } from '@prisma/client';
import { Form, useLocation } from '@remix-run/react';

import { FavoriteButton } from '../FavoriteButton';
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

export const PostFooter = ({ post, currentUser }: FooterProps) => {
  const baseUrl = `/${post.author.username}/post/${post.postId}`;
  const location = useLocation();

  return (
    <Grid container sx={{ padding: (theme) => theme.spacing(1, 2) }} rowGap={1}>
      <Stack alignItems="center" direction="row" spacing={1}>
        <FavoriteButton post={post} currentUser={currentUser} />
        <LikeGroup
          users={post.favorites.map((favorite) => favorite.user)}
          max={3}
        />
      </Stack>
      <Grid item xs={12}>
        <Form method="post" action={`${baseUrl}/comment`}>
          <Input
            disableUnderline
            fullWidth
            placeholder="Add a comment..."
            endAdornment={
              <IconButton type="submit">
                <Send />
              </IconButton>
            }
            name="comment"
          />
          <input hidden readOnly value={location.pathname} name="redirectTo" />
        </Form>
      </Grid>
    </Grid>
  );
};
