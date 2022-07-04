import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Delete, Flag, MoreVert } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import type { Post, User } from '@prisma/client';

import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface PostOptionsMenuProps {
  post: Post & {
    author: User;
  };
  currentUser: Omit<User, 'password'>;
  redirectAfterDelete: string;
}

export const PostOptionsMenu = ({
  post,
  currentUser,
  redirectAfterDelete,
}: PostOptionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openDeleteConfirm = () => {
    setAnchorEl(null);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <IconButton onClick={openMenu}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        {(currentUser.userId === post.authorId || currentUser.isAdmin) && (
          <MenuItem onClick={openDeleteConfirm}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
        <MenuItem>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <ListItemText>Cancel</ListItemText>
        </MenuItem>
      </Menu>
      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        post={post}
        redirectTo={redirectAfterDelete}
      />
    </>
  );
};
