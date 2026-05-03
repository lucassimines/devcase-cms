import { HttpError } from "@src/errors/http.error.js";
import type { NextFunction, Request, Response } from "express";

function hasHttpStatus(err: unknown): err is { status?: number; statusCode?: number; message?: string } {
    return (
        typeof err === "object" &&
        err !== null &&
        (("statusCode" in err && typeof (err as { statusCode: unknown }).statusCode === "number") ||
            ("status" in err && typeof (err as { status: unknown }).status === "number"))
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

    // Supports http-errors and any error carrying status/statusCode
    if (hasHttpStatus(err)) {
        const statusCode = err.statusCode ?? err.status ?? 500;
        const message = err.message ?? (err instanceof Error ? err.message : "Error");
        return res.status(statusCode).json({ message: String(message) });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
}
