import {Request, Response} from "express";
import {logger} from "@/lib/logger";
import {ItemService} from "@/services/ItemService";


export class ItemController {
    // GET /boxes/:boxId/items
    static async getItems(req: Request, res: Response) {
        const userId = req.userId!;
        const boxId = req.params.boxId as string;

        const items = await ItemService.getItems(boxId, userId);
        return res.status(200).json(items);

    }

    // POST /boxes/:boxId/items
    static async create(req: Request, res: Response) {
        const userId = req.userId!;
        const boxId = req.params.boxId as string;
        const {content} = req.body;

        const item = await ItemService.create(content, boxId, userId);
        logger.success(`Item created → ${item.id} in box ${boxId}`);

        return res.status(201).json(item);

    }

    // / PUT /items/:id
    static async update(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;
        const {content} = req.body;

        const item = await ItemService.update(id, content, userId);
        logger.success(`Item updated → ${id}`);

        return res.status(200).json(item);

    }

    // PATCH /items/:id/completed
    static async toggleCompleted(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;
        const {completed} = req.body;

        const item = await ItemService.toggleCompleted(id, completed, userId);
        logger.success(`Item toggled → ${id}`);

        return res.status(200).json(item);

    }

    // DELETE /items/:id
    static async delete(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;

        await ItemService.delete(id, userId);
        logger.success(`Item deleted → ${id}`);

        return res.status(200).json({success: true});

    }


}