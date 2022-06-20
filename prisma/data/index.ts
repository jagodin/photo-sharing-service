import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';
import { PostType } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const createUsers: () => Promise<
  Prisma.UserCreateInput[]
> = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password', salt);

  return Array(10)
    .fill(0)
    .map((_) => {
      return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password,
      };
    });
};

export const createPosts: (userId: number) => Prisma.PostCreateManyInput[] = (
  userId
) => {
  return Array(10)
    .fill(0)
    .map((_) => {
      return {
        description: faker.lorem.sentence(),
        authorId: userId,
        type: PostType.PICTURE,
        url: faker.image.nature(undefined, undefined, true),
      };
    });
};
