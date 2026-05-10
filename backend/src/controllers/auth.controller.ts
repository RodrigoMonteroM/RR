import {Request, Response} from "express";
import {logger} from "@/lib/logger";
import UserService from "@/services/UserService";
import {signToken} from "@/lib/jwt";
import {CreateUserInput} from "@/schema/userSchema";
import ResponseMessage from "@/types/ResponseMessage";
import {sendResetEmail} from "@/lib/mailer";

/*
  Routes:
    POST   /api/auth/register         → register
    POST   /api/auth/login            → login
    GET    /api/auth/me               → me
    POST   /api/auth/forgot-password  → forgotPassword
    POST   /api/auth/reset-password   → resetPassword
*/

export class AuthController {
    static async register(req: Request, res: Response) {
        const {email, nickname} = req.body as CreateUserInput;
        logger.db(`Registering user → ${email}`);

        const existingUser = await UserService.getUserByEmailOrNickname(email, nickname);
        if (existingUser) {
            logger.error("User already exists");
            return res.status(409).json({message: "L'utente esiste già"});
        }


        const {password: _, ...user} = await UserService.createUser(req.body);
        logger.success(`User registered → ${user.id}`);

        const token = await signToken({userId: user.id});

        return res.status(201).json({user, token});

    }

    static async login(req: Request, res: Response) {
        const {password: _, ...user} = req.body.user;
        logger.success(`User logged in → ${user.id}`);

        const token = await signToken({userId: user.id});
        return res.status(200).json({user, token});

    }

    static async me(req: Request, res: Response) {
        const userId = req.userId!;
        logger.db(`Getting current user → ${userId}`);

        const found = await UserService.getUserById(userId);
        if (!found) {
            return res.status(404).json({message: "Utente non trovato"});
        }

        const {password: _, ...user} = found;
        return res.status(200).json(user);

    }

    static async forgotPassword(req: Request, res: Response) {
        const {email} = req.body;
        const user = await UserService.getUserByEmail(email);

        if (!user) {
            return res.status(200).json({message: "Si l'email esiste, riceverai un link"});
        }

        const resetToken = crypto.randomUUID();

        await UserService.setResetToken(user.id, resetToken, new Date(Date.now() + 3600000));


        try {
            await sendResetEmail(user.email, resetToken);
        } catch (emailError: unknown) {
            logger.error("Failed to send reset email: ", emailError);
        }

        return res.status(200).json({message: "Si l'email esiste, riceverai un link"});

    }

    static async resetPassword(req: Request, res: Response) {
        const {token, password} = req.body;

        const user = await UserService.getUserByResetToken(token);
        if (!user) {
            return res.status(400).json({message: "Token non valido"});
        }

        if (!user.resetTokenExpirity || user.resetTokenExpirity < new Date()) {
            return res.status(400).json({message: "Token scaduto"});
        }

        await UserService.updatePassword(user.id, password);
        await UserService.clearResetToken(user.id);

        return res.status(200).json({message: "Password aggiornata con successo"});

    }
}
