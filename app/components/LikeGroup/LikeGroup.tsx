import { useState } from 'react';
import type { AvatarGroupProps } from '@mui/material';
import { Tooltip } from '@mui/material';
import { Link } from '@mui/material';
import { Typography } from '@mui/material';
import { Avatar, AvatarGroup, Grid } from '@mui/material';
import type { User } from '@prisma/client';

import { LikesModal } from '../LikesModal';

interface LikeGroupProps extends AvatarGroupProps {
  users: Omit<User, 'password'>[];
}

export const LikeGroup = ({ users, ...props }: LikeGroupProps) => {
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const renderDescription = (users: Omit<User, 'password'>[]) => {
    if (users.length === 0) {
      return null;
    } else if (users.length === 1) {
      return (
        <Typography variant="subtitle2">
          Liked by{' '}
          <Link
            fontWeight={600}
            color="text.primary"
            href={`/${users[0].username}`}
            underline="hover"
          >
            {users[0].username}
          </Link>
        </Typography>
      );
    } else {
      const othersCount = users.length - 1;
      const text = othersCount > 1 ? `${othersCount} others` : `1 other`;
      return (
        <Typography variant="subtitle2">
          Liked by{' '}
          <Link
            fontWeight={600}
            color="text.primary"
            href={`/${users[0].username}`}
            underline="hover"
          >
            {users[0].username}
          </Link>{' '}
          and{' '}
          <Link
            fontWeight={600}
            color="text.primary"
            href={`#`}
            underline="hover"
            onClick={openLikesModal}
          >
            {text}
          </Link>
        </Typography>
      );
    }
  };

  const openLikesModal = () => {
    setLikesModalOpen(true);
  };

  const closeLikesModal = () => {
    setLikesModalOpen(false);
  };

  return users.length > 0 ? (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <AvatarGroup spacing="small" {...props}>
          {users.map((user) => (
            <Link key={user.userId} href={`/${users[0].username}`}>
              <Tooltip title={user.username}>
                <Avatar
                  src={user.profilePicture || undefined}
                  alt={user.username}
                  sx={{ height: 25, width: 25 }}
                />
              </Tooltip>
            </Link>
          ))}
        </AvatarGroup>
      </Grid>
      <Grid item>{renderDescription(users)}</Grid>
      <LikesModal
        users={users}
        open={likesModalOpen}
        onClose={closeLikesModal}
      />
    </Grid>
  ) : null;
};
