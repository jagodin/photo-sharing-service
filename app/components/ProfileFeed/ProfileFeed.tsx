import { Grid } from '@mui/material';
import type { Post as PostModal, User } from '@prisma/client';

import { PostPreview } from '../PostPreview';

interface ProfileFeedProps {
  posts: (PostModal & {
    author: User;
  })[];
}

export const ProfileFeed = ({ posts }: ProfileFeedProps) => {
  return (
    <Grid alignItems="center" container spacing={1}>
      {posts.map((post) => (
        <Grid key={post.postId} item xs={4}>
          <PostPreview post={post} />
        </Grid>
      ))}
    </Grid>
  );
};
