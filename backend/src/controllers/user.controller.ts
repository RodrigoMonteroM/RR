import { Request, Response } from "express";
import { logger } from "@/lib/logger";
import UserService from "@/services/UserService";
import ResponseMessage from "@/types/ResponseMessage";

export default class UserController {
    static async getUser(req: Request, res: Response) {
        try {
            const { nickname } = req.params;
            logger.db(`Getting user by nickname → ${nickname}`);

            const user = await UserService.getUserByNickname(nickname as string);
            if (!user) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            const { password: _, resetToken, resetTokenExpirity, email, coupleId, ...userResponse } = user;
            const response: ResponseMessage<typeof userResponse> = {
                message: "Utente trovato con successo",
                data: userResponse,
            };

            return res.status(200).json(response);
        } catch (error: unknown) {
            logger.error("getUser failed", error);
            return res.status(500).json({ message: "Errore interno del server" });
        }
    }

    static async searchUsers(req: Request, res: Response) {
        try {
            const { q } = req.query;
            const currentUserId = req.userId; // Get from authenticateToken middleware
            
            logger.db(`Searching users by query → ${q} (excluding user ${currentUserId})`);

            if (!q) {
                return res.status(400).json({ message: "Il parametro di ricerca è obbligatorio" });
            }

            const users = await UserService.searchUsers(q as string, currentUserId || "");

            return res.status(200).json({
                message: "Utenti trovati con successo",
                data: users,
            });
        } catch (error: unknown) {
            logger.error("searchUsers failed", error);
            return res.status(500).json({ message: "Errore interno del server" });
        }
    }
}
