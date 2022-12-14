import { Card, CardMedia, Skeleton } from '@mui/material';
import type { Post, User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

import { useLoadImage } from '~/hooks/useLoadImage';

interface PostPreviewProps {
  post: Post & {
    author: Omit<User, 'email' | 'password'>;
  };
}

export const PostPreview = ({ post }: PostPreviewProps) => {
  const { imageLoaded, image } = useLoadImage(post.url);

  const navigate = useNavigate();

  const openPostModal = () => {
    navigate(`/${post.author.username}/post/${post.postId}`);
  };

  return (
    <Card>
      {imageLoaded && image ? (
        <CardMedia
          component="img"
          image={image?.src}
          alt={post.description || 'unknown'}
          onClick={openPostModal}
        />
      ) : (
        <Skeleton
          onClick={openPostModal}
          height={205}
          animation="wave"
          variant="rectangular"
        />
      )}
    </Card>
  );
};
