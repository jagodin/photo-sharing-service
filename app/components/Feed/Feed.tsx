import { Grid } from '@mui/material';
import type { Favorites, Post as PostModal, User } from '@prisma/client';

import { Post } from '../Post';

interface FeedProps {
  posts: (PostModal & {
    author: User;
    favorites: (Favorites & {
      user: User;
    })[];
  })[];
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
