import { itemRepository } from "@/repositories/item.repository";
import { BoxService } from "@/services/BoxService";
import { NotFoundError } from "@/lib/errors";

/*
  Routes:
    GET    /api/boxes/:boxId/items       → getItems
    POST   /api/boxes/:boxId/items       → create
    PUT    /api/items/:id                → update
    PATCH  /api/items/:id/completed      → toggleCompleted
    DELETE /api/items/:id                → delete
*/

export class ItemService {
    // GET /boxes/:boxId/items
    static async getItems(boxId: string, userId: string) {
        await BoxService.getBoxById(boxId, userId);
        return await itemRepository.findItemByBoxId(boxId);
    }

    // POST /boxes/:boxId/items
    static async create(content: string, boxId: string, userId: string) {
        await BoxService.getBoxById(boxId, userId);
        return await itemRepository.create({ content, boxId, createdByUserId: userId });
    }

    // PUT /items/:id
    static async update(itemId: string, content: string, userId: string) {
        const item = await itemRepository.findItemById(itemId);
        if (!item) throw new NotFoundError("Item not found");

        await BoxService.getBoxById(item.boxId, userId);
        return await itemRepository.update(itemId, { content });
    }

    // DELETE /items/:id
    static async delete(itemId: string, userId: string) {
        const item = await itemRepository.findItemById(itemId);
        if (!item) throw new NotFoundError("Item not found");

        await BoxService.getBoxById(item.boxId, userId);
        return await itemRepository.delete(itemId);
    }

    // PATCH /items/:id/completed → toggleCompleted
    static async toggleCompleted(itemId: string, completed: boolean, userId: string) {
        const item = await itemRepository.findItemById(itemId);
        if (!item) throw new NotFoundError("Item not found");

        await BoxService.getBoxById(item.boxId, userId);
        return await itemRepository.updateItemToggle(itemId, completed);
    }
}
