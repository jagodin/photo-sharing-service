import { ArrowLeft } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Skeleton,
} from '@mui/material';
import type { Favorites, Post, User } from '@prisma/client';
import type { Comment as CommentModel } from '@prisma/client';

import { PostFooter } from '../PostFooter';

import { Header } from './Header';
import { PostComment } from './PostComment';

import { useLoadImage } from '~/hooks/useLoadImage';
import { useWidth } from '~/hooks/useWidth';

interface PostModalLargeProps {
  open: boolean;
  onClose: () => void;
  post: Post & {
    author: User;
    comments: (CommentModel & {
      author: User;
    })[];
    favorites: (Favorites & {
      user: User;
    })[];
  };
  currentUser: Omit<User, 'password'>;
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
      fullScreen={smallWidth ? true : false}
      fullWidth={true}
      maxWidth={smallWidth ? 'lg' : 'xl'}
      open={open}
      onClose={onClose}
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
          {smallWidth && (
            <Grid
              sx={{ padding: (theme) => theme.spacing(0, 1) }}
              container
              alignItems="center"
              item
            >
              <Grid item xs={1}>
                <IconButton onClick={onClose}>
                  <ArrowLeft />
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <Header currentUser={currentUser} post={post} />
              </Grid>
            </Grid>
          )}
          <Grid item xs={undefined} sm={12} md={7}>
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

          <Grid item xs={undefined} sm={12} md={5}>
            <CardContent sx={{ padding: 0, height: '100%' }}>
              <Grid
                container
                direction="column"
                sx={{ height: '100%' }}
                justifyContent="flex-end"
              >
                {!smallWidth && (
                  <>
                    <Grid item>
                      <Header currentUser={currentUser} post={post} />
                    </Grid>
                    <Divider />
                  </>
                )}
                <Grid
                  container
                  spacing={2}
                  sx={{
                    padding:
                      post.comments.length > 0
                        ? (theme) => theme.spacing(2)
                        : 0,
                  }}
                >
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
