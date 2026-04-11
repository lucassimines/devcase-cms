import { HttpError } from "@src/errors/http.error.js";

export class NotFoundError extends HttpError {
    constructor(message = "Resource not found") {
        super(404, message);
    }
}
