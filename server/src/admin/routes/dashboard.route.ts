import { DashboardController } from "@src/admin/controllers/dashboard.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", DashboardController.index);

export default router;
