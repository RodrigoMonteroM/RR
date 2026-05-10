import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().email("Email non valida"),
    password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
    nickname: z.string().min(3, "Il nickname deve contenere almeno 3 caratteri"),
    firstName: z.string().min(3, "Il nome deve contenere almeno 3 caratteri"),
    lastName: z.string().min(3, "Il cognome deve contenere almeno 3 caratteri"),
    avatarUrl: z.string().url("URL non valido").optional(),
});

export const updateUserSchema = z.object({
    firstName: z.string().min(2, "Il nome deve contenere almeno 2 caratteri").optional(),
    lastName: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri").optional(),
    nickname: z.string().min(3, "Il nickname deve contenere almeno 3 caratteri").optional(),
    avatarUrl: z.string().url("URL non valido").optional(),
});


export const loginUserSchema = z.object({
    email: z.string().email("Email non valida"),
    password: z.string().min(1, "La password è obbligatoria")
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email non valida"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token obbligatorio"),
    password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;