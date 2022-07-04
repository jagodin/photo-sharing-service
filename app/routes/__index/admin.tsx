import { Grid } from '@mui/material';
import type { Post } from '@prisma/client';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { CompactPost } from '~/components/CompactPost';
import { authenticateUser } from '~/services/auth.server';
import { db } from '~/services/db.server';

interface LoaderData {
  posts: Post[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticateUser(request);

  if (!user.isAdmin) redirect('/');

  return json<LoaderData>({
    posts: await db.post.findMany({ where: { approved: false } }),
  });
};

export default function Admin() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <Grid container rowGap={2}>
      {posts.map((post) => (
        <Grid xs={12} item key={post.postId}>
          <CompactPost post={post} />
        </Grid>
      ))}
    </Grid>
  );
}
