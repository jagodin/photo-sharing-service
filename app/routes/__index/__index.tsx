import { Grid } from '@mui/material';
import type { Prisma } from '@prisma/client';
import { Outlet } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

import { Feed } from '~/components/Feed';
import { authenticateUser } from '~/services/auth.server';
import { getPosts } from '~/services/posts.server';

interface LoaderData {
  posts: Prisma.PromiseReturnType<typeof getPosts>;
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateUser(request);
  const data: LoaderData = {
    posts: await getPosts(),
  };

  return json(data);
};

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <Grid container spacing={3}>
      <Outlet />
      <Grid item xs={12} sm={12} md={8}>
        <Feed posts={posts} />
      </Grid>
    </Grid>
  );
}