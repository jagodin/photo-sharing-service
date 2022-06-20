import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface CreatePostFormProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePostForm = ({ open, onClose }: CreatePostFormProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Post</DialogTitle>
      <DialogContent>
        <Typography variant="h5">
          Drag and drop photos or videos here.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
