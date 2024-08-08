import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from 'src/domain/multibox/users/user.service';
import { User } from '@prisma/client';
declare const JwtStrategy_base: new (...args: any[]) => InstanceType<any>;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
