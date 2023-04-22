import { t } from '../trpc';
import prisma from '../db/prismaClient';

export const SETTING_ID = 1;

export const settingsRouter = t.router({
  // Get quote by id
  get: t.procedure.query(async () => {
    const setting = await prisma.settings.findFirstOrThrow({
      where: {
        id: SETTING_ID,
      },
    });

    return setting;
  }),
});
