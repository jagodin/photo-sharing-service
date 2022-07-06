import type { ChangeEvent } from 'react';
import { Upload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    submit(e.currentTarget);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
