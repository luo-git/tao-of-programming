import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import prisma from '../db/prismaClient';

export const quotesRouter = t.router({
  // Get quote by id
  get: t.procedure.input(z.number()).query(async ({ input }) => {
    const foundQuote = await prisma.quote.findUnique({
      where: {
        id: input,
      },
    });

    if (!foundQuote) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No quote with the specified id found!',
      });
    }

    return foundQuote;
  }),

  getFirst: t.procedure.query(async () => {
    const foundQuote = await prisma.quote.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!foundQuote) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No quote found!',
      });
    }

    return foundQuote;
  }),

  // Get all posts
  getAll: t.procedure.query(async () => {
    return await prisma.quote.findMany();
  }),

  // Create
  create: t.procedure
    .input(
      z.object({
        openingId: z.number().optional(),
        content: z.string(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.quote.create({
        data: {
          ...input,
        },
      });
    }),
});
