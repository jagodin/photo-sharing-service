import { useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { Comment as CommentModel, Post, User } from '@prisma/client';
import { Form, useNavigate } from '@remix-run/react';
import moment from 'moment';

interface CommentProps {
  author: Omit<User, 'password' | 'email'>;
  comment: CommentModel;
  date: Date;
  currentUser: Omit<User, 'password' | 'email'>;
  post: Post & {
    author: Omit<User, 'password' | 'email'>;
  };
  type?: 'comment' | 'description';
}

export const PostComment = ({
  author,
  comment,
  date,
  currentUser,
  post,
  type = 'comment',
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
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
      wrap="nowrap"
    >
      <Grid item>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={author.profilePicture || undefined}
            sx={{
              height: '100%',
              width: '100%',
              maxWidth: '30px',
              maxHeight: '30px',
            }}
            onClick={goToProfile}
          />
          <Typography component="div" variant="body2">
            <Box
              onClick={goToProfile}
              sx={{
                '&:hover': {
                  textDecoration: 'underline',
                  cursor: 'pointer',
                },
                mr: 1,
              }}
              display="inline"
              fontWeight={600}
            >
              {author.username}
            </Box>
            {comment.content}
            <Box color="text.secondary" display="inline" sx={{ ml: 1 }}>
              {moment(date).fromNow()}
            </Box>
          </Typography>
        </Stack>
      </Grid>
      {type == 'comment' && (
        <Grid item>
          <IconButton onClick={openOptions}>
            <MoreVert />
          </IconButton>
          <Dialog maxWidth="xs" open={optionsOpen} onClose={closeOptions}>
            {isCurrentUsersComment && (
              <DialogTitle textAlign="center">Delete Comment</DialogTitle>
            )}
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
            </Grid>
          </Dialog>
        </Grid>
      )}
    </Grid>
  );
};
