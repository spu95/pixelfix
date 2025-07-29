export class PixelFixApiException extends Error {

    constructor(
        public readonly statusCode: number,
        public readonly errorCode: string,
        public readonly response: Response | null,
        message: string,
    ) {
        super(message);
        this.name = 'PixelFixApiException';
        Object.setPrototypeOf(this, PixelFixApiException.prototype);
    }
}