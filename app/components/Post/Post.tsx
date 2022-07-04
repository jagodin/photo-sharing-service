import { AddComment } from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Favorites, Post as PostModal, User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

import { FavoriteButton } from '../FavoriteButton';
import { LikeGroup } from '../LikeGroup';
import { PostApprovedIcon } from '../PostApprovedIcon';
import { PostOptionsMenu } from '../PostOptionsMenu';

import { useLoadImage } from '~/hooks/useLoadImage';

interface PostProps {
  post: PostModal & {
    author: User;
    favorites: (Favorites & {
      user: User;
    })[];
  };
  currentUser: Omit<User, 'password'>;
}
export const Post = ({ post, currentUser }: PostProps) => {
  const { imageLoaded, image } = useLoadImage(post.url);
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={post.author.profilePicture || undefined} />}
        title={
          <Link
            underline="none"
            style={{ textDecoration: 'none' }}
            href={post.author.username}
            color={(theme) => theme.palette.text.primary}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {post.author.username}
            </Typography>
          </Link>
        }
        action={
          <Stack spacing={1} direction="row" alignItems="center">
            <PostApprovedIcon post={post} />
            <PostOptionsMenu
              redirectAfterDelete="/"
              post={post}
              currentUser={currentUser}
            />
          </Stack>
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

      <CardActions sx={{ padding: (theme) => theme.spacing(1) }}>
        <Stack direction="row" spacing={1}>
          <FavoriteButton post={post} currentUser={currentUser} />
          <Tooltip title="Add a comment">
            <IconButton
              onClick={() =>
                navigate(`/${post.author.username}/post/${post.postId}`)
              }
            >
              <AddComment />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
      <CardContent sx={{ padding: (theme) => theme.spacing(0, 2) }}>
        <LikeGroup users={post.favorites.map((favorite) => favorite.user)} />
        <Typography sx={{ mt: '6px' }} variant="body1" color="text.secondary">
          {post?.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
