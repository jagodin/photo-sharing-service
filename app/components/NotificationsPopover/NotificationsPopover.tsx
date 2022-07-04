import { useEffect } from 'react';
import { CircularProgress, Grid, Popover, Typography } from '@mui/material';
import { useFetcher } from '@remix-run/react';

import { NotificationList } from './NotificationList';

import type { NotificationsLoaderData } from '~/routes/resource/notifications';

interface NotificationsPopoverProps {
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export const NotificationsPopover = ({
  onClose,
  anchorEl,
}: NotificationsPopoverProps) => {
  const open = Boolean(anchorEl);

  const fetcher = useFetcher<NotificationsLoaderData>();

  useEffect(() => {
    if (fetcher.type === 'init') {
      fetcher.load('/resource/notifications');
    }
  }, [fetcher]);

  const notifications = fetcher.data?.notifications;

  return (
    <Popover
      elevation={10}
      disableAutoFocus
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Grid
        maxWidth="sm"
        container
        sx={{ backgroundColor: 'white', padding: (theme) => theme.spacing(2) }}
      >
        {fetcher.state !== 'idle' ? (
          <CircularProgress />
        ) : notifications?.length === 0 ? (
          <Typography variant="body1">
            No notifications yet! Follow accounts and engage with our community!
          </Typography>
        ) : (
          <NotificationList notifications={notifications || []} />
        )}
      </Grid>
    </Popover>
  );
};
