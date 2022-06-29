import type { User } from '@prisma/client';
import { useActionData, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import _ from 'lodash';

import { EditProfileForm } from '~/components/EditProfileForm';
import { authenticateUser } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';
import type { ValidationError } from '~/services/user.server';
import { updateUser } from '~/services/user.server';

interface LoaderData {
  user: Omit<User, 'password'>;
}

export const action: ActionFunction = async ({ request }) => {
  const { userId } = await authenticateUser(request);
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const profileDescription = formData.get('profileDescription') as string;
  const email = formData.get('email') as string;

  if (!name || !username || !profileDescription || !email)
    throw new Response('Missing form data', { status: 400 });

  const { errors, user: newUser } = await updateUser({
    email,
    name,
    username,
    profileDescription,
    userId,
  });

  if (errors) {
    return json(errors);
  }

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  session.set('user', _.omit(newUser, 'password'));

  return redirect('/account/edit', {
    headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    user: await authenticateUser(request),
  };

  return json(data);
};

export default function Edit() {
  const { user } = useLoaderData<LoaderData>();
  const errors = useActionData<ValidationError[]>();

  return <EditProfileForm user={user} errors={errors} />;
}
