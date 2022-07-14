import { Avatar, Grid, Stack, Typography } from '@mui/material';
import type { User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

import { PostApprovedIcon } from '../PostApprovedIcon';
import { PostOptionsMenu } from '../PostOptionsMenu';

import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface HeaderProps {
  post: PostWithAuthorAndFavorites;
  currentUser: Omit<User, 'password' | 'email'>;
}

export const Header = ({ post, currentUser }: HeaderProps) => {
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate(`/${post.author.username}`);
  };

  return (
    <Grid
      sx={{ padding: (theme) => theme.spacing(1, 2) }}
      container
      justifyContent="space-between"
    >
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          sx={{ height: 30, width: 30 }}
          src={post.author.profilePicture || undefined}
          onClick={goToProfile}
        />
        <Typography onClick={goToProfile} fontWeight={600} variant="body2">
          {post.author.username}
        </Typography>
      </Stack>
      <Stack alignItems="center" direction="row" spacing={1}>
        <PostApprovedIcon post={post} />
        <PostOptionsMenu
          redirectAfterDelete={`/${post.author.username}`}
          post={post}
          currentUser={currentUser}
          redirectAfterEdit={`/${post.author.username}/post/${post.postId}`}
        />
      </Stack>
    </Grid>
  );
};
