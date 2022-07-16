import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { useFetcher } from '@remix-run/react';

import { UserList } from '~/components/UserList';
import type { UserSearchResponse } from '~/routes/resource/user.$searchString';

export default function Index() {
  const fetcher = useFetcher<UserSearchResponse>();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (!shouldFetch) return;
    fetcher.load(`/resource/user/${searchInput}`);
    setShouldFetch(false);
  }, [searchInput, fetcher, setShouldFetch, shouldFetch]);

  useEffect(() => {
    if (searchInput !== '') {
      setShouldFetch(true);
    }
  }, [searchInput]);

  const users = fetcher.data?.users;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <Grid container spacing={3} sx={{ pb: 4 }}>
      <Grid item xs={12}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          fullWidth
          placeholder="Search for users..."
          onChange={handleSearch}
        />
      </Grid>
      <Grid item xs={12}>
        <UserList
          loading={fetcher.state !== 'idle'}
          users={searchInput === '' ? [] : users || []}
        />
      </Grid>
    </Grid>
  );
}
