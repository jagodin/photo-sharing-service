import type { Notification, User } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import _ from 'lodash';

import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';

export interface NotificationsLoaderData {
  notifications: (Notification & { originUser: Omit<User, 'password'> })[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await authenticateUser(request);

  const notifications = (
    await db.notification.findMany({
      where: { userId },
      include: { originUser: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  ).map((notification) => ({
    ...notification,
    originUser: _.omit(notification.originUser, 'password'),
  }));

  return json<NotificationsLoaderData>({
    notifications,
  });
};
