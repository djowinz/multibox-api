"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = void 0;
class ServiceError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ServiceError';
        this.description = message;
        this.code = code;
    }
}
exports.ServiceError = ServiceError;
//# sourceMappingURL=custom.error.js.map