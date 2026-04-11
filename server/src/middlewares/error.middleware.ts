import { HttpError } from "@src/errors/http.error.js";
import type { NextFunction, Request, Response } from "express";

function hasStatusCode(err: unknown): err is { statusCode: number; message?: string } {
    return (
        typeof err === "object" &&
        err !== null &&
        "statusCode" in err &&
        typeof (err as { statusCode: unknown }).statusCode === "number"
    );
}

export default function errorMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // http-errors package (used in errors.utils) and any error with statusCode
    if (hasStatusCode(err)) {
        const message = err.message ?? (err instanceof Error ? err.message : "Error");
        return res.status(err.statusCode).json({ message: String(message) });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
}
