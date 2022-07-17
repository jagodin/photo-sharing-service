import type { AvatarProps as MuiAvatarProps } from '@mui/material';
import { Avatar as MuiAvatar } from '@mui/material';
import type { User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

interface AvatarProps extends MuiAvatarProps {
  user?: Omit<User, 'password' | 'email'>;
}

export const Avatar = ({ user, sx, ...rest }: AvatarProps) => {
  const navigate = useNavigate();
  return (
    <MuiAvatar
      onClick={() => navigate(`/${user?.username}`)}
      src={
        user?.profilePicture + '?w=164&h=164&fit=crop&auto=format' || undefined
      }
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        ...sx,
      }}
      {...rest}
    />
  );
};
