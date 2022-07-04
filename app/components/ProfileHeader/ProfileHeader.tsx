import { useState } from 'react';
import { Settings } from '@mui/icons-material';
import type { AvatarProps } from '@mui/material';
import {
  Avatar as MuiAvatar,
  Button,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import type { User } from '@prisma/client';
import { Form, useNavigate } from '@remix-run/react';

import { UsersModal } from '../UsersModal';

interface ProfileHeaderProps {
  user: Omit<User, 'password'>;
  followers: Omit<User, 'password'>[];
  following: Omit<User, 'password'>[];
  currentUserFollowing: boolean;
  currentUser: Omit<User, 'password'>;
  postCount: number;
}

const Avatar = styled((props: AvatarProps) => <MuiAvatar {...props} />)(
  ({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
      width: 140,
      height: 140,
    },
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 100,
    },
  })
);

export const ProfileHeader = ({
  followers,
  following,
  user,
  currentUserFollowing,
  currentUser,
  postCount,
}: ProfileHeaderProps) => {
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const navigate = useNavigate();

  const openFollowersModal = () => {
    setFollowersModalOpen(true);
  };

  const closeFollowersModal = () => {
    setFollowersModalOpen(false);
  };

  const openFollowingModal = () => {
    setFollowingModalOpen(true);
  };

  const closeFollowingModal = () => {
    setFollowingModalOpen(false);
  };

  const currentUserProfile = currentUser.username == user.username;
  return (
    <Grid container alignItems="center" spacing={4}>
      <Grid item xs={12} sm={3}>
        <Avatar src={user.profilePicture || undefined} />
      </Grid>
      <Grid rowGap={2} xs={12} sm={9} container item direction="column">
        <Stack spacing={3} alignItems="center" direction="row">
          <Typography variant="h5">{user.username}</Typography>
          {!currentUserProfile &&
            (currentUserFollowing ? (
              <Form action={`/${user.username}/unfollow`} method="post">
                <input
                  hidden
                  readOnly
                  name="redirectTo"
                  value={`/${user.username}`}
                />
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
                <input
                  hidden
                  readOnly
                  name="redirectTo"
                  value={`/${user.username}`}
                />
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

          {currentUserProfile && (
            <IconButton onClick={() => navigate('/account/edit')}>
              <Settings />
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={4}>
          <Typography
            fontWeight={600}
            variant="body1"
          >{`${postCount} posts`}</Typography>
          <Typography
            fontWeight={600}
            variant="body1"
            onClick={openFollowersModal}
            sx={{
              '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
          >{`${followers.length} followers`}</Typography>
          <UsersModal
            users={followers}
            open={followersModalOpen}
            onClose={closeFollowersModal}
          />
          <Typography
            fontWeight={600}
            variant="body1"
            onClick={openFollowingModal}
            sx={{
              '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
          >{`${following.length} following`}</Typography>
          <UsersModal
            users={following}
            open={followingModalOpen}
            onClose={closeFollowingModal}
          />
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
