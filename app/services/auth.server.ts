import type { User } from '@prisma/client';
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { login } from './user.server';

import { sessionStorage } from '~/services/session.server';

const authenticator = new Authenticator<Omit<User, 'password'>>(
  sessionStorage,
  {
    sessionKey: 'sessionKey',
    sessionErrorKey: 'sessionErrorKey',
  }
);

const formStrategy = new FormStrategy(async ({ form }) => {
  let email = form.get('email') as string;
  let password = form.get('password') as string;

  const user = await login(email, password);
  console.log(user);

  return user;
});

authenticator.use(formStrategy);

export { authenticator };

export const authenticateUser = async (request: Request) =>
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
