import cron from 'node-cron';

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import prisma from '../db/prismaClient';

import { Configuration, OpenAIApi } from 'openai';
import { getRandomItem } from '../helpers/random';
import { computingTopics } from '../helpers/topics';
import { storyDirections } from '../helpers/directions';
import { SETTING_ID } from './settingsRouter';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const messageFormat = z.object({
  story: z.string(),
  keywords: z.array(z.string()),
});

function getChatPrompt(input: { topic: string; direction: string }): string {
  return `Write with the same style as The Tao of Programming book about ${input.topic}. The story should be ${input.direction}. The story should be shorter than 4 sentences short story with characters such as master programmer and novice programmer. Format the json output like the following: {"story": "<story>","keywords": [<keywords>]}`;
}

export const generatorRouter = t.router({
  // Create
  create: t.procedure.mutation(async () => {
    const setting = await prisma.settings.findFirstOrThrow({
      where: {
        id: SETTING_ID,
      },
    });

    if (setting.currentCount >= setting.dailyLimit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Daily limit reached!',
      });
    }

    const topic = getRandomItem(computingTopics);
    const direction = getRandomItem(storyDirections);
    const prompt = getChatPrompt({ topic, direction });

    console.log(prompt);

    const { data } = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log(JSON.stringify(data));

    if (!data.choices[0].message) {
      console.log('Unable to get a response!');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to get a response!',
      });
    }

    const content = messageFormat.parse(
      JSON.parse(data.choices[0].message.content)
    );

    console.log(content);

    const result = await prisma.quote.create({
      data: {
        content: content.story,
        tags: content.keywords,
      },
    });

    // ! TODO: Might have concurrency issues
    await prisma.settings.update({
      where: {
        id: SETTING_ID,
      },
      data: {
        currentCount: setting.currentCount + 1,
      },
    });

    return result;
  }),
});

// Reset count every day
cron.schedule('0 0 * * *', async () => {
  await prisma.settings.update({
    where: {
      id: SETTING_ID,
    },
    data: {
      currentCount: 0,
    },
  });
});
