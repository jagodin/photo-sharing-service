import { Grid } from '@mui/material';
import type { Notification as NotificationModel, User } from '@prisma/client';

import { Notification } from './Notification';

interface NotificationsListProps {
  notifications: (NotificationModel & {
    originUser: Omit<User, 'password' | 'email'>;
  })[];
}
export const NotificationList = ({ notifications }: NotificationsListProps) => {
  return (
    <Grid container rowGap={1}>
      {notifications.map((notification) => (
        <Notification
          key={notification.notificationId}
          notification={notification}
        />
      ))}
    </Grid>
  );
};
