import type { ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { Form } from '@remix-run/react';

import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface EditPostDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo: string;
  post: PostWithAuthorAndFavorites;
}

export const EditPostDescriptionModal = ({
  open,
  onClose,
  redirectTo,
  post,
}: EditPostDescriptionModalProps) => {
  const [descriptionValue, setDescriptionValue] = useState(
    post.description || ''
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescriptionValue(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Description</DialogTitle>
      <DialogContent dividers>
        <Form method="post" action={`/resource/post/${post.postId}/edit`}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={descriptionValue}
                multiline
                fullWidth
                rows={3}
                name="description"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={onClose} variant="outlined">
                  Cancel
                </Button>
                <input hidden readOnly value={redirectTo} name="redirectTo" />
                <Button onClick={onClose} variant="contained" type="submit">
                  Submit
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
