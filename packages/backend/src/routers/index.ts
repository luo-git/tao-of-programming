import { z } from 'zod';
import { posts } from '../db';
import { TRPCError } from '@trpc/server';
import { t } from '../trpc';

export const postsRouter = t.router({
  get: t.procedure.input(z.number()).query((req) => {
    const foundPost = posts.find((p) => p.id === req.input);

    if (!foundPost) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No post with the specified id found!',
      });
    }

    return foundPost;
  }),
  getAll: t.procedure.query(() => {
    return posts;
  }),
});
