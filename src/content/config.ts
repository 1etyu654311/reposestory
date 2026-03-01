import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            image: z.string(),
            category: z.enum([
                'technology',
                'finance',
                'personal-development',
                'programming',
                'blog',
            ]),
            tags: z.array(z.string()).default([]),
            author: z
                .object({
                    name: z.string(),
                    avatar: z.string().optional(),
                    bio: z.string().optional(),
                })
                .default({ name: 'Learn New Idea' }),
            lang: z.enum(['ar', 'en', 'es', 'fr']),
            draft: z.boolean().default(false),
        }),
});

export const collections = {
    blog: blogCollection,
};
