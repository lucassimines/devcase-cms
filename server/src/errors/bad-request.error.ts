import { HttpError } from "@src/errors/http.error.js";

export class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(400, message);
    }
}
