import { z } from "zod";

export const createBoxSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
});

export const updateBoxSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
});

export type CreateBoxInput = z.infer<typeof createBoxSchema>;
export type UpdateBoxInput = z.infer<typeof updateBoxSchema>;