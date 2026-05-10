import { Router } from "express";
import { ItemController } from "@/controllers/item.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validators";
import { createItemSchema, updateItemSchema, toggleItemSchema } from "@/schema/itemSchema";

const router = Router();

router.get("/boxes/:boxId/items", authenticateToken, ItemController.getItems);
router.post("/boxes/:boxId/items", authenticateToken, validate(createItemSchema), ItemController.create);
router.put("/items/:id", authenticateToken, validate(updateItemSchema), ItemController.update);
router.patch("/items/:id/completed", authenticateToken, validate(toggleItemSchema), ItemController.toggleCompleted);
router.delete("/items/:id", authenticateToken, ItemController.delete);

export default router;
