import { useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Dialog,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import type { Comment as CommentModel, Post, User } from '@prisma/client';
import { Form, useNavigate } from '@remix-run/react';
import moment from 'moment';

interface CommentProps {
  author: User;
  comment: CommentModel;
  date: Date;
  currentUser: Omit<User, 'password'>;
  post: Post & {
    author: User;
  };
}

export const Comment = ({
  author,
  comment,
  date,
  currentUser,
  post,
}: CommentProps) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/${author.username}`);
  };

  const openOptions = () => {
    setOptionsOpen(true);
  };

  const closeOptions = () => {
    setOptionsOpen(false);
  };

  const isCurrentUsersComment = currentUser.username === author.username;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={1}>
        <Avatar
          src={author.profilePicture || undefined}
          sx={{ height: '100%', width: '100%' }}
          onClick={goToProfile}
        />
      </Grid>

      <Grid item xs={10}>
        <Typography onClick={goToProfile} variant="body2" fontWeight={600}>
          {author.username}
        </Typography>
        <Typography variant="body1">{comment.content}</Typography>
        <Typography variant="subtitle2">{moment(date).fromNow()}</Typography>
      </Grid>

      <Grid item xs={1}>
        <IconButton onClick={openOptions}>
          <MoreVert />
        </IconButton>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={optionsOpen}
          onClose={closeOptions}
        >
          <Grid container direction="column">
            {isCurrentUsersComment && (
              <Form
                method="delete"
                action={`/${post.author.username}/post/${post.postId}/comment`}
              >
                <input
                  hidden
                  readOnly
                  name="redirectTo"
                  value={`/${post.author.username}/post/${post.postId}`}
                />
                <Button
                  sx={{ borderRadius: 0 }}
                  type="submit"
                  name="commentId"
                  value={comment.commentId}
                  fullWidth
                  color="error"
                >
                  Delete
                </Button>
              </Form>
            )}
            <Button sx={{ borderRadius: 0 }} fullWidth>
              Report
            </Button>
            <Button sx={{ borderRadius: 0 }} fullWidth onClick={closeOptions}>
              Cancel
            </Button>
          </Grid>
        </Dialog>
      </Grid>
    </Grid>
  );
};
