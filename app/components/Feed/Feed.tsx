import { Grid } from '@mui/material';
import type { User } from '@prisma/client';

import { Post } from '../Post';

import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface FeedProps {
  posts: PostWithAuthorAndFavorites[];
  currentUser: Omit<User, 'password'>;
}

export const Feed = ({ posts, currentUser }: FeedProps) => {
  return (
    <Grid container spacing={4}>
      {posts.map((post) => (
        <Grid key={post.postId} item xs={12}>
          <Post currentUser={currentUser} post={post} />
        </Grid>
      ))}
    </Grid>
  );
};
