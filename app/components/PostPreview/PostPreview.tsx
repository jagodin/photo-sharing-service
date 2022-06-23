import { Card, CardMedia, Skeleton } from '@mui/material';
import type { Post } from '@prisma/client';

import { useLoadImage } from '~/hooks/useLoadImage';

interface PostPreviewProps {
  post: Post;
}

export const PostPreview = ({ post }: PostPreviewProps) => {
  const { imageLoaded, image } = useLoadImage(post.url);

  return (
    <Card>
      {imageLoaded ? (
        <CardMedia
          component="img"
          image={image?.src}
          alt={post.description || 'unknown'}
        />
      ) : (
        <Skeleton height={205} animation="wave" variant="rectangular" />
      )}
    </Card>
  );
};
