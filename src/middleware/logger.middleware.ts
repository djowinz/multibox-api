import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');
    
    use(req: Request, res: Response, next: Function) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';
    
        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length');
            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
            );
        });
    
        next();
    }
}