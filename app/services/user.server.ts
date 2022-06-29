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

export const searchUsers = async (searchString: string) => {
  return (
    await db.user.findMany({
      where: {
        name: { contains: searchString, mode: 'insensitive' },
        OR: { username: { contains: searchString, mode: 'insensitive' } },
      },
      take: 10,
    })
  ).map((user) => _.omit(user, 'password'));
};

interface UpdateUserOptions {
  name?: string;
  username?: string;
  profileDescription?: string;
  email?: string;
  userId: number;
}

export interface ValidationError {
  field: string;
  message?: string;
}

export const updateUser = async ({
  name,
  username,
  profileDescription,
  email,
  userId,
}: UpdateUserOptions) => {
  const errors: ValidationError[] = [];
  const existingUsername = await db.user.findUnique({ where: { username } });
  if (existingUsername && existingUsername.userId !== userId)
    errors.push({
      message: `${username} is already taken by an existing user.`,
      field: 'username',
    });
  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail && existingEmail.userId !== userId)
    errors.push({
      message: `${email} is already taken by an existing user.`,
      field: 'email',
    });

  if (errors.length > 0)
    return {
      errors,
      user: null,
    };

  return {
    errors: null,
    user: await db.user.update({
      where: { userId },
      data: { name, username, profileDescription, email },
    }),
  };
};
