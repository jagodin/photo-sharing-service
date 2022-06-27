import type { Dispatch, SetStateAction } from 'react';
import { AccountCircle, Logout } from '@mui/icons-material';
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
          <ListItemButton
            sx={{ padding: (theme) => theme.spacing(0.5, 3) }}
            onClick={() => {
              setAnchorEl(null);
              navigate(`/${user?.username}`);
            }}
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="logout" disablePadding>
          <ListItemButton
            sx={{ padding: (theme) => theme.spacing(0.5, 3) }}
            onClick={() => {
              userFetcher.submit(
                {},
                {
                  method: 'post',
                  action: '/logout',
                }
              );
            }}
          >
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
