import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { hashPassword, verifyPassword, authenticateToken } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validators";
import { authLimiter, passwordResetLimiter } from "@/middlewares/rateLimit";
import { createUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema } from "@/schema/userSchema";

const router = Router();

router.post("/auth/register", authLimiter, validate(createUserSchema), hashPassword, AuthController.register);
router.post("/auth/login", authLimiter, validate(loginUserSchema), verifyPassword, AuthController.login);
router.get("/auth/me", authenticateToken, AuthController.me);
router.post("/auth/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/auth/reset-password", passwordResetLimiter, validate(resetPasswordSchema), hashPassword, AuthController.resetPassword);

export default router;
