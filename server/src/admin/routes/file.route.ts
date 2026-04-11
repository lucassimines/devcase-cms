import { FileController } from "@src/admin/controllers/file.controller.js";
import fileUploadMiddleware from "@src/admin/middleware/file-upload.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/", FileController.index);
router.delete("/", FileController.delete);
router.post("/create", fileUploadMiddleware, FileController.createMany);

export default router;
