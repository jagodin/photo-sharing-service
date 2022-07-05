import { useState } from 'react';
import {
  AddAPhoto,
  Favorite,
  Home,
  Search as SearchIcon,
} from '@mui/icons-material';
import { AdminPanelSettings } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import { Stack } from '@mui/material';
import { Box } from '@mui/material';
import {
  alpha,
  AppBar as MuiAppBar,
  Container,
  Grid,
  IconButton,
  InputBase,
  styled,
  Toolbar,
  Tooltip,
} from '@mui/material';
import type { User } from '@prisma/client';
import { useLocation, useNavigate } from '@remix-run/react';

import { Avatar } from '../Avatar';
import { CreatePostModal } from '../CreatePostModal';
import { NotificationsPopover } from '../NotificationsPopover';
import { ProfileMenu } from '../ProfileMenu';

import { SearchPopover } from './SearchPopover';

import { useWidth } from '~/hooks/useWidth';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '26ch',
      '&:focus': {
        width: '34ch',
      },
    },
  },
}));

const iconStyle: SxProps<Theme> = {
  fontSize: '24px',
};

interface AppBarProps {
  user: Omit<User, 'password'>;
}

export const AppBar = ({ user }: AppBarProps) => {
  const navigate = useNavigate();
  const [searchEl, setSearchEl] = useState<HTMLElement | null>(null);
  const [avatarEl, setAvatarEl] = useState<HTMLElement | null>(null);
  const [notificationsEl, setNotificationsEl] = useState<HTMLElement | null>(
    null
  );
  const [searchInput, setSearchInput] = useState('');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const { pathname } = useLocation();
  const width = useWidth();

  const handleSearchPopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setSearchEl(event.currentTarget);
  };

  const handleSearchPopoverClose = () => {
    setSearchEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAvatarEl(null);
  };

  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsEl(null);
  };

  const openCreatePostModal = () => {
    setCreatePostOpen(true);
  };

  const closeCreatePostModal = () => {
    navigate(pathname);
    setCreatePostOpen(false);
  };

  return (
    <MuiAppBar color="default">
      <Container sx={{ padding: '0px !important' }} maxWidth="md">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Box
              component={Grid}
              item
              display={{ xs: 'none', sm: 'block', md: 'block', lg: 'block' }}
            >
              <Search onClick={handleSearchPopoverOpen}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={handleOnSearch}
                  value={searchInput}
                />
              </Search>
              <SearchPopover
                anchorEl={searchEl}
                searchInput={searchInput}
                onClose={handleSearchPopoverClose}
              />
            </Box>
            <Grid item xs={12} sm={'auto'}>
              <Stack direction="row" spacing={1} justifyContent="end">
                <IconButton onClick={() => navigate('/')}>
                  <Home sx={iconStyle} />
                </IconButton>

                <IconButton onClick={openCreatePostModal}>
                  <AddAPhoto sx={iconStyle} />
                </IconButton>

                <CreatePostModal
                  open={createPostOpen}
                  onClose={closeCreatePostModal}
                  user={user}
                />

                <IconButton
                  onClick={
                    width == 'sm' || width == 'xs'
                      ? () => navigate('/notifications')
                      : handleNotificationsOpen
                  }
                >
                  <Favorite sx={iconStyle} />
                </IconButton>

                <NotificationsPopover
                  onClose={handleNotificationsClose}
                  anchorEl={notificationsEl}
                />

                {user.isAdmin && (
                  <Tooltip title="Admin">
                    <IconButton onClick={() => navigate('/admin')}>
                      <AdminPanelSettings />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Profile">
                  <IconButton onClick={handleProfileMenuOpen}>
                    <Avatar
                      onClick={undefined}
                      user={user}
                      sx={{ height: 24, width: 24 }}
                    />
                  </IconButton>
                </Tooltip>

                <ProfileMenu
                  anchorEl={avatarEl}
                  setAnchorEl={setAvatarEl}
                  onClose={handleProfileMenuClose}
                  user={user}
                />
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};
