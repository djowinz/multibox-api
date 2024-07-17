export class ServiceError extends Error {
    public description: string;
    public code: string | number;

    constructor(message: string, code: string | number) {
        super(message);
        this.name = 'ServiceError';
        this.description = message;
        this.code = code;
    }
}
