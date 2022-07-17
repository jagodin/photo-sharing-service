import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Upload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
} from '@mui/material';
import type { User } from '@prisma/client';
import { Form, useSubmit, useTransition } from '@remix-run/react';

import { Avatar } from '../Avatar';

interface ChangeAvatarModalProps {
  open: boolean;
  onClose: () => void;
  user: Omit<User, 'password' | 'email'>;
  uploadedAvatar?: string;
}

export const ChangeAvatarModal = ({
  open,
  onClose,
  user,
  uploadedAvatar,
}: ChangeAvatarModalProps) => {
  const submit = useSubmit();
  const transition = useTransition();
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

  const closeAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Snackbar open={alertOpen} onClose={closeAlert} autoHideDuration={4000}>
        <Alert onClose={closeAlert} severity="error">
          File size too large! Max size is 10 MB.
        </Alert>
      </Snackbar>
      <DialogTitle>Change Avatar</DialogTitle>
      <DialogContent dividers>
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid item xs={12}>
            <Avatar
              onClick={undefined}
              sx={{ height: 120, width: 120, '&:hover': { cursor: 'default' } }}
              user={user}
              src={uploadedAvatar || user.profilePicture || undefined}
            />
          </Grid>
          <Grid item xs={12}>
            <Form
              method="post"
              onChange={handleSubmit}
              encType="multipart/form-data"
            >
              <label htmlFor="avatar">
                <input hidden readOnly name="action" value="upload" />
                <input
                  accept="image/*"
                  id="avatar"
                  name="avatar"
                  type="file"
                  style={{ display: 'none' }}
                />
                <Button
                  startIcon={<Upload />}
                  variant="contained"
                  component="span"
                  disabled={transition.state !== 'idle'}
                >
                  Upload
                </Button>
              </label>
            </Form>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Form method="post">
          <input hidden readOnly name="avatar" value={uploadedAvatar} />
          <input hidden readOnly name="action" value="saveAvatar" />
          <LoadingButton
            loading={transition.state !== 'idle'}
            onClick={onClose}
            type="submit"
            variant="outlined"
            sx={{ mr: 1 }}
            disabled={!uploadedAvatar}
          >
            Save
          </LoadingButton>
        </Form>
      </DialogActions>
    </Dialog>
  );
};
