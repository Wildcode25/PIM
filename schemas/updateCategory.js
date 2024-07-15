import z from 'zod';

export const updateCategorySchema = z.object(
    {
        name: z.string().max(20),
        description: z.string({
            requred: false
        })
    }
)