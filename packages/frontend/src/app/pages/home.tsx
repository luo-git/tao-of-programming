import * as React from 'react';
import { trpc } from '../utils/trpc';

export default function Home() {
  const postsQuery = trpc.posts.getAll.useQuery();

  return <div>{JSON.stringify(postsQuery.data)}</div>;
}
