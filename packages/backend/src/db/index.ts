import { z } from "zod";

export const posts: Post[] = [
    {
        id: 1,
        title: 'title',
        content: `A CEO once asked a manager, "How long will it take for the programmers to debug this software?" \
        The manager responded confidently, "It will take no more than a week." \
        The CEO raised an eyebrow, "Are you sure? How do you know?" \
        The manager shrugged, "Well, it's just a guess. But if we tell them it will take a week, they'll have it done in two days. If we tell them it will take two days, they'll have it done in a week."`
    }
];

const Post = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
});

const Posts = z.array(Post);


export type Post = z.infer<typeof Post>;

export type Posts = z.infer<typeof Posts>;