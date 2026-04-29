import { Router } from "express";
import UserController from "@/controllers/user.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/users/search", authenticateToken, UserController.searchUsers);
router.get("/users/:nickname", UserController.getUser);

export default router;
