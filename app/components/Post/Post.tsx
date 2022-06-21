import { AddComment, Favorite, MoreVert, Send } from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
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
      <CardMedia
        component="img"
        image={post.url}
        alt={post.description || 'unknown'}
      />
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
