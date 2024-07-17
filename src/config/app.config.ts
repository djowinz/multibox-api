import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    host: process.env.SERVER_HOST || 'localhost',
}));
