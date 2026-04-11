import { UnauthorizedError } from "@src/errors/index.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const { REFRESH_TOKEN_SECRET } = process.env;

export default (req: Request, _res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    try {
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET ?? "");
    } catch {
        throw new UnauthorizedError("Expired token");
    }

    next();
};
