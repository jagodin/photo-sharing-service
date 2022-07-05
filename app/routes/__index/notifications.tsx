import { useEffect } from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { useFetcher } from '@remix-run/react';

import { NotificationList } from '~/components/NotificationsPopover/NotificationList';
import type { NotificationsLoaderData } from '~/routes/resource/notifications';

export default function Notifications() {
  const fetcher = useFetcher<NotificationsLoaderData>();

  useEffect(() => {
    if (fetcher.type === 'init') {
      fetcher.load('/resource/notifications');
    }
  }, [fetcher]);

  const notifications = fetcher.data?.notifications;
  return (
    <Grid container alignItems="center" justifyContent="center">
      {fetcher.state !== 'idle' ? (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      ) : notifications?.length === 0 ? (
        <Typography variant="body1">
          No notifications yet! Follow accounts and engage with our community!
        </Typography>
      ) : (
        <Grid item xs={12}>
          <NotificationList notifications={notifications || []} />
        </Grid>
      )}
    </Grid>
  );
}
