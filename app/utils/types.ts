import type { Favorites, Post, User } from '@prisma/client';

export interface ValidationError {
  field: string;
  message?: string;
}

export interface Message {
  severity: 'error' | 'success' | 'info';
  message: string;
}

export type PostWithAuthorAndFavorites = Post & {
  author: User;
  favorites: (Favorites & {
    user: User;
  })[];
};
