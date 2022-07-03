import type { ActionFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { parseMultipartFormData } from '@remix-run/server-runtime/formData';

import { authenticateUser } from '~/services/auth.server';
import { uploadHandler } from '~/services/image.server';
import { sessionStorage } from '~/services/session.server';
import type { Message } from '~/utils/types';

export interface AvatarActionData {
  imgSrc: string;
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateUser(request);

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get('avatar') as string;

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  if (!imgSrc) {
    session.flash('message', {
      severity: 'error',
      message: 'Something went wrong while uploading your avatar',
    } as Message);

    return redirect('/account/edit', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    });
  }

  return json<AvatarActionData>({ imgSrc });
};
