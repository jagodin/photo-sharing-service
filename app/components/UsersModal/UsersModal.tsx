import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import type { User } from '@prisma/client';

import { UserList } from '../UserList';

interface LikesModalProps {
  users: Omit<User, 'password' | 'email'>[];
  open: boolean;
  onClose: () => void;
}

export const UsersModal = ({ users, open, onClose }: LikesModalProps) => {
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogContent>
        <UserList users={users} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
