import { BadRequestError, UnauthorizedError } from "@src/errors/index.js";
import type { AuthUser } from "@src/types/auth.js";
import { parseNonEmptyString } from "@src/utils/predicates.utils.js";
import { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET } = process.env;

export function VerifyApiTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    let token = parseNonEmptyString(authHeader);

    if (!token) throw new BadRequestError("Missing token");

    token = token.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    try {
        // Verify user from token
        const { id, email } = jwt.verify(token, ACCESS_TOKEN_SECRET ?? "") as JwtPayload & AuthUser;

        // Set user to request
        req.user = { id, email };
    } catch (error) {
        throw new UnauthorizedError("Invalid token");
    }

    next();
}
