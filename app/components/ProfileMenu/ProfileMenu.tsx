import type { Dispatch, SetStateAction } from 'react';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@mui/material';
import type { User } from '@prisma/client';
import { useFetcher, useNavigate } from '@remix-run/react';

interface ProfileMenuProps {
  onClose: () => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  user?: Omit<User, 'password'>;
}

export const ProfileMenu = ({
  onClose,
  anchorEl,
  user,
  setAnchorEl,
}: ProfileMenuProps) => {
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const userFetcher = useFetcher();

  const buttonStyle: SxProps<Theme> = {
    padding: (theme) => theme.spacing(0.5, 3),
  };

  const goToProfile = () => {
    setAnchorEl(null);
    navigate(`/${user?.username}`);
  };

  const logout = () => {
    userFetcher.submit(
      {},
      {
        method: 'post',
        action: '/logout',
      }
    );
  };

  const goToUser = () => {
    setAnchorEl(null);
    navigate('/account/edit');
  };

  return (
    <Popover
      elevation={10}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <List>
        <ListItem key="profile" disablePadding>
          <ListItemButton sx={buttonStyle} onClick={goToProfile}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem key="settings" disablePadding>
          <ListItemButton sx={buttonStyle} onClick={goToUser}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="logout" disablePadding>
          <ListItemButton sx={buttonStyle} onClick={logout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Popover>
  );
};
