import type { Prisma } from '@prisma/client';
import crypto from 'crypto';

import { db } from './db.server';

export const isValidURL = (url: string) => {
  const regex = new RegExp(
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi
  );

  return url.match(regex);
};

function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '');
}

export const createURL = async (originalUrl: string) => {
  const sanitizedUrl = removeHttp(originalUrl);
  const hasher = crypto.createHmac('sha256', process.env.SESSION_SECRET!);
  const hash = hasher.update(sanitizedUrl).digest('base64');
  const encoded = Buffer.from(hash).toString('base64').slice(0, 6);

  const original = await db.url.findUnique({ where: { hash: encoded } });

  if (original) {
    return encoded;
  }

  const url: Prisma.UrlCreateInput = {
    hash: encoded,
    originalUrl: sanitizedUrl,
    expirationDate: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ),
  };

  await db.url.create({ data: url });

  return encoded;
};
