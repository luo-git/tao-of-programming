import express from 'express';
import cors from 'cors';
import * as path from 'path';
import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { postsRouter } from './routers';

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  posts: postsRouter,
});

const app = express();

app.use(
  cors({
    origin: ['http://localhost:4200'],
  })
);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);

export type AppRouter = typeof appRouter;
