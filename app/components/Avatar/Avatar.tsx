import type { AvatarProps as MuiAvatarProps } from '@mui/material';
import { Avatar as MuiAvatar } from '@mui/material';
import type { User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

interface AvatarProps extends MuiAvatarProps {
  user: Omit<User, 'password'>;
}

export const Avatar = ({ user, sx }: AvatarProps) => {
  const navigate = useNavigate();
  return (
    <MuiAvatar
      onClick={() => navigate(`/${user.username}`)}
      src={user.profilePicture || undefined}
      sx={{
        ...sx,
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    />
  );
};
