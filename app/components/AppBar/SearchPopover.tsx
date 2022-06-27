import { useEffect, useState } from 'react';
import { CircularProgress, Grid, Popover, Typography } from '@mui/material';
import { useFetcher } from '@remix-run/react';

import { UserList } from '../UserList';

import type { UserSearchResponse } from '~/routes/__index/__index/users.$searchString';

interface SearchPopoverProps {
  onClose: () => void;
  anchorEl: HTMLElement | null;
  searchInput: string;
}

export const SearchPopover = ({
  onClose,
  anchorEl,
  searchInput,
}: SearchPopoverProps) => {
  const open = Boolean(anchorEl) && searchInput !== '';
  const fetcher = useFetcher<UserSearchResponse>();
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (!shouldFetch) return;
    fetcher.load(`/users/${searchInput}`);
    setShouldFetch(false);
  }, [searchInput, fetcher, setShouldFetch, shouldFetch]);

  useEffect(() => {
    if (searchInput !== '') {
      setShouldFetch(true);
    }
  }, [searchInput]);

  const users = fetcher.data?.users;

  return (
    <Popover
      elevation={10}
      disableAutoFocus
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Grid
        maxWidth="sm"
        container
        sx={{ backgroundColor: 'white', padding: (theme) => theme.spacing(2) }}
      >
        {fetcher.state !== 'idle' ? (
          <CircularProgress />
        ) : users?.length === 0 ? (
          <Typography variant="body1">
            No users found for search "{searchInput}"
          </Typography>
        ) : (
          <UserList users={fetcher.data?.users || []} />
        )}
      </Grid>
    </Popover>
  );
};
