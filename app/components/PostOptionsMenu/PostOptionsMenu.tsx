import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Delete, Edit, Flag, MoreVert } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import type { User } from '@prisma/client';

import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { EditPostDescriptionModal } from '../EditPostDescriptionModal';

import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface PostOptionsMenuProps {
  post: PostWithAuthorAndFavorites;
  currentUser: Omit<User, 'password' | 'email'>;
  redirectAfterDelete: string;
  redirectAfterEdit: string;
}

export const PostOptionsMenu = ({
  post,
  currentUser,
  redirectAfterDelete,
  redirectAfterEdit,
}: PostOptionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
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

  const openEditPost = () => {
    setEditPostOpen(true);
  };

  const closeEditPost = () => {
    setEditPostOpen(false);
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
        {(currentUser.userId === post.authorId || currentUser.isAdmin) && (
          <MenuItem onClick={openEditPost}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Edit Description</ListItemText>
          </MenuItem>
        )}
        <MenuItem>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>
      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        post={post}
        redirectTo={redirectAfterDelete}
      />
      <EditPostDescriptionModal
        open={editPostOpen}
        onClose={closeEditPost}
        redirectTo={redirectAfterEdit}
        post={post}
      />
    </>
  );
};
