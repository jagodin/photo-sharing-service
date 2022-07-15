import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';
import { PostType } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const createUsers: () => Promise<
  Prisma.UserCreateInput[]
> = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password', salt);

  return Array(50)
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

export const createPosts: (
  userId: number,
  postUrls: string[]
) => Prisma.PostCreateManyInput[] = (userId, posts) => {
  return Array(12)
    .fill(0)
    .map((_) => {
      const postUrl = posts[Math.floor(Math.random() * posts.length)];
      return {
        description: faker.lorem.sentence(),
        authorId: userId,
        type: PostType.PICTURE,
        url: postUrl,
      };
    });
};
