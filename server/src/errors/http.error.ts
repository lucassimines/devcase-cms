export class HttpError extends Error {
    public readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;

        // Fix prototype chain (important in TS)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
