import type { User } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';

export interface UserLoaderData {
  user: Omit<User, 'password'>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const data: UserLoaderData = {
    user: await authenticateUser(request),
  };
  return json(data);
};
