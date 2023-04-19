import { initTRPC } from '@trpc/server';
import { postsRouter } from './routers';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const t = initTRPC.create();

export const appRouter = t.router({
  posts: postsRouter,
});
