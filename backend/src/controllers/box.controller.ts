import {Request, Response} from "express";
import {logger} from "@/lib/logger";
import {BoxService} from "@/services/BoxService";

/*
  Routes:
    POST   /api/boxes              → create
    GET    /api/boxes              → getBoxes
    GET    /api/boxes/:id          → getBoxById
    PUT    /api/boxes/:id          → update
    DELETE /api/boxes/:id          → delete
    PUT    /api/boxes/:id/visibility → changeVisibility
*/

export class BoxController {
    static async create(req: Request, res: Response) {
        const userId = req.userId!;
        const {name, description} = req.body;

        const box = await BoxService.create({name, description}, userId);
        logger.success(`Box created → ${box.id}`);

        return res.status(201).json(box);

    }

    static async getBoxes(req: Request, res: Response) {
        const userId = req.userId!;

        const boxes = await BoxService.getBoxes(userId);
        return res.status(200).json(boxes);
    }

    static async getBoxById(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;

        const box = await BoxService.getBoxById(id, userId);
        if (!box) return res.status(404).json({message: "Box not found"});

        return res.status(200).json(box);

    }

    static async update(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;
        const {name, description} = req.body;

        const box = await BoxService.update(id, {name, description}, userId);
        logger.success(`Box updated → ${id}`);

        return res.status(200).json(box);

    }

    static async delete(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;

        await BoxService.delete(id, userId);
        logger.success(`Box deleted → ${id}`);

        return res.status(200).json({success: true});

    }

    static async changeVisibility(req: Request, res: Response) {
        const userId = req.userId!;
        const id = req.params.id as string;

        const box = await BoxService.changeVisibility(id, userId);
        logger.success(`Box visibility changed → ${id}`);

        return res.status(200).json(box);

    }
}