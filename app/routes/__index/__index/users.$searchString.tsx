import type { User } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { searchUsers } from '~/services/user.server';

export interface UserSearchResponse {
  users: Omit<User, 'password'>[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticateUser(request);

  const searchString = params.searchString;
  if (!searchString)
    throw new Response("Expected 'params.searchString'", { status: 400 });

  const users = await searchUsers(searchString);

  const data: UserSearchResponse = {
    users,
  };

  return json(data);
};
