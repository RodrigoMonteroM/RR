import {z} from 'zod';

export const createItemSchema = z.object({
    content: z.string().min(1).max(2000)
});

export const updateItemSchema = z.object({
    content: z.string().min(1).max(2000)
});

export const toggleItemSchema = z.object({
    completed: z.boolean()
})

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ToggleItemSchema = z.infer<typeof toggleItemSchema>;