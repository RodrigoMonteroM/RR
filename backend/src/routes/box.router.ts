import { Router } from "express";
import { BoxController } from "@/controllers/box.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validators";
import { createBoxSchema, updateBoxSchema } from "@/schema/boxSchema";

const router = Router();

router.post("/boxes", authenticateToken, validate(createBoxSchema), BoxController.create);
router.get("/boxes", authenticateToken, BoxController.getBoxes);
router.get("/boxes/:id", authenticateToken, BoxController.getBoxById);
router.put("/boxes/:id", authenticateToken, validate(updateBoxSchema), BoxController.update);
router.delete("/boxes/:id", authenticateToken, BoxController.delete);
router.put("/boxes/:id/visibility", authenticateToken, BoxController.changeVisibility);

export default router;