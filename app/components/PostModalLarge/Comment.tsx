import { Avatar, Grid, Stack, Typography } from '@mui/material';
import type { User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';
import moment from 'moment';

interface CommentProps {
  author: User;
  comment: string | null;
  date: Date;
}

export const Comment = ({ author, comment, date }: CommentProps) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/${author.username}`);
  };

  return (
    <Grid container>
      <Stack alignItems="center" spacing={2} direction="row">
        <Avatar
          src={author.profilePicture || undefined}
          sx={{ height: 30, width: 30 }}
          onClick={goToProfile}
        />

        <span>
          <Typography onClick={goToProfile} variant="body2" fontWeight={600}>
            {author.username}
          </Typography>
          <Typography variant="body1">{comment}</Typography>
          <Typography sx={{ mt: 1 }} variant="subtitle2">
            {moment(date).fromNow()}
          </Typography>
        </span>
      </Stack>
    </Grid>
  );
};
