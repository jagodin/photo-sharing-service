import { MoreHoriz, Settings } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { User } from '@prisma/client';
import { Form } from '@remix-run/react';

interface ProfileHeaderProps {
  user: Omit<
    User & {
      _count: {
        posts: number;
        followers: number;
        following: number;
      };
    },
    'password'
  >;
  currentUserFollowing: boolean;
  currentUser: Omit<User, 'password'>;
}

export const ProfileHeader = ({
  user,
  currentUserFollowing,
  currentUser,
}: ProfileHeaderProps) => {
  const currentUserProfile = currentUser.username == user.username;
  return (
    <Grid container alignItems="center" spacing={4}>
      <Grid item xs={2}>
        <Avatar
          sx={{ width: 'auto', height: 'auto', fontSize: 140 }}
          src={user.profilePicture || undefined}
        />
      </Grid>
      <Grid rowGap={2} container item xs={10} direction="column">
        <Stack spacing={3} alignItems="center" direction="row">
          <Typography variant="h5">{user.username}</Typography>
          {!currentUserProfile &&
            (currentUserFollowing ? (
              <Form action={`/${user.username}/unfollow`} method="post">
                <Button
                  name="unfollow"
                  type="submit"
                  size="small"
                  variant="contained"
                >
                  Unfollow
                </Button>
              </Form>
            ) : (
              <Form action={`/${user.username}/follow`} method="post">
                <Button
                  name="follow"
                  type="submit"
                  size="small"
                  variant="outlined"
                >
                  Follow
                </Button>
              </Form>
            ))}

          <IconButton>
            <MoreHoriz />
          </IconButton>

          {currentUserProfile && (
            <IconButton>
              <Settings />
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={4}>
          <Typography variant="body1">{`${user._count.posts} posts`}</Typography>
          <Typography variant="body1">{`${user._count.followers} followers`}</Typography>
          <Typography variant="body1">{`${user._count.following} following`}</Typography>
        </Stack>
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight={600}>
            {user.name}
          </Typography>
        </Grid>
        {user.profileDescription && (
          <Grid item xs={12}>
            <Typography variant="body1">{user?.profileDescription}</Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
