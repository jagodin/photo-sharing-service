import { Avatar, Grid, Stack, Typography } from '@mui/material';
import type { Post, User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

import { PostOptionsMenu } from '../PostOptionsMenu';

interface HeaderProps {
  post: Post & {
    author: User;
  };
  currentUser: Omit<User, 'password'>;
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
      <PostOptionsMenu post={post} currentUser={currentUser} />
    </Grid>
  );
};
