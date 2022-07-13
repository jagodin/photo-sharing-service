import type { User } from '@prisma/client';
import { useActionData, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { parseMultipartFormData } from '@remix-run/server-runtime/formData';
import _ from 'lodash';

import { EditProfileForm } from '~/components/EditProfileForm';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { uploadHandler } from '~/services/image.server';
import { sessionStorage } from '~/services/session.server';
import { updateUser } from '~/services/user.server';
import type { Message, ValidationError } from '~/utils/types';

interface LoaderData {
  user: Omit<User, 'password'>;
}

interface ActionData {
  errors?: ValidationError[];
  uploadedAvatar?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const { userId } = await authenticateUser(request);
  const requestClone = request.clone();
  const formData = await request.formData();

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  switch (formData.get('action')) {
    case 'saveAvatar': {
      const avatar = formData.get('avatar') as string;

      if (!avatar) {
        session.flash('message', {
          severity: 'error',
          message: 'Something went wrong while saving your avatar.',
        } as Message);

        return redirect('/account/edit', {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      const newUser = await db.user.update({
        where: { userId },
        data: { profilePicture: avatar },
      });

      session.flash('message', {
        severity: 'success',
        message: 'Avatar successfully updated.',
      } as Message);

      session.set('user', _.omit(newUser, 'password'));

      return redirect('/account/edit', {
        headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
      });
    }
    case 'upload': {
      const imgFormData = await parseMultipartFormData(
        requestClone,
        uploadHandler
      );
      const imgSrc = imgFormData.get('avatar') as string;

      if (!imgSrc) {
        session.flash('message', {
          severity: 'error',
          message: 'Something went wrong while uploading your avatar.',
        } as Message);

        return redirect('/account/edit', {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return json<ActionData>({ uploadedAvatar: imgSrc });
    }
    case 'edit': {
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
        return json<ActionData>({ errors });
      }

      session.flash('message', {
        severity: 'success',
        message: 'Account successfully updated.',
      } as Message);

      session.set('user', _.omit(newUser, 'password'));

      return redirect('/account/edit', {
        headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
      });
    }
    default: {
      console.error('Unknown action');

      return redirect('/account/edit');
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    user: await authenticateUser(request),
  };

  return json(data);
};

export default function Edit() {
  const { user } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <EditProfileForm
      user={user}
      errors={actionData?.errors}
      uploadedAvatar={actionData?.uploadedAvatar}
    />
  );
}
