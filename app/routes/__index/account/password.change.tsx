import { Typography } from '@mui/material';
import type { User } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';

interface LoaderData {
  user: Omit<User, 'password'>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    user: await authenticateUser(request),
  };

  return json(data);
};

export default function ChangePassword() {
  return <Typography variant="h3">Change Password</Typography>;
}
