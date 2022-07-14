import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';
import { PostType } from '@prisma/client';
import axios from 'axios';
import bcrypt from 'bcryptjs';

export const createUsers: () => Promise<
  Prisma.UserCreateInput[]
> = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password', salt);

  return Array(75)
    .fill(0)
    .map((_) => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      return {
        name: firstName + ' ' + lastName,
        email: faker.internet.email(firstName, lastName),
        profilePicture: faker.image.avatar(),
        username: faker.internet.userName(firstName, lastName),
        password,
        profileDescription: faker.lorem.sentence(),
      };
    });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createPosts: (
  userId: number
) => Promise<Prisma.PostCreateManyInput[]> = async (userId) => {
  return Promise.all(
    Array(12)
      .fill(0)
      .map(async (_, index) => {
        await sleep(index * 200);
        const res = await axios.get('https://picsum.photos/640/640');
        const url = res?.request._redirectable._currentUrl;

        return {
          description: faker.lorem.sentence(),
          authorId: userId,
          type: PostType.PICTURE,
          url,
        };
      })
  );
};
