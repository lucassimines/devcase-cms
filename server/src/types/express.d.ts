import type { CategoryType } from "@src/generated/prisma/enums.ts";
import type { AuthUser } from "@src/types/auth.js";

declare global {
    namespace Express {
        interface Request {
            categoryType?: CategoryType;
            user: AuthUser;
        }
    }
}

export {};
