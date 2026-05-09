import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10),
    PORT: z.string().transform(Number).pipe(z.number().positive()),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().transform(Number).pipe(z.number().positive()),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string().email(),
    FRONTEND_URL: z.string().url(),
});


export type Env = z.infer<typeof envSchema>;



