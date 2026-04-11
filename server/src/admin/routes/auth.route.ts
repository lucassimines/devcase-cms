import { AuthController } from "@src/admin/controllers/auth.controller.js";
import verifyRefreshTokenMiddleware from "@src/admin/middleware/verify-refresh-token.middleware.js";
import express from "express";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.get("/user", AuthController.fetchAuthenticatedUser);
router.post("/refresh-token", verifyRefreshTokenMiddleware, AuthController.refreshToken);
// router.post('/resetpassword/link', AuthController.sendResetPasswordLink);
// router.post('/resetpassword', AuthController.resetPassword);

export default router;
