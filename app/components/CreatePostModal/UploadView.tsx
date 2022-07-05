import type { ChangeEvent } from 'react';
import { Upload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import { Form, useLocation, useSubmit, useTransition } from '@remix-run/react';

export const UploadView = () => {
  const submit = useSubmit();
  const transition = useTransition();

  const { pathname } = useLocation();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    submit(e.currentTarget);
  };
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h5">Upload a photo from your device.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Form
          method="post"
          onChange={handleSubmit}
          encType="multipart/form-data"
          action="/resource/post"
        >
          <label htmlFor="post">
            <input name="action" readOnly hidden value="upload" />
            <input name="redirectTo" readOnly hidden value={pathname} />
            <input
              accept="image/*"
              id="post"
              name="post"
              type="file"
              style={{ display: 'none' }}
            />
            <LoadingButton
              startIcon={<Upload />}
              variant="contained"
              component="span"
              loading={transition.state !== 'idle'}
            >
              Upload
            </LoadingButton>
          </label>
        </Form>
      </Grid>
    </Grid>
  );
};
