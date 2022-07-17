import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Upload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import { Form, useLocation, useSubmit, useTransition } from '@remix-run/react';

export const UploadView = () => {
  const submit = useSubmit();
  const transition = useTransition();
  const [alertOpen, setAlertOpen] = useState(false);

  const { pathname } = useLocation();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const post = formData.get('post') as File;
    if (post.size > 10 * 1048576) {
      setAlertOpen(true);
      e.currentTarget.reset();
    } else {
      submit(e.currentTarget);
    }
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      rowGap={3}
      sx={{ padding: (theme) => theme.spacing(8, 0) }}
    >
      <Snackbar open={alertOpen} onClose={closeAlert} autoHideDuration={4000}>
        <Alert onClose={closeAlert} severity="error">
          File size too large! Max size is 10 MB.
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Typography textAlign="center" variant="h5">
          Upload a photo from your device.
        </Typography>
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
