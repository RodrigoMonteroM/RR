import { Router, Request, Response } from "express";
import ResponseMessage from "@/types/ResponseMessage";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    const response: ResponseMessage = {
        message: "OK",
    };
    return res.status(200).json(response);
});

export default router;