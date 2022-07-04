import { Button, Dialog, DialogTitle, Stack } from '@mui/material';
import type { Post, User } from '@prisma/client';
import { Form } from '@remix-run/react';

interface DeleteConfirmModalProps {
  post: Post & {
    author: User;
  };
  open: boolean;
  onClose: () => void;
}

export const DeleteConfirmModal = ({
  post,
  open,
  onClose,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      <DialogTitle>Delete Confirm</DialogTitle>
      <Stack spacing={1}>
        <Form method="post" action={`/resource/post/${post.postId}/delete`}>
          <input
            hidden
            readOnly
            value={`/${post.author.username}`}
            name="redirectTo"
          />
          <Button fullWidth onClick={onClose} type="submit" color="error">
            Delete
          </Button>
        </Form>
        <Button onClick={onClose}>Cancel</Button>
      </Stack>
    </Dialog>
  );
};
