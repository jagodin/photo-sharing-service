import { CheckBox, Delete } from '@mui/icons-material';
import {
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import type { Post } from '@prisma/client';
import { Form } from '@remix-run/react';

import { useLoadImage } from '~/hooks/useLoadImage';

interface CompactPostProps {
  post: Post;
}

export const CompactPost = ({ post }: CompactPostProps) => {
  const { imageLoaded, image } = useLoadImage(post.url);

  return (
    <Paper elevation={2} sx={{ padding: (theme) => theme.spacing(2) }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Stack spacing={1} direction="row" alignItems="center">
            {imageLoaded ? (
              <img
                style={{ maxHeight: 60, maxWidth: 60 }}
                alt={post.description || 'unknown image'}
                src={image?.src}
              />
            ) : (
              <Skeleton height={60} width={60} />
            )}
            <Typography variant="body1">{post.description}</Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Form
              method="post"
              action={`/resource/post/${post.postId}/approve`}
            >
              <input hidden readOnly value="/admin" name="redirectTo" />
              <IconButton type="submit">
                <CheckBox color="success" />
              </IconButton>
            </Form>
            <Form method="post" action={`/resource/post/${post.postId}/delete`}>
              <input hidden readOnly value="/admin" name="redirectTo" />
              <IconButton type="submit">
                <Delete color="error" />
              </IconButton>
            </Form>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
