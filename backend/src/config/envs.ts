import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
    PORT: z.string().transform(Number).pipe(z.number().positive()),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().transform(Number).pipe(z.number().positive()),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string().email(),
    FRONTEND_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});


export type Env = z.infer<typeof envSchema>;



