import { Box, Grid, Link, Stack, Typography } from '@mui/material';
import type { Notification as NotificationModel, User } from '@prisma/client';
import moment from 'moment';

import { Avatar } from '../Avatar';

import { useWidth } from '~/hooks/useWidth';

interface NotificationProps {
  notification: NotificationModel & { originUser: Omit<User, 'password'> };
}

export const Notification = ({ notification }: NotificationProps) => {
  const width = useWidth();

  const smallWidth = width === 'xs';

  return (
    <Grid
      item
      xs={12}
      container
      alignItems="center"
      justifyContent={smallWidth ? 'flex-start' : 'space-between'}
      spacing={4}
    >
      <Grid item>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar user={notification.originUser} />
          <Typography variant="body1" fontWeight={600}>
            <Link
              fontWeight={600}
              color="text.primary"
              href={`/${notification.originUser.username}`}
              underline="hover"
            >
              {notification.originUser.username}
            </Link>{' '}
            <Box
              sx={{ display: 'inline', fontWeight: 500, ml: 1 }}
              color="text.primary"
            >
              {notification.type === 'LIKE'
                ? 'liked your post.'
                : 'followed you.'}
            </Box>
          </Typography>
        </Stack>
      </Grid>
      {!smallWidth && (
        <Grid item>
          <Typography variant="subtitle2">
            {moment(notification.createdAt).fromNow()}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
