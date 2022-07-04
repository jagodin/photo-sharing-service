import { useCallback, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import type { User } from '@prisma/client';
import { useFetcher } from '@remix-run/react';

import { Post } from '../Post';

import { useScroll } from '~/hooks/useScroll';
import type { PostsLoaderData } from '~/routes/resource/posts';
import type { PostWithAuthorAndFavorites } from '~/utils/types';

interface FeedProps {
  initialPosts: PostWithAuthorAndFavorites[];
  currentUser: Omit<User, 'password'>;
}

export const Feed = ({ initialPosts, currentUser }: FeedProps) => {
  const fetcher = useFetcher<PostsLoaderData>();
  const [height, setHeight] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [posts, setPosts] =
    useState<PostWithAuthorAndFavorites[]>(initialPosts);
  const [cursor, setCursor] = useState(
    initialPosts[initialPosts.length - 1].postId
  );

  const { clientHeight, scrollPosition } = useScroll();

  const divHeight = useCallback(
    (node) => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
    },
    [posts.length] // eslint-disable-line
  );

  useEffect(() => {
    if (!shouldFetch || !height) return;
    if (clientHeight + scrollPosition + 100 < height) return;

    fetcher.load(`/resource/posts?take=3&cursor=${cursor}`);

    setShouldFetch(false);
  }, [clientHeight, scrollPosition, fetcher, height, shouldFetch, cursor]);

  useEffect(() => {
    // Discontinue API calls if the last page has been reached
    if (fetcher.data && fetcher.data.posts.length === 0) {
      setShouldFetch(false);
      return;
    }

    // Photos contain data, merge them and allow the possibility of another fetch
    if (fetcher.data && fetcher.data.posts.length > 0) {
      const newPosts = fetcher.data.posts;
      setPosts((prevPhotos) => [...prevPhotos, ...newPosts]);
      const cursorId = newPosts[newPosts.length - 1].postId;
      setCursor(cursorId);
      setShouldFetch(true);
    }
  }, [fetcher.data]);

  return (
    <Grid ref={divHeight} container spacing={4}>
      {posts.map((post) => (
        <Grid key={post.postId} item xs={12}>
          <Post currentUser={currentUser} post={post} />
        </Grid>
      ))}
    </Grid>
  );
};
