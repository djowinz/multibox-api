"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    host: process.env.SERVER_HOST || 'localhost',
}));
//# sourceMappingURL=app.config.js.map