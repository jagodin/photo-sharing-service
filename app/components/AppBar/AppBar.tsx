import {
  AddAPhoto,
  Favorite,
  Home,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import { Stack } from '@mui/material';
import { Box } from '@mui/material';
import {
  alpha,
  AppBar as MuiAppBar,
  Avatar,
  Container,
  Grid,
  IconButton,
  InputBase,
  styled,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { useNavigate } from '@remix-run/react';

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

export const AppBar = () => {
  const navigate = useNavigate();

  return (
    <MuiAppBar color="default" position="static">
      <Container sx={{ padding: '0px !important' }} maxWidth="lg">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Box
              component={Grid}
              item
              display={{ xs: 'none', sm: 'block', md: 'block', lg: 'block' }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Box>
            <Grid item xs={12} sm={'auto'}>
              <Stack direction="row" spacing={1} justifyContent="end">
                <IconButton onClick={() => navigate('/')}>
                  <Home sx={iconStyle} />
                </IconButton>

                <IconButton onClick={() => navigate('/create')}>
                  <AddAPhoto sx={iconStyle} />
                </IconButton>

                <IconButton>
                  <Favorite sx={iconStyle} />
                </IconButton>

                <Tooltip title="Profile">
                  <IconButton>
                    <Avatar sx={{ height: 24, width: 24 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};
