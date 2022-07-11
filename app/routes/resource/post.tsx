import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { unstable_parseMultipartFormData } from '@remix-run/server-runtime';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { uploadHandler } from '~/services/image.server';
import { sessionStorage } from '~/services/session.server';
import type { Message } from '~/utils/types';

export interface PostActionData {
  uploadedImage: string;
}

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticateUser(request);
  const requestClone = request.clone();

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  const formData = await requestClone.formData();
  const redirectTo = formData.get('redirectTo') as string;

  if (!redirectTo)
    throw new Response("Expected 'redirectTo' form entry.", { status: 400 });
  switch (formData.get('action')) {
    case 'upload': {
      const imgFormData = await unstable_parseMultipartFormData(
        request,
        uploadHandler
      );

      const imgSrc = imgFormData.get('post') as string;

      if (!imgSrc) {
        session.flash('message', {
          severity: 'error',
          message: 'Something went wrong while uploading your avatar.',
        } as Message);

        return redirect('/', {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }
      return redirect(`${redirectTo}?uploadedImage=${imgSrc}`);
    }
    case 'submit': {
      const description = formData.get('description') as string;
      const imgSrc = formData.get('imgSrc') as string;

      if (!imgSrc) {
        session.flash('message', {
          severity: 'error',
          message: 'Something went wrong while uploading your avatar.',
        } as Message);

        return redirect('/', {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      const post = await db.post.create({
        data: {
          authorId: user.userId,
          url: imgSrc,
          description,
          type: 'PICTURE',
          approved: false,
        },
      });

      return redirect(`/${user.username}/post/${post.postId}`);
    }
    default: {
      console.log(`Invalid action ${formData.get('action')}`);
      return redirect('/');
    }
  }
};
