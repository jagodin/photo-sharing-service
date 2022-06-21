import { Grid } from '@mui/material';
import type { Post as PostModal, User } from '@prisma/client';

import { Post } from '../Post';

interface FeedProps {
  posts: (PostModal & {
    author: User;
  })[];
}

export const Feed = ({ posts }: FeedProps) => {
  return (
    <Grid container spacing={4}>
      {posts.map((post) => (
        <Grid key={post.postId} item xs={12}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
};
