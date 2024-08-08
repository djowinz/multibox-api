import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/domain/multibox/users/user.service';
import { CallbackDto } from './dto/callback.dto';
export declare class AuthController {
    private readonly userService;
    private readonly configService;
    private readonly logger;
    constructor(userService: UserService, configService: ConfigService);
    callback(headers: Record<string, string>, callbackDto: CallbackDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
