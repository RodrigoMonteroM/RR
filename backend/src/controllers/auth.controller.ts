import { Request, Response } from "express";
import { logger } from "@/lib/logger";
import UserService from "@/services/UserService";
import { signToken } from "@/lib/jwt";
import { CreateUserInput } from "@/schema/userSchema";
import ResponseMessage from "@/types/ResponseMessage";

export const register = async (req: Request, res: Response) => {
    try {
        const { email } = req.body as CreateUserInput;
        logger.db(`Registering user → ${email}`);

        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            logger.error("User already exists");
            return res.status(409).json({ message: "L'utente esiste già" });
        }

        const { password: _, ...user } = await UserService.createUser(req.body);
        logger.success(`User registered → ${user.id}`);

        const token = await signToken({ userId: user.id });
        const response: ResponseMessage<typeof user> = {
            message: "Utente registrato con successo",
            data: user,
        };

        return res.status(201).json({ ...response, token });
    } catch (error: unknown) {
        logger.error("register failed", error);
        return res.status(500).json({ message: "Errore interno del server" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // verifyPassword middleware already ran — req.body.user is the authenticated user
        const { password: _, ...user } = req.body.user;
        logger.success(`User logged in → ${user.id}`);

        const token = await signToken({ userId: user.id });
        return res.status(200).json({ user, token });
    } catch (error: unknown) {
        logger.error("login failed", error);
        return res.status(500).json({ message: "Errore interno del server" });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        // authenticateToken middleware already ran — req.userId is set
        const userId = req.userId!;
        logger.db(`Getting current user → ${userId}`);

        const found = await UserService.getUserById(userId);
        if (!found) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        const { password: _, ...user } = found;
        return res.status(200).json(user);
    } catch (error: unknown) {
        logger.error("me failed", error);
        return res.status(500).json({ message: "Errore interno del server" });
    }
};

