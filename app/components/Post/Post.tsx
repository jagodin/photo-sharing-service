import { useEffect, useState } from 'react';
import { AddComment, Favorite, MoreVert, Send } from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Post as PostModal, User } from '@prisma/client';

interface PostProps {
  post: PostModal & {
    author: User;
  };
}
export const Post = ({ post }: PostProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = handleImageLoaded;
    image.src = post.url;
    setImage(image);
  }, [post.url]);

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={post.author.profilePicture || undefined} />}
        title={
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {post.author.username}
          </Typography>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
      />
      {imageLoaded ? (
        <CardMedia
          component="img"
          image={image?.src}
          alt={post.description || 'unknown'}
        />
      ) : (
        <Skeleton height={500} animation="wave" variant="rectangular" />
      )}

      <CardActions>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Favorite">
            <IconButton>
              <Favorite />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add a comment">
            <IconButton>
              <AddComment />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton>
              <Send />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          {post?.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
