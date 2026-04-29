import { ZodError, ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validazione fallita",
                    errors: error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            next(error);
        }
    };
};