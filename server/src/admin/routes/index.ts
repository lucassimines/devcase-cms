import { VerifyApiTokenMiddleware } from "@src/admin/middleware/verify-api-token.middleware.js";
import { requestContext } from "@src/request-context.js";
import { Router } from "express";

import clientRouter from "./client.route.js";
import dashboardRouter from "./dashboard.route.js";
import fileRouter from "./file.route.js";
import paymentRouter from "./payment.route.js";
import taskRouter from "./task.route.js";
import userRouter from "./user.route.js";

const router = Router();

router.use(VerifyApiTokenMiddleware);
router.use((req, _res, next) => {
    requestContext.run({ userId: req.user.id }, next);
});

const routes = [
    ["dashboard", dashboardRouter],
    ["file", fileRouter],
    ["user", userRouter],
    ["client", clientRouter],
    ["task", taskRouter],
    ["payment", paymentRouter]
] as const;

for (const [path, route] of routes) {
    router.use(`/${path}`, route);
}

export default router;
