import type { User } from '@prisma/client';
import { useActionData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/server-runtime';
import _ from 'lodash';

import { ChangePasswordForm } from '~/components/ChangePasswordForm';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { sessionStorage } from '~/services/session.server';
import type { ValidationError } from '~/services/user.server';
import { changePassword, passwordMatchesHash } from '~/services/user.server';
import type { Message } from '~/utils/types';

interface LoaderData {
  user: Omit<User, 'password'>;
}

export const action: ActionFunction = async ({ request }) => {
  const { userId } = await authenticateUser(request);
  const user = await db.user.findUnique({ where: { userId } });
  if (!user)
    throw new Response(`User with ID ${userId} not found.`, { status: 401 });

  const formData = await request.formData();

  const errors: ValidationError[] = [];

  const currentPassword = formData.get('currentPassword') as string;
  if (!currentPassword) {
    errors.push({
      field: 'currentPassword',
      message: 'Please enter your current password',
    });
  }
  const newPassword1 = formData.get('newPassword1') as string;
  if (!newPassword1) {
    errors.push({
      field: 'newPassword1',
      message: 'Please enter a new password',
    });
  }

  const newPassword2 = formData.get('newPassword2') as string;
  if (!newPassword2) {
    errors.push({
      field: 'newPassword2',
      message: 'Please confirm your new password',
    });
  }

  if (errors.length > 0) return json<ValidationError[]>(errors);

  if (!(await passwordMatchesHash(currentPassword, user.password))) {
    return json<ValidationError[]>([
      {
        field: 'currentPassword',
        message: 'Your current password is incorrect.',
      },
    ]);
  }

  if (await passwordMatchesHash(newPassword1, user.password)) {
    return json<ValidationError[]>([
      {
        field: 'newPassword1',
        message:
          'Please use a password that is different from your current password.',
      },
    ]);
  }

  if (newPassword1.length < 8) {
    return json<ValidationError[]>([
      {
        field: 'newPassword1',
        message: 'Your new password must be at least 8 characters in length.',
      },
    ]);
  }

  if (newPassword1 !== newPassword2) {
    return json<ValidationError[]>([
      {
        field: 'newPassword2',
        message: 'Your confirmation does not match your new password.',
      },
    ]);
  }

  const newUser = await changePassword({ newPassword: newPassword1, user });

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  session.flash('message', {
    severity: 'success',
    message: 'Password successfully updated.',
  } as Message);

  session.set('user', _.omit(newUser, 'password'));

  return redirect('/account/password/change', {
    headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    user: await authenticateUser(request),
  };

  return json(data);
};

export default function ChangePassword() {
  const errors = useActionData<ValidationError[]>();
  return <ChangePasswordForm errors={errors} />;
}
