import { Grid, Link, Stack, Typography } from '@mui/material';
import type { User } from '@prisma/client';

import { Avatar } from '../Avatar';

interface UserListProps {
  users: Omit<User, 'password'>[];
}

export const UserList = ({ users }: UserListProps) => {
  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} key={user.userId}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar user={user} />
            <Link
              underline="hover"
              color="text.primary"
              href={`/${user.username}`}
            >
              <Typography variant="body1" fontWeight={600}>
                {user.username}
              </Typography>
            </Link>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};
