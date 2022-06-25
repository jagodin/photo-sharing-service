import {
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
import type { Post, User } from '@prisma/client';

import { Comment } from './Comment';
import { Footer } from './Footer';
import { Header } from './Header';

import { useLoadImage } from '~/hooks/useLoadImage';

interface PostModalLargeProps {
  open: boolean;
  onClose: () => void;
  post: Post & {
    author: User;
  };
}

export const PostModalLarge = ({
  open,
  onClose,
  post,
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
                  <Header post={post} />
                </Grid>
                <Divider />
                <Grid
                  container
                  spacing={2}
                  sx={{ padding: (theme) => theme.spacing(2) }}
                >
                  <Grid item xs={12}>
                    <Comment
                      date={post.createdAt}
                      author={post.author}
                      comment={post.description}
                    />
                  </Grid>
                </Grid>

                <Divider />
                <Grid
                  xs
                  item
                  justifyContent="flex-end"
                  direction="column"
                  container
                >
                  <Divider />
                  <Footer post={post} />
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Dialog>
  );
};
