import { Comment, Favorite, Send, Share } from '@mui/icons-material';
import { Grid, IconButton, Input, Stack, Tooltip } from '@mui/material';
import type { Post, User } from '@prisma/client';

interface FooterProps {
  post: Post & {
    author: User;
  };
}

export const Footer = ({ post }: FooterProps) => {
  return (
    <Grid container sx={{ padding: (theme) => theme.spacing(1, 2) }}>
      <Stack direction="row">
        <Tooltip title="Favorite">
          <IconButton>
            <Favorite />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton>
            <Share />
          </IconButton>
        </Tooltip>
      </Stack>
      <Grid item xs={12}>
        <Input
          disableUnderline
          fullWidth
          placeholder="Add a comment..."
          endAdornment={
            <IconButton>
              <Send />
            </IconButton>
          }
        />
      </Grid>
    </Grid>
  );
};
