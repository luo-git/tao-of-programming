import { initTRPC } from '@trpc/server';
import { quotesRouter } from './routers/quotesRouter';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const t = initTRPC.create();

export const appRouter = t.router({
  quotes: quotesRouter,
});
