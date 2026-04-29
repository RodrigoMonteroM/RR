import { Request, Response, NextFunction } from "express";
import { logger } from "@/lib/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
        logger.request(req.method, req.path, res.statusCode, Date.now() - start);
    });
    next();
};
