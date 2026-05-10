import { Request, Response } from "express";
import { logger } from "@/lib/logger";
import { ItemService } from "@/services/ItemService";


export class  ItemController {
    // GET /boxes/:boxId/items
    static async getItems(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const boxId = req.params.boxId as string;

            const items = await ItemService.getItems(boxId, userId);
            return res.status(200).json(items);
        }catch (error: unknown){
            const msg = error instanceof Error ? error.message : "Internal error";
            logger.error("getItems failed", error);
            return res.status(500).json({ message: msg });
        }
    }

    // POST /boxes/:boxId/items
    static async create(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const boxId = req.params.boxId as string;
            const {content} = req.body;

            const item = await ItemService.create(content, boxId, userId);
            logger.success(`Item created → ${item.id} in box ${boxId}`);

            return res.status(201).json(item);
        }catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Internal error";
            logger.error("create item failed", error);
            return res.status(400).json({ message });
        }
    }

    // / PUT /items/:id
    static async update(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;
            const {content} = req.body;

            const item = await ItemService.update(id, content, userId);
            logger.success(`Item updated → ${id}`);

            return res.status(200).json(item);
        }catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Internal error";
            logger.error("update item failed", error);
            return res.status(400).json({ message });
        }
    }

    // PATCH /items/:id/completed
    static async toggleCompleted(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;
            const {completed} = req.body;

            const item = await ItemService.toggleCompleted(id, completed, userId);
            logger.success(`Item toggled → ${id}`);

            return res.status(200).json(item);
        }catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Internal error";
            logger.error("toggleCompleted failed", error);
            return res.status(400).json({ message });
        }
    }

    // DELETE /items/:id
    static async delete(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;

            await ItemService.delete(id, userId);
            logger.success(`Item deleted → ${id}`);

            return res.status(200).json({ success: true });
        }catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Internal error";
            logger.error("delete item failed", error);
            return res.status(400).json({ message });
        }
    }


}