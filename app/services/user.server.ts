import type { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import { AuthorizationError } from 'remix-auth';

import { db } from './db.server';

export const login = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw new AuthorizationError('Invalid credentials');
  }

  if (!(await passwordMatchesHash(password, user.password))) {
    throw new AuthorizationError('Invalid credentials');
  }

  return _.omit(user, ['password']);
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
  let user = await db.user.findUnique({ where: { email } });

  if (user) {
    throw new Response('A user already exists with this email.', {
      status: 400,
    });
  }

  user = await db.user.findUnique({ where: { username } });

  if (user) {
    throw new Response('A user already exists with this username.', {
      status: 400,
    });
  }

  const newUser: Prisma.UserCreateInput = {
    name: firstName.trim() + ' ' + lastName.trim(),
    email: email.trim(),
    password: password.trim(),
    username: password.trim(),
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
        OR: [
          {
            username: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 15,
    })
  ).map((user) => _.omit(user, 'password'));
};

interface UpdateUserOptions {
  name?: string;
  username?: string;
  profileDescription?: string;
  email?: string;
  userId: number;
  profilePicture?: string;
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
  profilePicture,
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
      data: { name, username, profileDescription, email, profilePicture },
    }),
  };
};

interface ChangePasswordOptions {
  newPassword: string;
  user: User;
}

export const changePassword = async ({
  newPassword,
  user,
}: ChangePasswordOptions) => {
  const salt = await bcrypt.genSalt(10);

  const hashed = await bcrypt.hash(newPassword, salt);

  return await db.user.update({
    where: { userId: user.userId },
    data: { password: hashed },
  });
};

export const passwordMatchesHash = async (password: string, hashed: string) =>
  await bcrypt.compare(password, hashed);
