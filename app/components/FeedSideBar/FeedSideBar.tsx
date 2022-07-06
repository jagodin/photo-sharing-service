import { Divider, Grid, Link, Stack, Typography } from '@mui/material';
import type { User } from '@prisma/client';

import { Avatar } from '../Avatar';

import { SuggestedUser } from './SuggestedUser';

interface FeedSideBarProps {
  user: Omit<User, 'password' | 'email'>;
  suggestedUsers: Omit<User, 'password' | 'email'>[];
}

export const FeedSideBar = ({ user, suggestedUsers }: FeedSideBarProps) => {
  return (
    <Grid container rowGap={2}>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar sx={{ height: 60, width: 60 }} user={user} />
          <Link
            href={`/${user.username}`}
            underline="none"
            color="text.primary"
          >
            <Typography fontWeight={600} variant="body1">
              {user.username}
            </Typography>
          </Link>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Divider flexItem />
      </Grid>

      <Grid container item xs={12} rowGap={2}>
        <Grid item xs={12}>
          <Typography variant="body1">Suggestions for you</Typography>
        </Grid>
        <Grid container item xs={12} rowGap={1}>
          {suggestedUsers.map((user) => (
            <SuggestedUser key={user.userId} user={user} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
