import {
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
import type { Favorites, Post, User } from '@prisma/client';
import type { Comment as CommentModel } from '@prisma/client';

import { PostFooter } from '../PostFooter';

import { Comment } from './Comment';
import { Header } from './Header';

import { useLoadImage } from '~/hooks/useLoadImage';

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

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={open} onClose={onClose}>
      <Card>
        <Grid container>
          <Grid item xs={7}>
            {imageLoaded ? (
              <CardMedia
                component="img"
                image={image?.src}
                alt={post.description || 'unknown'}
              />
            ) : (
              <Skeleton height={500} animation="wave" variant="rectangular" />
            )}
          </Grid>
          <Grid item xs={5}>
            <CardContent sx={{ padding: 0, height: '100%' }}>
              <Grid container direction="column" sx={{ height: '100%' }}>
                <Grid item>
                  <Header currentUser={currentUser} post={post} />
                </Grid>
                <Divider />
                <Grid
                  container
                  spacing={2}
                  sx={{ padding: (theme) => theme.spacing(2) }}
                >
                  {/* <Grid item xs={12}>
                    <Comment
                      date={post.createdAt}
                      author={post.author}
                      comment={post.description}
                      currentUser={currentUser}
                    />
                  </Grid> */}
                  {post.comments.map((comment) => (
                    <Grid item xs={12} key={comment.commentId}>
                      <Comment
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
