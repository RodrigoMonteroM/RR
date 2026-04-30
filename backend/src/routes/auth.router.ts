import { Router } from "express";
import { register, login, me, forgotPassword, resetPassword } from "@/controllers/auth.controller";
import { hashPassword, verifyPassword, authenticateToken } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validators";
import { createUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema } from "@/schema/userSchema";

const router = Router();

router.post("/auth/register", validate(createUserSchema), hashPassword, register);
router.post("/auth/login", validate(loginUserSchema), verifyPassword, login);
router.get("/auth/me", authenticateToken, me);
router.post("/auth/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/auth/reset-password", validate(resetPasswordSchema), hashPassword, resetPassword);

export default router;
