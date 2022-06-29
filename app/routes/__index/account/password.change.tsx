import type { User } from '@prisma/client';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { ChangePasswordForm } from '~/components/ChangePasswordForm';
import { authenticateUser } from '~/services/auth.server';

interface LoaderData {
  user: Omit<User, 'password'>;
}

export const action: ActionFunction = async ({ request }) => {
  const { userId } = await authenticateUser(request);
  const formData = await request.formData();

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword1 = formData.get('newPassword1') as string;
  const newPassword2 = formData.get('newPassword2') as string;

  if (!currentPassword || !newPassword1 || !newPassword2)
    throw new Response('Missing form data', { status: 400 });

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    user: await authenticateUser(request),
  };

  return json(data);
};

export default function ChangePassword() {
  return <ChangePasswordForm />;
}
