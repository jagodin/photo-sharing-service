import { Button, Grid, Link, Stack, Typography } from '@mui/material';
import type { User } from '@prisma/client';
import { Form } from '@remix-run/react';

import { Avatar } from '../Avatar';

interface SuggestedUserProps {
  user: Omit<User, 'password'>;
}

export const SuggestedUser = ({ user }: SuggestedUserProps) => {
  return (
    <Grid alignItems="center" justifyContent="space-between" container>
      <Stack alignItems="center" spacing={2} direction="row">
        <Avatar sx={{ width: 30, height: 30 }} user={user} />
        <Link href={`/${user.username}`} underline="hover" color="text.primary">
          <Typography fontWeight={600} fontSize="14px" variant="body1">
            {user.username}
          </Typography>
        </Link>
      </Stack>

      <Form action={`/${user.username}/follow`} method="post">
        <input hidden readOnly name="redirectTo" value="/" />
        <Button name="follow" type="submit" size="small" variant="contained">
          Follow
        </Button>
      </Form>
    </Grid>
  );
};
