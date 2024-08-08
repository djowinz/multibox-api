export declare class ServiceError extends Error {
    description: string;
    code: string | number;
    constructor(message: string, code: string | number);
}
