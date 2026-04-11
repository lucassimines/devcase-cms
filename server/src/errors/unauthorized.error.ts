import { HttpError } from "@src/errors/http.error.js";

export class UnauthorizedError extends HttpError {
    constructor(message = "Invalid credentials") {
        super(401, message);
    }
}
