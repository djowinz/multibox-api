import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from 'src/domain/multibox/users/user.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
    private readonly userService: UserService;
    constructor(configService: ConfigService, userService: UserService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${configService.get<string>(
                    'auth.domain',
                )}/.well-known/jwks.json`,
            }),

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: configService.get<string>('auth.audience'),
            issuer: `https://${configService.get<string>('auth.domain')}/`,
            algorithms: ['RS256'],
        });

        this.userService = userService;
    }

    async validate(payload: JwtPayload): Promise<User> {
        const minimumScope = ['openid', 'profile', 'email'];

        if (
            payload?.scope
                ?.split(' ')
                .filter((scope) => minimumScope.indexOf(scope) > -1).length !==
            3
        ) {
            throw new UnauthorizedException(
                'JWT does not possess the required scope (`openid profile email`).',
            );
        }

        try {
            const user = await this.userService.getUserByEmail(payload.email);
            return user;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('User not found');
        }
    }
}
