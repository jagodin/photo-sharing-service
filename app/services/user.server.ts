import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import { AuthorizationError } from 'remix-auth';

import { db } from './db.server';

export const login = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw new AuthorizationError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AuthorizationError('Invalid credentials');
  }

  return _.omit(user, 'password');
};

interface RegisterOptions {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export const register = async ({
  email,
  password,
  firstName,
  lastName,
  username,
}: RegisterOptions) => {
  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    throw new Response('A user already exists with this email', {
      status: 400,
    });
  }

  const newUser: Prisma.UserCreateInput = {
    name: firstName + ' ' + lastName,
    email,
    password,
    username,
    lastLogin: new Date(),
  };

  const salt = await bcrypt.genSalt(10);

  newUser.password = await bcrypt.hash(password, salt);

  return _.omit(await db.user.create({ data: newUser }), 'password');
};
