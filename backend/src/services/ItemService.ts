import {prisma} from "@/lib/prisma";
import {logger} from "@/lib/logger";
import {itemRepository} from "@/repositories/item.repository";

/*
  Routes:
    GET    /api/boxes/:boxId/items       → getItems
    POST   /api/boxes/:boxId/items       → create
    PUT    /api/items/:id                → update
    PATCH  /api/items/:id/completed      → toggleCompleted
    DELETE /api/items/:id                → delete
*/

export class ItemService {
    // Helper — verifica si el usuario puede acceder a una box (dueño o couple)
    private static async canAccessToBox(boxId: string, userId: string): Promise<boolean> {
        const box = await prisma.box.findUnique({
            where: {id: boxId},
            select: {createdByUserId: true, coupleId: true}
        })
        if (!box) return false;
        if (box.createdByUserId === userId) return true;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {coupleId: true},
        })

        if (!user) return false;

        return (user.coupleId !== null && user.coupleId === box.coupleId)

    }

    // GET /boxes/:boxId/items
    public static async getItems(boxId: string, userId: string) {
        try {
            const hasAccess = await this.canAccessToBox(boxId, userId);
            if (!hasAccess) throw new Error("Box not found or not authorized");

            return await itemRepository.findItemByBoxId(boxId);
        } catch (error) {
            logger.error(`getItems error`, error);
            throw error;
        }
    }

    // POST /boxes/:boxId/items
    public static async create(content: string, boxId: string, userId: string) {
        try {
            const hasAccess = await this.canAccessToBox(boxId, userId);
            if (!hasAccess) throw new Error("Box not found or not authorized");
            const item = await itemRepository.create({ content, boxId, createdByUserId: userId });
            logger.success(`Item created → ${item.id} in box ${boxId}`);
            return item;
        } catch (error) {
            logger.error("create item failed", error);
            throw error;
        }
    }

    // PUT /items/:id
    public  static async update(itemId: string, content: string, userId: string) {
        try {
            const item = await itemRepository.findItemById(itemId);
            if(!item) throw new Error("Item not found");

            const hasAccess = await this.canAccessToBox(item.boxId, userId);
            if(!hasAccess) throw new Error("Not authorized");

            const itemUpdated = await itemRepository.update(itemId, {content});
            logger.success(`Item updated → ${itemId}`);
            return itemUpdated;

        }catch(error) {
            logger.error("update item failed", error);
            throw error;
        }
    }

    // DELETE /items/:id
    public static async delete(itemId: string, userId: string) {
        try {
            const item = await itemRepository.findItemById(itemId);
            if(!item) throw new Error("Item not found");
            const hasAccess = await this.canAccessToBox(item.boxId, userId);
            if (!hasAccess) throw new Error("Not authorized");
            return await itemRepository.delete(itemId);
        }catch (error){
            logger.error("delete item failed", error);
            throw error;
        }
    }

    //PATCH  items/:id/completed      → toggleCompleted
    public static async toggleCompleted(itemId: string, completed: boolean, userId: string) {
        try {
            const item = await itemRepository.findItemById(itemId);
            if (!item) throw new Error("Item not found");

            const hasAccess = await this.canAccessToBox(item.boxId, userId);
            if(!hasAccess) throw new Error("Not authorized");

            const itemUpdated = await itemRepository.updateItemToggle(itemId, completed);
            logger.success(`Item toggled → ${itemId}`);
            return itemUpdated;

        }catch(error) {
            logger.error("toggleCompleted failed", error);
            throw error;
        }
    }

}
