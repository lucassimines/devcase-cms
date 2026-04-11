export default class HttpException extends Error {
    constructor(readonly status: number, override readonly message = "") {
        super(message);
        this.name = "HttpException";
        Object.setPrototypeOf(this, new.target.prototype);
        Object.defineProperty(this, "message", {
            enumerable: true,
            writable: true,
            configurable: true,
            value: message
        });
    }
}
