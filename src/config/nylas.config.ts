import { registerAs } from '@nestjs/config';

export default registerAs('nylas', () => ({
    clientId: process.env.NYLAS_CLIENT_ID,
    clientSecret: process.env.NYLAS_CLIENT_SECRET,
    redirectUri: process.env.NYLAS_REDIRECT_URI,
    codeVerifier: process.env.NYLAS_CODE_VERIFIER,
    apiUrl: process.env.NYLAS_API_URL,
}));
