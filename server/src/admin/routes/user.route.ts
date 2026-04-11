import { UserController } from "@src/admin/controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.put("/profile", UserController.update);

export default router;
