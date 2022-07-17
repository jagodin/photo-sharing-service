import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Upload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar as MuiAvatar,
  Button,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { Form, useNavigate, useSubmit, useTransition } from '@remix-run/react';
import { useActionData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/server-runtime';
import { parseMultipartFormData } from '@remix-run/server-runtime/formData';
import _ from 'lodash';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { uploadHandler } from '~/services/image.server';
import { sessionStorage } from '~/services/session.server';
import type { Message, ValidationError } from '~/utils/types';

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

      return redirect('/', {
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

        return redirect('/', {
          headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
          },
        });
      }

      return json<ActionData>({ uploadedAvatar: imgSrc });
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateUser(request);

  return null;
};

export default function Avatar() {
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();
  const transition = useTransition();
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const post = formData.get('avatar') as File;
    if (post.size > 10 * 1048576) {
      setAlertOpen(true);
      e.currentTarget.reset();
    } else {
      submit(e.currentTarget);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const uploadLoading = transition.state !== 'idle';

  return (
    <Container maxWidth="xs">
      <Snackbar open={alertOpen} onClose={closeAlert} autoHideDuration={4000}>
        <Alert onClose={closeAlert} severity="error">
          File size too large! Max size is 10 MB.
        </Alert>
      </Snackbar>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item>
          <Typography textAlign="center" variant="h5">
            Add an Avatar
          </Typography>
        </Grid>
        <Grid item>
          <MuiAvatar
            src={actionData?.uploadedAvatar}
            sx={{ width: 120, height: 120, m: 1 }}
          />
        </Grid>
        <Grid item>
          <Form
            method="post"
            onChange={handleSubmit}
            encType="multipart/form-data"
          >
            <input hidden readOnly name="action" value="upload" />
            <label htmlFor="avatar">
              <input
                accept="image/*"
                id="avatar"
                name="avatar"
                type="file"
                style={{ display: 'none' }}
              />
              <LoadingButton
                component="span"
                variant="contained"
                startIcon={<Upload />}
                loading={uploadLoading}
                disabled={uploadLoading}
              >
                Upload
              </LoadingButton>
            </label>
          </Form>
        </Grid>
        <Grid item sx={{ mt: 6 }}>
          <Stack direction="row" spacing={4}>
            <Button onClick={handleSkip} variant="outlined">
              Skip
            </Button>
            <Form method="post">
              <input
                hidden
                readOnly
                name="avatar"
                value={actionData?.uploadedAvatar}
              />
              <input hidden readOnly name="action" value="saveAvatar" />
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Form>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
