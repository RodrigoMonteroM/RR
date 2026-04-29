import { NextFunction, Request, Response } from "express";
import { logger } from "@/lib/logger";
import UserService from "@/services/UserService";
import { verifyToken } from "@/lib/jwt";

// Extend Express Request to carry userId after auth
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hashedPassword = await Bun.password.hash(req.body.password);
        req.body.password = hashedPassword;
        logger.info("Password hashed successfully");
        next();
    } catch (error: unknown) {
        logger.error("hashPassword failed", error);
        next(error);
    }
};

export const verifyPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        logger.db(`Verifying password for user → ${email}`);

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            logger.error("User not found");
            return res.status(404).json({ message: "Utente non trovato" });
        }

        const isValidPassword = await Bun.password.verify(password, user.password);
        if (!isValidPassword) {
            logger.error("Invalid password");
            return res.status(401).json({ message: "Password non valida" });
        }

        logger.success("Password verified successfully");
        req.body.user = user;
        next();
    } catch (error: unknown) {
        logger.error("verifyPassword failed", error);
        next(error);
    }
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: "Token non fornito" });
        }

        const payload = await verifyToken(token);
        req.userId = payload.userId;
        next();
    } catch (error: unknown) {
        logger.error("authenticateToken failed", error);
        return res.status(401).json({ message: "Token non valido o scaduto" });
    }
};
