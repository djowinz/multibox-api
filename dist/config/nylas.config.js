"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('nylas', () => ({
    clientId: process.env.NYLAS_CLIENT_ID,
    clientSecret: process.env.NYLAS_CLIENT_SECRET,
    redirectUri: process.env.NYLAS_REDIRECT_URI,
    codeVerifier: process.env.NYLAS_CODE_VERIFIER,
    apiUrl: process.env.NYLAS_API_URL,
}));
//# sourceMappingURL=nylas.config.js.map