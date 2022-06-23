import { Grid } from '@mui/material';
import type { Post as PostModal, User } from '@prisma/client';

import { PostPreview } from '../PostPreview';

import { useWidth } from '~/hooks/useWidth';

interface ProfileFeedProps {
  posts: (PostModal & {
    author: User;
  })[];
}

export const ProfileFeed = ({ posts }: ProfileFeedProps) => {
  const width = useWidth();

  return (
    <Grid container spacing={width === 'xs' ? 1 : 2}>
      {posts.map((post) => (
        <Grid key={post.postId} item xs={4}>
          <PostPreview post={post} />
        </Grid>
      ))}
    </Grid>
  );
};
