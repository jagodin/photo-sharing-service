import {
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
import type { Comment, Favorites, Post, User } from '@prisma/client';
import type { Comment as CommentModel } from '@prisma/client';

import { PostFooter } from '../PostFooter';

import { Header } from './Header';
import { PostComment } from './PostComment';

import { useLoadImage } from '~/hooks/useLoadImage';
import { useWidth } from '~/hooks/useWidth';
import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface PostModalLargeProps {
  open: boolean;
  onClose: () => void;
  post: PostWithAuthorAndFavorites & {
    comments: (Comment & {
      author: Omit<User, 'password' | 'email'>;
    })[];
  };
  currentUser: Omit<User, 'password' | 'email'>;
}

export const PostModalLarge = ({
  open,
  onClose,
  post,
  currentUser,
}: PostModalLargeProps) => {
  const { imageLoaded, image } = useLoadImage(post.url);
  const width = useWidth();

  const smallWidth = width === 'xs';

  return (
    <Dialog
      fullWidth={true}
      maxWidth={smallWidth ? 'lg' : 'xl'}
      open={open}
      onClose={onClose}
      scroll="body"
    >
      <Card
        sx={{
          '&.MuiCard-root': {
            height: '100%',
          },
        }}
      >
        <Grid
          container
          sx={{ height: '100%' }}
          direction={smallWidth ? 'column' : 'row'}
        >
          <Grid item xs={5} sm={12} md={7}>
            {imageLoaded ? (
              <CardMedia
                component="img"
                image={image?.src}
                alt={post.description || 'unknown'}
              />
            ) : (
              <Skeleton
                sx={{ width: '100%', height: '100%' }}
                animation="wave"
                variant="rectangular"
              />
            )}
          </Grid>

          <Grid item xs={true} sm={12} md={5}>
            <CardContent sx={{ padding: 0, height: '100%' }}>
              <Grid
                container
                direction="column"
                sx={{ height: '100%' }}
                justifyContent="flex-end"
              >
                <Grid item>
                  <Header currentUser={currentUser} post={post} />
                </Grid>
                <Divider />

                <Grid
                  container
                  sx={{
                    padding: (theme) => theme.spacing(2),
                  }}
                  spacing={2}
                >
                  {post.description !== null && post.description !== '' && (
                    <Grid item xs={12}>
                      <PostComment
                        date={post.createdAt}
                        comment={{ content: post.description } as Comment}
                        author={post.author}
                        currentUser={currentUser}
                        post={post}
                        type="description"
                      />
                    </Grid>
                  )}
                  {post.comments.map((comment) => (
                    <Grid item xs={12} key={comment.commentId}>
                      <PostComment
                        date={comment.createdAt}
                        comment={comment}
                        author={comment.author}
                        currentUser={currentUser}
                        post={post}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Grid
                  xs
                  item
                  justifyContent="flex-end"
                  direction="column"
                  container
                >
                  <Divider />
                  <PostFooter currentUser={currentUser} post={post} />
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Dialog>
  );
};
