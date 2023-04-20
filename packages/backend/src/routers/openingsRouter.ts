import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import prisma from '../db/prismaClient';

export const openingsRouter = t.router({
  // Get quote by id
  get: t.procedure.input(z.number()).query(async ({ input }) => {
    const foundOpening = await prisma.opening.findUnique({
      where: {
        id: input,
      },
    });

    if (!foundOpening) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No opening with the specified id found!',
      });
    }

    return foundOpening;
  }),

  // Get all posts
  getAll: t.procedure.query(async () => {
    return await prisma.opening.findMany();
  }),

  // Create
  create: t.procedure
    .input(
      z.object({
        content: z.string(),
        topic: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.opening.create({
        data: {
          ...input,
        },
      });
    }),
});
